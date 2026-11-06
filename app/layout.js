import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Providers from '../components/Providers';
import ScrollProgress from '../components/ScrollProgress';
import { prisma } from '../lib/prisma';

async function getSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const settings = await getSettings();
  const name = settings?.companyName || 'DK Associated';
  const tagline = settings?.tagline || 'Trusted plots & flats, built on transparency.';
  return {
    title: {
      default: `${name} — ${tagline}`,
      template: `%s | ${name}`
    },
    description: settings?.aboutText?.slice(0, 155) || tagline,
    icons: settings?.logoUrl ? [{ url: settings.logoUrl }] : undefined
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ScrollProgress />
        <Providers>
          <Navbar settings={settings} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer settings={settings} />
          <WhatsAppButton whatsapp={settings?.whatsapp} floating />
        </Providers>
      </body>
    </html>
  );
}
