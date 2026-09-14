import Link from 'next/link';
import { prisma } from '../../../lib/prisma';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [total, available, sold, messages] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'AVAILABLE' } }),
    prisma.property.count({ where: { status: 'SOLD' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  const stats = [
    { label: 'Total properties', value: total },
    { label: 'Available', value: available },
    { label: 'Sold', value: sold }
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--forest)] mb-1">Dashboard</h1>
      <p className="text-[var(--ink)]/60 mb-8">A quick look at your listings and enquiries.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[var(--line)] p-5">
            <div className="text-3xl font-display text-[var(--forest)]">{s.value}</div>
            <div className="text-sm text-[var(--ink)]/60 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-10">
        <Link href="/admin/properties/new" className="btn-primary focus-ring">Add a property</Link>
        <Link href="/admin/settings" className="btn-outline focus-ring">Edit site settings</Link>
      </div>

      <div className="bg-white border border-[var(--line)]">
        <div className="px-5 py-4 border-b border-[var(--line)] font-medium">Recent enquiries</div>
        {messages.length === 0 ? (
          <p className="p-5 text-sm text-[var(--ink)]/60">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {messages.map((m) => (
              <li key={m.id} className="p-5 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-[var(--ink)]/50">{new Date(m.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[var(--ink)]/70">{m.phone}{m.email ? ` · ${m.email}` : ''}</div>
                <p className="mt-1 text-[var(--ink)]/85">{m.message}</p>
                {m.propertyId && <p className="mt-1 text-xs text-[var(--clay)]">Re: {m.propertyId}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
