/**
 * Formats price in Indian currency format (e.g. ₹ 55 Lakhs, ₹ 1.35 Cr, ₹ 22,000)
 */
export const formatPrice = (price, priceUnit = 'INR') => {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return 'Price on Request';
  }

  const num = Number(price);

  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹ ${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }

  if (num >= 100000) {
    const lakh = num / 100000;
    return `₹ ${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }

  return `₹ ${num.toLocaleString('en-IN')}`;
};

/**
 * Format raw numbers with Indian commas (e.g., 2,50,000)
 */
export const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('en-IN');
};

/**
 * Format property area with unit (e.g., 1,750 sq.ft)
 */
export const formatArea = (area, unit = 'sqft') => {
  if (!area) return 'N/A';
  const unitLabel = {
    sqft: 'sq.ft',
    sqyd: 'sq.yd',
    sqm: 'sq.m',
    acre: 'Acres',
  }[unit] || unit;

  return `${formatNumber(area)} ${unitLabel}`;
};

/**
 * Format readable dates
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Clean status string to human label (e.g. READY_TO_MOVE -> Ready to Move)
 */
export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};
