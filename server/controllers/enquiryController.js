import Enquiry from '../models/Enquiry.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// @desc    Submit an enquiry for a property
// @route   POST /api/v1/enquiries
// @access  Public / Optional Auth
export const createEnquiry = asyncHandler(async (req, res) => {
  const { propertyId, name, email, phone, message } = req.body;

  if (!propertyId || !name || !email || !phone || !message) {
    throw new ApiError(400, 'Please provide all required enquiry details');
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Recipient is the assigned agent or owner
  const recipient = property.agent || property.owner;
  if (!recipient) {
    throw new ApiError(400, 'No recipient agent or owner found for this property');
  }

  const enquiry = await Enquiry.create({
    property: property._id,
    sender: req.user?._id || null,
    recipient,
    name,
    email,
    phone,
    message,
  });

  // Dispatch real-time in-app notification to property consultant/owner
  try {
    await Notification.create({
      recipient,
      sender: req.user?._id || null,
      type: 'NEW_ENQUIRY',
      title: 'New Property Lead! 📩',
      message: `${name} (${phone}) sent an enquiry regarding "${property.title}": "${message.slice(0, 120)}..."`,
      relatedProperty: property._id,
    });
  } catch (notifErr) {
    console.error('Failed to dispatch new enquiry notification:', notifErr);
  }

  res.status(201).json(new ApiResponse(201, 'Enquiry submitted successfully', enquiry));
});

// @desc    Get user's submitted enquiries
// @route   GET /api/v1/enquiries/my-enquiries
// @access  Private (USER, AGENT, SELLER, ADMIN)
export const getMyEnquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  // If user has email or sender id
  const query = {
    $or: [{ sender: req.user._id }, { email: req.user.email }],
  };

  const [enquiries, total] = await Promise.all([
    Enquiry.find(query)
      .populate('property', 'title slug price priceUnit thumbnail images city state propertyType listingType')
      .populate('recipient', 'name email phone avatar agencyName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(200, 'User enquiries retrieved', {
      enquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

// @desc    Get enquiries received by the logged in agent/seller
// @route   GET /api/v1/enquiries/received
// @access  Private (AGENT, SELLER, ADMIN)
export const getReceivedEnquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const { status, propertyId } = req.query;

  const query = { recipient: req.user._id };
  if (status) query.status = status;
  if (propertyId) query.property = propertyId;

  const [enquiries, total] = await Promise.all([
    Enquiry.find(query)
      .populate('property', 'title slug price priceUnit thumbnail images city state')
      .populate('sender', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(200, 'Received enquiries retrieved', {
      enquiries,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

// @desc    Update enquiry status and notes
// @route   PATCH /api/v1/enquiries/:id/status
// @access  Private (AGENT, SELLER, ADMIN)
export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    throw new ApiError(404, 'Enquiry not found');
  }

  // Security check: Must be the recipient or Admin
  if (enquiry.recipient.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not authorized to update this enquiry');
  }

  if (status) enquiry.status = status;
  if (notes !== undefined) enquiry.notes = notes;

  await enquiry.save();

  // Notify the prospective buyer if they are an active platform user
  if (enquiry.sender) {
    try {
      await Notification.create({
        recipient: enquiry.sender,
        sender: req.user._id,
        type: 'ENQUIRY_RESPONSE',
        title: 'Response to your Property Enquiry 💬',
        message: `Your inquiry has been updated to "${status || enquiry.status}".${notes ? ` Note: "${notes}"` : ''}`,
        relatedProperty: enquiry.property,
      });
    } catch (notifErr) {
      console.error('Failed to notify inquiry sender:', notifErr);
    }
  }

  res.status(200).json(new ApiResponse(200, 'Enquiry updated successfully', enquiry));
});
