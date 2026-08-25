import ContactEnquiry from '../models/ContactEnquiry.js';
import { sendAdminContactNotification, sendVisitorAcknowledgement } from './emailService.js';
import { sendWhatsAppNotification } from './whatsappService.js';
import ApiError from '../utils/ApiError.js';

/**
 * Handles creation and notification workflow for public Contact Us enquiries.
 * 
 * @param {Object} data - Contact form payload (name, email, phone, subject, message, website)
 * @returns {Promise<{ enquiryId: string }>}
 */
export const createContactEnquiry = async (data) => {
  const { name, email, phone, subject, message, website } = data;

  // Honeypot Anti-Spam Check
  // Legitimate users will have an empty string or undefined in the hidden 'website' field.
  if (website && typeof website === 'string' && website.trim().length > 0) {
    console.warn(`[Contact Spam] Honeypot field triggered from submission by '${name}' <${email}>. Silently dropping.`);
    // Return simulated success without database write or notifications
    return {
      enquiryId: 'spm_' + Math.random().toString(36).substring(2, 10),
      isSpam: true,
    };
  }

  // 1. Persist enquiry to MongoDB
  const enquiry = await ContactEnquiry.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
    status: 'new',
  });

  console.log(`[Contact] Enquiry document created successfully: ${enquiry._id}`);

  // 2. Trigger asynchronous notifications without blocking database success
  // A. Admin Email Notification
  sendAdminContactNotification(enquiry).catch((err) => {
    console.error(`[Contact Email] Asynchronous dispatch failed: ${err.message}`);
  });

  // B. Optional Visitor Acknowledgement Email
  sendVisitorAcknowledgement(enquiry).catch((err) => {
    console.error(`[Contact Email Auto-Reply] Asynchronous dispatch failed: ${err.message}`);
  });

  // C. Admin WhatsApp Notification (Official Cloud API)
  sendWhatsAppNotification(enquiry).catch((err) => {
    console.error(`[Contact WhatsApp] Asynchronous dispatch failed: ${err.message}`);
  });

  return {
    enquiryId: String(enquiry._id),
  };
};

export default {
  createContactEnquiry,
};
