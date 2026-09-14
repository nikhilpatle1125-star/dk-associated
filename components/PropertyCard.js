import Link from 'next/link';
import { formatPrice, parsePhotos } from '../lib/utils';

const statusClass = {
  AVAILABLE: 'badge-available',
  SOLD: 'badge-sold',
  ON_HOLD: 'badge-hold',
  BOOKED: 'badge-booked'
};

const statusLabel = {
  AVAILABLE: 'Available',
  SOLD: 'Sold',
  ON_HOLD: 'On Hold',
  BOOKED: 'Booked'
};

export default function PropertyCard({ property }) {
  const photos = parsePhotos(property.photos);
  const cover = photos[0];

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block border border-[var(--line)] bg-white/60 hover:bg-white transition-colors focus-ring"
    >
      <div className="relative aspect-[4/3] bg-[var(--line)] overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={property.title}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[var(--ink)]/40 text-sm">
            No photo yet
          </div>
        )}
        <span className={`badge absolute top-3 left-3 ${statusClass[property.status] || 'badge-available'}`}>
          {statusLabel[property.status] || property.status}
        </span>
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-wide text-[var(--clay)] font-semibold mb-1">
          {property.type === 'PLOT' ? 'Plot' : 'Flat'}
        </div>
        <h3 className="font-display text-lg text-[var(--forest)] leading-snug">{property.title}</h3>
        <p className="text-sm text-[var(--ink)]/70 mt-1">{property.city}</p>
        <div className="flex items-baseline justify-between mt-3">
          <span className="font-semibold">{property.priceLabel || formatPrice(property.price)}</span>
          <span className="text-sm text-[var(--ink)]/70">{property.area} {property.areaUnit}</span>
        </div>
      </div>
    </Link>
  );
}
