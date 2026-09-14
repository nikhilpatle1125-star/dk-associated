import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import SettingsForm from '../../../../components/SettingsForm';
import AdminProfileForm from '../../../../components/AdminProfileForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const [settings, session] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    getServerSession(authOptions)
  ]);

  const admin = session ? await prisma.admin.findUnique({ where: { id: session.user.id } }) : null;

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="font-display text-3xl text-[var(--forest)] mb-8">Site settings</h1>
        <SettingsForm initial={settings || {}} />
      </div>
      <div>
        <AdminProfileForm initialEmail={admin?.email || ''} />
      </div>
    </div>
  );
}
