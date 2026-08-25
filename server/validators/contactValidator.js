const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Accepts standard international formats e.g. +919876543210, +1 555-123-4567, (123) 456-7890, 09876543210, 7-20 characters
const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;

/**
 * Validate Contact Us Form Submission Payload
 * @param {Object} data - Request body data
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string }> }}
 */
export const validateContact = (data = {}) => {
  const errors = [];

  // Name Validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else {
    const trimmedName = data.name.trim();
    if (trimmedName.length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    } else if (trimmedName.length > 100) {
      errors.push({ field: 'name', message: 'Name cannot exceed 100 characters' });
    }
  }

  // Email Validation
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email address is required' });
  } else {
    const trimmedEmail = data.email.trim();
    if (!emailRegex.test(trimmedEmail)) {
      errors.push({ field: 'email', message: 'Please provide a valid email address' });
    }
  }

  // Phone Validation
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else {
    const trimmedPhone = data.phone.trim();
    if (trimmedPhone.length > 20) {
      errors.push({ field: 'phone', message: 'Phone number cannot exceed 20 characters' });
    } else if (!phoneRegex.test(trimmedPhone)) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number' });
    }
  }

  // Subject Validation (default to 'General Enquiry' if not provided, or min 1 char)
  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    errors.push({ field: 'subject', message: 'Subject is required' });
  } else {
    const trimmedSubject = data.subject.trim();
    if (trimmedSubject.length > 150) {
      errors.push({ field: 'subject', message: 'Subject cannot exceed 150 characters' });
    }
  }

  // Message Validation (min 2 characters)
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else {
    const trimmedMessage = data.message.trim();
    if (trimmedMessage.length < 2) {
      errors.push({ field: 'message', message: 'Please provide a message with at least 2 characters' });
    } else if (trimmedMessage.length > 2000) {
      errors.push({ field: 'message', message: 'Message cannot exceed 2000 characters' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default validateContact;
