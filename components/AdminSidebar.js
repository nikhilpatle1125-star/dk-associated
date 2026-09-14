'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const items = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/properties', label: 'Properties' },
  { href: '/admin/settings', label: 'Site settings' }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-[var(--line)] bg-white">
      <div className="p-5 font-display text-lg text-[var(--forest)]">Admin panel</div>
      <nav className="flex md:flex-col overflow-x-auto md:overflow-visible">
        {items.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-5 py-3 text-sm whitespace-nowrap border-l-4 focus-ring ${
                active
                  ? 'border-[var(--forest)] bg-[var(--paper)] font-medium text-[var(--forest)]'
                  : 'border-transparent text-[var(--ink)]/70 hover:bg-[var(--paper)]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-5 mt-auto">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-[var(--ink)]/60 hover:text-[var(--forest)] underline underline-offset-4 focus-ring"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
