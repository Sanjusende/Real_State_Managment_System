import Enquiry from '../models/Enquiry.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';

export const createEnquiry = async (enquiryData, user) => {
  const { propertyId, name, email, phone, message } = enquiryData;

  if (!propertyId || !name || !email || !phone || !message) {
    throw new ApiError(400, 'Please provide all required enquiry details');
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  const recipient = property.agent || property.owner;
  if (!recipient) {
    throw new ApiError(400, 'No recipient agent or owner found for this property');
  }

  const enquiry = await Enquiry.create({
    property: property._id,
    sender: user?._id || user?.id || null,
    recipient,
    name,
    email,
    phone,
    message,
  });

  try {
    await Notification.create({
      recipient,
      sender: user?._id || user?.id || null,
      type: 'NEW_ENQUIRY',
      title: 'New Property Lead! 📩',
      message: `${name} (${phone}) sent an enquiry regarding "${property.title}": "${message.slice(0, 120)}..."`,
      relatedProperty: property._id,
    });
  } catch (err) {
    console.error('Failed to dispatch enquiry notification:', err);
  }

  return enquiry;
};

export const updateEnquiryStatus = async (enquiryId, status, notes, user) => {
  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) {
    throw new ApiError(404, 'Enquiry not found');
  }

  const userId = user._id?.toString() || user.id?.toString();
  if (enquiry.recipient.toString() !== userId && user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to update this enquiry');
  }

  if (status) enquiry.status = status;
  if (notes !== undefined) enquiry.notes = notes;
  await enquiry.save();

  if (enquiry.sender) {
    try {
      await Notification.create({
        recipient: enquiry.sender,
        sender: userId,
        type: 'ENQUIRY_RESPONSE',
        title: 'Response to your Property Enquiry 💬',
        message: `Your inquiry status has been updated to "${status || enquiry.status}".${notes ? ` Note: "${notes}"` : ''}`,
        relatedProperty: enquiry.property,
      });
    } catch (err) {
      console.error('Failed to dispatch reply notification:', err);
    }
  }

  return enquiry;
};
