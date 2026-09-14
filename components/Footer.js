import Link from 'next/link';

export default function Footer({ settings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--forest)] text-white mt-24">
      <div className="container-page py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl">{settings?.companyName || 'DK Associated'}</div>
          <p className="mt-3 text-sm text-white/75 max-w-xs">
            {settings?.tagline || 'Trusted plots & flats, built on transparency.'}
          </p>
        </div>
        <div className="text-sm space-y-2 text-white/85">
          <div className="font-medium text-white mb-2">Contact</div>
          {settings?.address && <div>{settings.address}</div>}
          {settings?.phone && <div><a href={`tel:${settings.phone}`} className="hover:underline focus-ring">{settings.phone}</a></div>}
          {settings?.email && <div><a href={`mailto:${settings.email}`} className="hover:underline focus-ring">{settings.email}</a></div>}
          {settings?.mapLink && (
            <div><a href={settings.mapLink} target="_blank" rel="noopener noreferrer" className="hover:underline focus-ring">View on map</a></div>
          )}
        </div>
        <div className="text-sm space-y-2 text-white/85">
          <div className="font-medium text-white mb-2">Explore</div>
          <div><Link href="/properties" className="hover:underline focus-ring">All properties</Link></div>
          <div><Link href="/about" className="hover:underline focus-ring">About us</Link></div>
          <div><Link href="/contact" className="hover:underline focus-ring">Get in touch</Link></div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/60">
        © {year} {settings?.companyName || 'DK Associated'}. All rights reserved.
      </div>
    </footer>
  );
}
