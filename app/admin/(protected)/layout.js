import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import AdminSidebar from '../../../components/AdminSidebar';

export default async function ProtectedAdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div className="flex flex-col md:flex-row min-h-[70vh]">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10 bg-[var(--paper)]">{children}</div>
    </div>
  );
}
