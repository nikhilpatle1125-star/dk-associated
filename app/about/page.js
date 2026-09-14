import { prisma } from '../../lib/prisma';

export const metadata = { title: 'About' };
export const revalidate = 0;

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null);

  return (
    <div className="container-page py-16 md:py-24 max-w-3xl">
      <h1 className="font-display text-4xl text-[var(--forest)] mb-6">About {settings?.companyName || 'us'}</h1>
      <p className="text-[var(--ink)]/85 leading-relaxed whitespace-pre-line text-lg">
        {settings?.aboutText || 'Add a company description from the admin dashboard so this page reflects your business.'}
      </p>

      <div className="mt-12 border-t border-[var(--line)] pt-8 grid sm:grid-cols-2 gap-6 text-sm">
        {settings?.address && (
          <div>
            <div className="text-[var(--ink)]/60 mb-1">Office</div>
            <div className="font-medium">{settings.address}</div>
          </div>
        )}
        {settings?.phone && (
          <div>
            <div className="text-[var(--ink)]/60 mb-1">Phone</div>
            <a href={`tel:${settings.phone}`} className="font-medium hover:underline focus-ring">{settings.phone}</a>
          </div>
        )}
        {settings?.email && (
          <div>
            <div className="text-[var(--ink)]/60 mb-1">Email</div>
            <a href={`mailto:${settings.email}`} className="font-medium hover:underline focus-ring">{settings.email}</a>
          </div>
        )}
      </div>
    </div>
  );
}
