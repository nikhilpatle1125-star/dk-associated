import { prisma } from '../../lib/prisma';
import ContactForm from '../../components/ContactForm';
import WhatsAppButton from '../../components/WhatsAppButton';

export const metadata = { title: 'Contact' };
export const revalidate = 0;

export default async function ContactPage({ searchParams }) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null);

  return (
    <div className="container-page py-16 md:py-24">
      <h1 className="font-display text-4xl text-[var(--forest)] mb-3">Contact us</h1>
      <p className="text-[var(--ink)]/70 mb-10 max-w-lg">
        Send a message, chat on WhatsApp, or call us directly — whichever is easiest for you.
      </p>

      <div className="grid lg:grid-cols-2 gap-10">
        <ContactForm prefillProperty={searchParams?.property} />

        <div className="space-y-6">
          <div className="border border-[var(--line)] p-6 bg-white">
            <h2 className="font-display text-xl text-[var(--forest)] mb-4">Reach us directly</h2>
            <ul className="space-y-3 text-sm">
              {settings?.phone && <li>Phone: <a href={`tel:${settings.phone}`} className="font-medium hover:underline focus-ring">{settings.phone}</a></li>}
              {settings?.email && <li>Email: <a href={`mailto:${settings.email}`} className="font-medium hover:underline focus-ring">{settings.email}</a></li>}
              {settings?.address && <li>Address: <span className="font-medium">{settings.address}</span></li>}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <WhatsAppButton whatsapp={settings?.whatsapp} />
              {settings?.mapLink && (
                <a href={settings.mapLink} target="_blank" rel="noopener noreferrer" className="btn-outline focus-ring">
                  Open in Maps
                </a>
              )}
            </div>
          </div>

          {settings?.mapLink && (
            <a
              href={settings.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-[var(--line)] bg-white p-6 hover:border-[var(--forest)] transition-colors focus-ring"
            >
              <div className="font-medium text-[var(--forest)]">Get directions</div>
              <div className="text-sm text-[var(--ink)]/60 mt-1">Opens the office location in Google Maps</div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
