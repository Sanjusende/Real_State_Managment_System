/**
 * Recursive sanitizer that removes keys beginning with '$' or containing '.'
 * to prevent NoSQL query operator injection attacks.
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Drop keys starting with $ or containing dots
    if (!key.startsWith('$') && !key.includes('.')) {
      sanitized[key] = typeof value === 'object' && value !== null ? sanitizeObject(value) : value;
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
