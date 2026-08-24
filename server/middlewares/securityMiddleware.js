/**
 * Strip malicious script tags, javascript protocols, and dangerous event handlers
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on(load|error|click|mouseover|submit|focus|blur)\s*=/gi, '');
};

/**
 * Recursive sanitizer that removes keys beginning with '$' or containing '.'
 * to prevent NoSQL query operator injection attacks and sanitizes strings.
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Drop keys starting with $ or containing dots to block operator injection
    if (!key.startsWith('$') && !key.includes('.')) {
      sanitized[key] = typeof value === 'object' && value !== null
        ? sanitizeObject(value)
        : (typeof value === 'string' ? sanitizeString(value) : value);
    }
  }
  return sanitized;
};

export const sanitizeNoSql = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

export default sanitizeNoSql;
