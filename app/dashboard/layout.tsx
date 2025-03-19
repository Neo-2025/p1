import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// FUTURE: Import role-based components
// import { RoleGuard } from '@/components/auth/RoleGuard';
// import { PermissionGuard } from '@/components/auth/PermissionGuard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  // CURRENT: Simple session check for single user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // FUTURE AUTH EXPANSIONS:
  /*
  1. Role Verification
  if (session?.user?.user_metadata?.role !== 'admin') {
    redirect('/unauthorized');
  }

  2. Organization Check
  const { data: org } = await supabase
    .from('organizations')
    .select()
    .match({ id: session.user.user_metadata.org_id });

  3. Subscription Status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select()
    .match({ user_id: session.user.id })
    .single();

  4. Permission Matrix
  const userPermissions = session?.user?.app_metadata?.permissions || [];
  
  5. Multi-Factor Check
  const mfaVerified = session?.user?.app_metadata?.mfa_verified;

  6. Session Refresh Logic
  if (sessionNeedsRefresh(session)) {
    await supabase.auth.refreshSession();
  }
  */

  return (
    <div className="min-h-screen bg-gray-50">
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
  );
} 