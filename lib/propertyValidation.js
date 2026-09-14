import { slugifyTitle } from './utils';

const ALLOWED_STATUS = ['AVAILABLE', 'SOLD', 'ON_HOLD', 'BOOKED'];

export function buildPropertyData(body, existingSlug) {
  if (!body?.title || !body?.type || body?.price === undefined || body?.area === undefined) {
    throw new Error('Title, type, price and area are required.');
  }
  if (!['PLOT', 'FLAT'].includes(body.type)) {
    throw new Error('Type must be PLOT or FLAT.');
  }
  const status = ALLOWED_STATUS.includes(body.status) ? body.status : 'AVAILABLE';

  const data = {
    title: String(body.title).slice(0, 200),
    slug: existingSlug || slugifyTitle(body.title) + '-' + Date.now().toString(36),
    type: body.type,
    price: Number(body.price) || 0,
    priceLabel: body.priceLabel ? String(body.priceLabel).slice(0, 100) : null,
    area: Number(body.area) || 0,
    areaUnit: body.areaUnit ? String(body.areaUnit).slice(0, 30) : 'sq.ft.',
    status,
    description: body.description ? String(body.description).slice(0, 5000) : '',
    address: body.address ? String(body.address).slice(0, 300) : '',
    city: body.city ? String(body.city).slice(0, 100) : '',
    mapLink: body.mapLink || null,
    photos: JSON.stringify(Array.isArray(body.photos) ? body.photos.slice(0, 20) : []),
    layoutMapUrl: body.layoutMapUrl || null,
    brochureUrl: body.brochureUrl || null,
    featured: Boolean(body.featured)
  };

  if (body.type === 'PLOT') {
    data.plotDimensions = body.plotDimensions ? String(body.plotDimensions).slice(0, 100) : null;
    data.facing = body.facing ? String(body.facing).slice(0, 50) : null;
    data.cornerPlot = Boolean(body.cornerPlot);
    data.boundaryWall = Boolean(body.boundaryWall);
    data.bhk = null;
    data.floor = null;
    data.totalFloors = null;
    data.furnishing = null;
    data.parking = false;
  } else {
    data.bhk = body.bhk ? String(body.bhk).slice(0, 20) : null;
    data.floor = body.floor ? String(body.floor).slice(0, 20) : null;
    data.totalFloors = body.totalFloors ? Number(body.totalFloors) : null;
    data.furnishing = body.furnishing ? String(body.furnishing).slice(0, 50) : null;
    data.parking = Boolean(body.parking);
    data.plotDimensions = null;
    data.facing = null;
    data.cornerPlot = false;
    data.boundaryWall = false;
  }

  return data;
}
