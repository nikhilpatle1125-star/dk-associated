import { whatsappLink } from '../lib/utils';

const icons = {
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M17.47 14.38c-.29-.15-1.71-.84-1.97-.94-.27-.1-.46-.15-.66.15-.2.29-.75.94-.92 1.13-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.58-.9-2.17-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3.01.15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.26-.2-.55-.34z" />
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.96 9.96 0 0 0 12.02 22C17.5 22 22 17.52 22 12S17.5 2 12.02 2zm0 18.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3 .79.8-2.93-.2-.3A8.09 8.09 0 1 1 20.1 12a8.1 8.1 0 0 1-8.08 8.1z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.8 15.1V8.9l5.4 3.1-5.4 3.1z" />
    </svg>
  )
};

export default function SocialButtons({ settings, className = '', variant = 'dark' }) {
  const style =
    variant === 'light'
      ? 'border border-[var(--forest)]/30 bg-white text-[var(--forest)] hover:bg-[var(--forest)] hover:text-white'
      : 'border border-white/40 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm';
  const buttons = [];
  if (settings?.whatsapp) {
    buttons.push({
      key: 'whatsapp',
      label: 'WhatsApp',
      href: whatsappLink(settings.whatsapp, 'Hello, I am interested in a property listed on your website.')
    });
  }
  if (settings?.instagramUrl) buttons.push({ key: 'instagram', label: 'Instagram', href: settings.instagramUrl });
  if (settings?.youtubeUrl) buttons.push({ key: 'youtube', label: 'YouTube', href: settings.youtubeUrl });

  if (buttons.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {buttons.map((b) => (
        <a
          key={b.key}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-sm transition-colors focus-ring ${style}`}
        >
          {icons[b.key]}
          {b.label}
        </a>
      ))}
    </div>
  );
}
