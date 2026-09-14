import Link from 'next/link';
import { prisma } from '../lib/prisma';
import PropertyCard from '../components/PropertyCard';

export const revalidate = 0;

async function getData() {
  const [settings, featured, availableCount] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null),
    prisma.property.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    }).catch(() => []),
    prisma.property.count({ where: { status: 'AVAILABLE' } }).catch(() => 0)
  ]);

  let properties = featured;
  if (properties.length === 0) {
    properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6
    }).catch(() => []);
  }

  return { settings, properties, availableCount };
}

export default async function HomePage() {
  const { settings, properties, availableCount } = await getData();

  return (
    <div>
      <section
        className="relative border-b border-[var(--line)]"
        style={
          settings?.heroImageUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(18,53,36,0.72), rgba(18,53,36,0.85)), url(${settings.heroImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }
            : { backgroundColor: 'var(--forest)' }
        }
      >
        <div className="container-page py-24 md:py-32 text-white">
          <p className="uppercase tracking-wide text-sm text-[var(--clay-light)] font-semibold mb-4">
            {settings?.address || 'Property advisory'}
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-2xl">
            {settings?.tagline || 'Trusted plots & flats, built on transparency.'}
          </h1>
          <p className="mt-6 max-w-xl text-white/85">
            {settings?.aboutText
              ? settings.aboutText.slice(0, 220)
              : 'Browse verified plots and flats, backed by clear documentation and a team that answers.'}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/properties" className="btn-primary focus-ring">
              View properties
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/50 text-white px-6 py-3 rounded-sm hover:bg-white/10 transition-colors focus-ring">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl text-[var(--forest)]">
              {properties.some((p) => p.featured) ? 'Featured listings' : 'Latest listings'}
            </h2>
            <p className="text-[var(--ink)]/70 mt-2">
              {availableCount} propert{availableCount === 1 ? 'y' : 'ies'} currently available
            </p>
          </div>
          <Link href="/properties" className="btn-outline focus-ring">
            See all properties
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="border border-dashed border-[var(--line)] p-12 text-center text-[var(--ink)]/60">
            No properties listed yet. Add your first one from the admin dashboard.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border-t border-[var(--line)]">
        <div className="container-page py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl text-[var(--forest)] mb-4">About {settings?.companyName || 'us'}</h2>
            <p className="text-[var(--ink)]/80 leading-relaxed whitespace-pre-line">
              {settings?.aboutText || 'Add a company description from the admin dashboard so visitors know who they are dealing with.'}
            </p>
            <Link href="/about" className="btn-outline mt-6 inline-flex focus-ring">
              Read more
            </Link>
          </div>
          <div className="border border-[var(--line)] p-8 bg-[var(--paper)]">
            <h3 className="font-display text-xl text-[var(--forest)] mb-4">Reach us directly</h3>
            <ul className="space-y-3 text-sm">
              {settings?.phone && <li>Call: <a href={`tel:${settings.phone}`} className="font-medium hover:underline focus-ring">{settings.phone}</a></li>}
              {settings?.email && <li>Email: <a href={`mailto:${settings.email}`} className="font-medium hover:underline focus-ring">{settings.email}</a></li>}
              {settings?.address && <li>Visit: <span className="font-medium">{settings.address}</span></li>}
              {!settings?.phone && !settings?.email && !settings?.address && (
                <li className="text-[var(--ink)]/60">Add contact details from the admin settings page.</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
