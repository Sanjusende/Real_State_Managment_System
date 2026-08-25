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
 * Sends WhatsApp notification via CallMeBot Free WhatsApp API.
 * @param {string} phone
 * @param {string} apiKey
 * @param {string} message
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
const sendViaCallMeBot = async (phone, apiKey, message) => {
  const cleanPhone = phone.startsWith('+') ? phone : `+${phone}`;
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(cleanPhone)}&text=${encodedMessage}&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url, { method: 'GET' });
    const text = await response.text();

    if (response.ok && (text.includes('Message queued') || text.includes('success') || text.includes('OK') || response.status === 200)) {
      console.log(`[Contact WhatsApp] Free CallMeBot WhatsApp notification delivered to ${cleanPhone}`);
      return { success: true, provider: 'callmebot', messageId: 'cmb_' + Date.now() };
    }

    console.warn(`[Contact WhatsApp Warning] CallMeBot response: ${text}`);
    return { success: false, provider: 'callmebot', error: text };
  } catch (err) {
    console.error(`[Contact WhatsApp Error] CallMeBot request error: ${err.message}`);
    return { success: false, provider: 'callmebot', error: err.message };
  }
};

/**
 * Sends a WhatsApp notification to ADMIN using either CallMeBot (Free personal gateway) or Meta WhatsApp Cloud API.
 * 
 * @param {Object} enquiry - Contact enquiry object containing name, email, phone, subject, message
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string, skipped?: boolean }>}
 */
export const sendWhatsAppNotification = async (enquiry) => {
  const { ACCESS_TOKEN, PHONE_NUMBER_ID, ADMIN_NUMBER, API_VERSION, CALLMEBOT_API_KEY } = ENV.WHATSAPP;

  const adminPhone = ADMIN_NUMBER || '+918815926552';

  const messageText = `🚨 *New Contact Enquiry - EstateCraft*\n\n` +
    `*Name:* ${enquiry.name}\n` +
    `*Email:* ${enquiry.email}\n` +
    `*Phone:* ${enquiry.phone}\n` +
    `*Subject:* ${enquiry.subject}\n\n` +
    `*Message:*\n${enquiry.message}\n\n` +
    `_Please check your admin dashboard._`;

  // 1. Check if CallMeBot Free API Key is configured
  if (CALLMEBOT_API_KEY) {
    return await sendViaCallMeBot(adminPhone, CALLMEBOT_API_KEY, messageText);
  }

  // 2. Otherwise, check if Meta WhatsApp Cloud API credentials are configured
  if (ACCESS_TOKEN && PHONE_NUMBER_ID && ADMIN_NUMBER) {
    const recipient = formatWhatsAppRecipient(ADMIN_NUMBER);
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
        const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error(`[Contact WhatsApp Error] Meta API error: ${errorMsg}`);
        return { success: false, provider: 'meta', error: errorMsg };
      }

      const messageId = data?.messages?.[0]?.id || 'delivered';
      console.log(`[Contact WhatsApp] Meta WhatsApp notification sent to admin (ID: ${messageId})`);
      return { success: true, provider: 'meta', messageId };
    } catch (error) {
      console.error(`[Contact WhatsApp Error] Meta API network error: ${error.message}`);
      return { success: false, provider: 'meta', error: error.message };
    }
  }

  // 3. Neither configured - skip gracefully
  console.log('[Contact WhatsApp] WhatsApp credentials not configured. Skipping WhatsApp notification.');
  return {
    success: false,
    skipped: true,
    reason: 'Neither CallMeBot API Key nor Meta Cloud API credentials configured',
  };
};

export default {
  sendWhatsAppNotification,
};
