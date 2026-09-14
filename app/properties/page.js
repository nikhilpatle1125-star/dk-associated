import { prisma } from '../../lib/prisma';
import PropertyCard from '../../components/PropertyCard';

export const metadata = { title: 'Properties' };
export const revalidate = 0;

export default async function PropertiesPage({ searchParams }) {
  const type = searchParams?.type;
  const status = searchParams?.status;

  const where = {};
  if (type === 'PLOT' || type === 'FLAT') where.type = type;
  if (status) where.status = status;

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  const filters = [
    { label: 'All', href: '/properties' },
    { label: 'Plots', href: '/properties?type=PLOT' },
    { label: 'Flats', href: '/properties?type=FLAT' },
    { label: 'Available', href: '/properties?status=AVAILABLE' }
  ];

  return (
    <div className="container-page py-14 md:py-20">
      <h1 className="font-display text-4xl text-[var(--forest)] mb-3">Properties</h1>
      <p className="text-[var(--ink)]/70 mb-8">Browse current plots and flats.</p>

      <div className="flex flex-wrap gap-3 mb-10">
        {filters.map((f) => (
          <a
            key={f.href}
            href={f.href}
            className="text-sm px-4 py-2 border border-[var(--line)] hover:border-[var(--forest)] hover:text-[var(--forest)] transition-colors focus-ring"
          >
            {f.label}
          </a>
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="border border-dashed border-[var(--line)] p-12 text-center text-[var(--ink)]/60">
          No properties match this filter yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
