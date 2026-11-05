export function formatPrice(value) {
  if (value === null || value === undefined) return '';
  const n = Number(value);
  if (Number.isNaN(n)) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(n);
}

export function whatsappLink(number, message) {
  if (!number) return '#';
  let digits = number.replace(/[^0-9]/g, '');
  // Indian 10-digit numbers need the 91 country code for wa.me to work
  if (digits.length === 10) digits = '91' + digits;
  else if (digits.length === 11 && digits.startsWith('0')) digits = '91' + digits.slice(1);
  const text = encodeURIComponent(message || 'Hello, I am interested in a property listed on your website.');
  return `https://wa.me/${digits}?text=${text}`;
}

export function parsePhotos(photosJson) {
  try {
    const arr = JSON.parse(photosJson || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function slugifyTitle(title) {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
