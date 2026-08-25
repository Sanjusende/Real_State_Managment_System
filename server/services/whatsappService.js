import { ENV } from '../config/env.js';

/**
 * Normalizes phone number format for WhatsApp API (digits only with country code, no + or spaces).
 * @param {string} phone
 * @returns {string}
 */
const formatWhatsAppRecipient = (phone = '') => {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
};

/**
 * Sends a WhatsApp notification to ADMIN using the official Meta WhatsApp Business Cloud API.
 * Uses native fetch (Node.js 18+).
 * 
 * @param {Object} enquiry - Contact enquiry object containing name, email, phone, subject, message
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string, skipped?: boolean }>}
 */
export const sendWhatsAppNotification = async (enquiry) => {
  const { ACCESS_TOKEN, PHONE_NUMBER_ID, ADMIN_NUMBER, API_VERSION } = ENV.WHATSAPP;

  // Gracefully skip if WhatsApp credentials are not configured in environment
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID || !ADMIN_NUMBER) {
    console.log('[Contact WhatsApp] WhatsApp Cloud API credentials not configured. Skipping WhatsApp notification.');
    return {
      success: false,
      skipped: true,
      reason: 'WhatsApp credentials not configured',
    };
  }

  const recipient = formatWhatsAppRecipient(ADMIN_NUMBER);
  if (!recipient) {
    console.warn('[Contact WhatsApp] Invalid ADMIN_NUMBER for WhatsApp. Skipping.');
    return {
      success: false,
      skipped: true,
      reason: 'Invalid ADMIN_NUMBER',
    };
  }

  const messageText = `🚨 *New Contact Enquiry - EstateCraft*\n\n` +
    `*Name:* ${enquiry.name}\n` +
    `*Email:* ${enquiry.email}\n` +
    `*Phone:* ${enquiry.phone}\n` +
    `*Subject:* ${enquiry.subject}\n\n` +
    `*Message:*\n${enquiry.message}\n\n` +
    `_Please check the admin dashboard._`;

  const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: 'text',
    text: {
      preview_url: false,
      body: messageText,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Safe error logging: Meta error response without exposing tokens
      const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      const errorCode = data?.error?.code || 'UNKNOWN';
      console.error(`[Contact WhatsApp Error] Failed to send WhatsApp notification (Code: ${errorCode}): ${errorMsg}`);
      return {
        success: false,
        error: errorMsg,
        code: errorCode,
      };
    }

    const messageId = data?.messages?.[0]?.id || 'delivered';
    console.log(`[Contact WhatsApp] WhatsApp notification sent successfully to admin (ID: ${messageId})`);
    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error(`[Contact WhatsApp Error] Network or server error sending WhatsApp notification: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  sendWhatsAppNotification,
};
