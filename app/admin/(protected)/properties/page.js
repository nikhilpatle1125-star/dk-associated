import Link from 'next/link';
import { prisma } from '../../../../lib/prisma';
import { formatPrice } from '../../../../lib/utils';
import DeletePropertyButton from '../../../../components/DeletePropertyButton';

export const revalidate = 0;

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-[var(--forest)]">Properties</h1>
          <p className="text-[var(--ink)]/60 mt-1">{properties.length} listed</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary focus-ring">Add a property</Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white border border-dashed border-[var(--line)] p-12 text-center text-[var(--ink)]/60">
          No properties yet. Add your first one.
        </div>
      ) : (
        <div className="bg-white border border-[var(--line)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--line)] text-[var(--ink)]/60">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {properties.map((p) => (
                <tr key={p.id}>
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4">{p.type === 'PLOT' ? 'Plot' : 'Flat'}</td>
                  <td className="p-4">{p.priceLabel || formatPrice(p.price)}</td>
                  <td className="p-4">{p.status.replace('_', ' ')}</td>
                  <td className="p-4">{p.featured ? 'Yes' : '—'}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <Link href={`/admin/properties/${p.id}`} className="text-sm text-[var(--forest)] hover:underline focus-ring mr-4">
                      Edit
                    </Link>
                    <DeletePropertyButton id={p.id} title={p.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
