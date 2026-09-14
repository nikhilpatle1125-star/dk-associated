import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export default function Navbar({ settings }) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur sticky top-0 z-30">
      <div className="container-page flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 focus-ring">
          {settings?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={settings.companyName} className="h-10 w-auto object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--forest)] text-white font-display text-lg">
              {(settings?.companyName || 'DK').slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="font-display text-xl text-[var(--forest)]">
            {settings?.companyName || 'DK Associated'}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[var(--forest)] focus-ring">
              {l.label}
            </Link>
          ))}
        </nav>
        {settings?.phone ? (
          <a href={`tel:${settings.phone}`} className="btn-outline hidden sm:inline-flex text-sm focus-ring">
            Call {settings.phone}
          </a>
        ) : (
          <Link href="/contact" className="btn-outline hidden sm:inline-flex text-sm focus-ring">
            Enquire
          </Link>
        )}
      </div>
      <nav className="md:hidden flex items-center justify-around border-t border-[var(--line)] text-xs font-medium py-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="focus-ring px-2 py-1">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
