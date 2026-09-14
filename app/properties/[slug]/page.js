import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import { formatPrice, parsePhotos, whatsappLink } from '../../../lib/utils';

export const revalidate = 0;

async function getProperty(slug) {
  return prisma.property.findUnique({ where: { slug } }).catch(() => null);
}

export async function generateMetadata({ params }) {
  const property = await getProperty(params.slug);
  if (!property) return {};
  return {
    title: property.title,
    description: property.description?.slice(0, 155)
  };
}

const statusLabel = {
  AVAILABLE: 'Available',
  SOLD: 'Sold',
  ON_HOLD: 'On Hold',
  BOOKED: 'Booked'
};

export default async function PropertyDetailPage({ params }) {
  const [property, settings] = await Promise.all([
    getProperty(params.slug),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null)
  ]);

  if (!property) notFound();

  const photos = parsePhotos(property.photos);
  const waMessage = `Hi, I'm interested in "${property.title}" listed on your website.`;

  return (
    <div className="container-page py-12 md:py-16">
      <div className="mb-6 text-sm text-[var(--ink)]/60">
        <span className="uppercase tracking-wide text-[var(--clay)] font-semibold">
          {property.type === 'PLOT' ? 'Plot' : 'Flat'}
        </span>
        <span className="mx-2">·</span>
        <span>{statusLabel[property.status] || property.status}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {photos.length > 0 ? (
            <div className="grid gap-2">
              <div className="aspect-[16/10] bg-[var(--line)] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photos[0]} alt={property.title} className="h-full w-full object-cover" />
              </div>
              {photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {photos.slice(1, 5).map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt={`${property.title} photo ${i + 2}`} className="aspect-square object-cover w-full" />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[16/10] bg-[var(--line)] flex items-center justify-center text-[var(--ink)]/40">
              No photos yet
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl text-[var(--forest)] mt-8">{property.title}</h1>
          <p className="text-[var(--ink)]/70 mt-1">{property.address ? `${property.address}, ` : ''}{property.city}</p>

          <div className="prose-none mt-6 whitespace-pre-line text-[var(--ink)]/85 leading-relaxed">
            {property.description || 'No description added yet.'}
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm border-t border-[var(--line)] pt-8">
            <Detail label="Price" value={property.priceLabel || formatPrice(property.price)} />
            <Detail label="Area" value={`${property.area} ${property.areaUnit}`} />
            {property.type === 'PLOT' ? (
              <>
                <Detail label="Dimensions" value={property.plotDimensions} />
                <Detail label="Facing" value={property.facing} />
                <Detail label="Corner plot" value={property.cornerPlot ? 'Yes' : 'No'} />
                <Detail label="Boundary wall" value={property.boundaryWall ? 'Yes' : 'No'} />
              </>
            ) : (
              <>
                <Detail label="Configuration" value={property.bhk} />
                <Detail label="Floor" value={property.floor} />
                <Detail label="Total floors" value={property.totalFloors} />
                <Detail label="Furnishing" value={property.furnishing} />
                <Detail label="Parking" value={property.parking ? 'Available' : 'Not available'} />
              </>
            )}
          </div>

          {(property.layoutMapUrl || property.brochureUrl) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {property.layoutMapUrl && (
                <a href={property.layoutMapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline focus-ring">
                  View layout map
                </a>
              )}
              {property.brochureUrl && (
                <a href={property.brochureUrl} target="_blank" rel="noopener noreferrer" className="btn-outline focus-ring">
                  Download brochure
                </a>
              )}
            </div>
          )}
        </div>

        <aside className="border border-[var(--line)] p-6 h-fit sticky top-28 bg-white">
          <div className="text-2xl font-display text-[var(--forest)]">
            {property.priceLabel || formatPrice(property.price)}
          </div>
          <p className="text-sm text-[var(--ink)]/60 mt-1">{property.area} {property.areaUnit}</p>
          <div className="mt-6 grid gap-3">
            {settings?.whatsapp && (
              <a href={whatsappLink(settings.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center focus-ring">
                Enquire on WhatsApp
              </a>
            )}
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="btn-outline justify-center focus-ring">
                Call {settings.phone}
              </a>
            )}
            <a href={`/contact?property=${encodeURIComponent(property.title)}`} className="text-center text-sm underline underline-offset-4 focus-ring">
              Or send a message
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between border-b border-[var(--line)] pb-2">
      <span className="text-[var(--ink)]/60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
