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
  const digits = number.replace(/[^0-9]/g, '');
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
