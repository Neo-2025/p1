import DashboardNav from '@/components/dashboard/DashboardNav';

export const metadata = {
  title: 'Dashboard - SmartScale SaaS',
  description: 'Access your SmartScale dashboard and manage your account'
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We'll let the client components handle auth to avoid server-side errors
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav />
      
      <div className="flex-1 flex flex-col">
        {/* FUTURE: Wrap with permission/role guards
        <RoleGuard allowedRoles={['admin', 'user']}>
          <PermissionGuard requiredPermissions={['read', 'write']}>
        */}
          
        {children}

        {/* FUTURE: Close permission/role guards
          </PermissionGuard>
        </RoleGuard>
        */}
      </div>

      <footer className="bg-white mt-auto py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} SmartScale. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 