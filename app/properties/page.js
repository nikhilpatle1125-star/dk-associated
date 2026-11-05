import { prisma } from '../../lib/prisma';
import PropertyCard from '../../components/PropertyCard';

export const metadata = { title: 'Properties' };
export const revalidate = 0;

export default async function PropertiesPage({ searchParams }) {
  const type = searchParams?.type;
  const status = searchParams?.status;
  const q = (searchParams?.q || '').toString().trim().slice(0, 80);
  const sort = searchParams?.sort;

  const where = {};
  if (type === 'PLOT' || type === 'FLAT') where.type = type;
  if (['AVAILABLE', 'SOLD', 'ON_HOLD', 'BOOKED'].includes(status)) where.status = status;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
      { address: { contains: q, mode: 'insensitive' } }
    ];
  }

  const orderBy =
    sort === 'price_asc' ? { price: 'asc' } : sort === 'price_desc' ? { price: 'desc' } : { createdAt: 'desc' };

  const properties = await prisma.property.findMany({
    where,
    orderBy
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

      <form method="get" action="/properties" className="flex flex-wrap gap-3 mb-6">
        {type && <input type="hidden" name="type" value={type} />}
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name, area or city"
          aria-label="Search properties"
          className="flex-1 min-w-[220px] border border-[var(--line)] bg-white px-4 py-2 text-sm focus-ring"
        />
        <select
          name="sort"
          defaultValue={sort || ''}
          aria-label="Sort by"
          className="border border-[var(--line)] bg-white px-3 py-2 text-sm focus-ring"
        >
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <button type="submit" className="btn-primary !py-2 !px-5 text-sm focus-ring">Search</button>
      </form>

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
          No properties match your search yet.
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
