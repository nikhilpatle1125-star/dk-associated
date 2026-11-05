import { prisma } from '../../../../lib/prisma';
import DeleteEnquiryButton from '../../../../components/DeleteEnquiryButton';

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1 className="font-display text-3xl text-[var(--forest)] mb-1">Enquiries</h1>
      <p className="text-[var(--ink)]/60 mb-8">{messages.length} message{messages.length === 1 ? '' : 's'} from the contact form.</p>

      {messages.length === 0 ? (
        <div className="bg-white border border-dashed border-[var(--line)] p-12 text-center text-[var(--ink)]/60">No enquiries yet.</div>
      ) : (
        <ul className="bg-white border border-[var(--line)] divide-y divide-[var(--line)]">
          {messages.map((m) => (
            <li key={m.id} className="p-5 text-sm">
              <div className="flex justify-between gap-4 flex-wrap">
                <span className="font-medium">{m.name}</span>
                <span className="text-[var(--ink)]/50">{new Date(m.createdAt).toLocaleString('en-IN')}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[var(--ink)]/70">
                <a href={`tel:${m.phone}`} className="hover:underline focus-ring">{m.phone}</a>
                {m.email && <a href={`mailto:${m.email}`} className="hover:underline focus-ring">{m.email}</a>}
              </div>
              <p className="mt-2 text-[var(--ink)]/85 whitespace-pre-line">{m.message}</p>
              {m.propertyId && <p className="mt-1 text-xs text-[var(--clay)]">About: {m.propertyId}</p>}
              <div className="mt-3"><DeleteEnquiryButton id={m.id} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
