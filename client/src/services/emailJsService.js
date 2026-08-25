import emailjs from '@emailjs/browser';

/**
 * Sends a contact enquiry email using EmailJS directly from the browser.
 * 
 * @param {Object} data - { name, email, phone, subject, message }
 * @returns {Promise<{ success: boolean, error?: string, skipped?: boolean }>}
 */
export const sendEmailViaEmailJS = async (data) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.log('[EmailJS] VITE_EMAILJS_SERVICE_ID, TEMPLATE_ID or PUBLIC_KEY not configured. Skipping EmailJS dispatch.');
    return { success: false, skipped: true, reason: 'EmailJS credentials not set' };
  }

  const templateParams = {
    from_name: data.name,
    from_email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    to_name: 'EstateCraft Admin',
    submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  try {
    const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('[EmailJS] Email sent successfully:', result.status, result.text);
    return { success: true, text: result.text };
  } catch (error) {
    console.error('[EmailJS Error] Failed to send email via EmailJS:', error);
    return { success: false, error: error?.text || error?.message || 'EmailJS dispatch failed' };
  }
};

export default sendEmailViaEmailJS;
