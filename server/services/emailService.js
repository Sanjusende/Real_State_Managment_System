import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

/**
 * Escapes unsafe HTML characters to prevent XSS / HTML injection in emails.
 * @param {string} str
 * @returns {string}
 */
const escapeHtml = (str = '') => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Creates Nodemailer Transporter instance based on ENV configuration.
 * Returns null if SMTP host/user is not configured.
 */
const createTransporter = () => {
  if (!ENV.SMTP.HOST || !ENV.SMTP.USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: ENV.SMTP.HOST,
    port: ENV.SMTP.PORT,
    secure: ENV.SMTP.PORT === 465, // true for 465, false for other ports (e.g. 587)
    auth: {
      user: ENV.SMTP.USER,
      pass: ENV.SMTP.PASSWORD,
    },
    // Useful timeout settings to prevent long-hanging connections
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

/**
 * Sends notification email to ADMIN upon contact form submission.
 * @param {Object} enquiry - The saved ContactEnquiry document
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string, skipped?: boolean }>}
 */
export const sendAdminContactNotification = async (enquiry) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('[Contact Email] SMTP credentials not configured. Skipping email notification.');
      return { success: false, skipped: true, reason: 'SMTP not configured' };
    }

    const adminEmail = ENV.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('[Contact Email] ADMIN_EMAIL is not specified. Skipping admin notification.');
      return { success: false, skipped: true, reason: 'ADMIN_EMAIL missing' };
    }

    const safeName = escapeHtml(enquiry.name);
    const safeEmail = escapeHtml(enquiry.email);
    const safePhone = escapeHtml(enquiry.phone);
    const safeSubject = escapeHtml(enquiry.subject);
    const safeMessage = escapeHtml(enquiry.message).replace(/\n/g, '<br>');
    const enquiryId = enquiry._id ? String(enquiry._id) : 'N/A';
    const submissionDate = enquiry.createdAt
      ? new Date(enquiry.createdAt).toUTCString()
      : new Date().toUTCString();

    const mailOptions = {
      from: `"${ENV.SMTP.FROM_NAME}" <${ENV.SMTP.FROM_EMAIL}>`,
      to: adminEmail,
      subject: `New Contact Enquiry - ${enquiry.subject}`,
      text: `New Contact Form Submission\n\nEnquiry ID: ${enquiryId}\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nSubject: ${enquiry.subject}\n\nMessage:\n${enquiry.message}\n\nSubmitted At: ${submissionDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #0f172a; padding: 24px 32px; color: #ffffff; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
            .header p { margin: 4px 0 0 0; font-size: 13px; color: #94a3b8; }
            .content { padding: 32px; }
            .badge { display: inline-block; padding: 4px 10px; background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
            .field-group { margin-bottom: 16px; }
            .field-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
            .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
            .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; color: #334155; line-height: 1.6; margin-top: 8px; }
            .footer { background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EstateCraft Admin Alert</h1>
              <p>New Contact Enquiry Received</p>
            </div>
            <div class="content">
              <span class="badge">Enquiry #${enquiryId}</span>
              
              <div class="field-group">
                <div class="field-label">Sender Name</div>
                <div class="field-value">${safeName}</div>
              </div>
              
              <div class="field-group">
                <div class="field-label">Email Address</div>
                <div class="field-value"><a href="mailto:${safeEmail}" style="color: #059669; text-decoration: none;">${safeEmail}</a></div>
              </div>
              
              <div class="field-group">
                <div class="field-label">Phone Number</div>
                <div class="field-value"><a href="tel:${safePhone}" style="color: #059669; text-decoration: none;">${safePhone}</a></div>
              </div>
              
              <div class="field-group">
                <div class="field-label">Subject</div>
                <div class="field-value">${safeSubject}</div>
              </div>
              
              <div class="field-group">
                <div class="field-label">Message</div>
                <div class="message-box">${safeMessage}</div>
              </div>
              
              <div class="field-group" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
                <div class="field-label">Submission Date</div>
                <div class="field-value" style="font-size: 13px; color: #64748b;">${submissionDate}</div>
              </div>
            </div>
            <div class="footer">
              This is an automated notification from EstateCraft Real Estate Management Platform.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Contact Email] Notification sent to admin (${adminEmail}) - MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Contact Email Error] Failed to send email to admin: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Sends acknowledgement email to the visitor if enabled.
 * @param {Object} enquiry - The saved ContactEnquiry document
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string, skipped?: boolean }>}
 */
export const sendVisitorAcknowledgement = async (enquiry) => {
  try {
    if (!ENV.CONTACT.AUTO_REPLY_ENABLED) {
      return { success: false, skipped: true, reason: 'Auto-reply disabled' };
    }

    const transporter = createTransporter();
    if (!transporter) {
      return { success: false, skipped: true, reason: 'SMTP not configured' };
    }

    const safeName = escapeHtml(enquiry.name);
    const safeSubject = escapeHtml(enquiry.subject);

    const mailOptions = {
      from: `"${ENV.SMTP.FROM_NAME}" <${ENV.SMTP.FROM_EMAIL}>`,
      to: enquiry.email,
      subject: `We received your enquiry - ${enquiry.subject}`,
      text: `Hello ${enquiry.name},\n\nThank you for contacting us regarding "${enquiry.subject}".\n\nWe have received your enquiry and our team will get back to you shortly.\n\nRegards,\nEstateCraft Real Estate Management Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; background: #f8fafc; padding: 20px; }
            .container { max-width: 540px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
            .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
            .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 16px; }
            .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="title">Thank you for reaching out!</div>
            <p class="text">Hello <strong>${safeName}</strong>,</p>
            <p class="text">We have successfully received your enquiry regarding <em>"${safeSubject}"</em>. Our advisory team is reviewing your message and will contact you promptly.</p>
            <p class="text">Regards,<br><strong>EstateCraft Management Team</strong></p>
            <div class="footer">EstateCraft Real Estate Platform &bull; Professional Property Advisory</div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Contact Email] Acknowledgement sent to visitor (${enquiry.email})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Contact Email Error] Failed to send visitor acknowledgement: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export default {
  sendAdminContactNotification,
  sendVisitorAcknowledgement,
};
