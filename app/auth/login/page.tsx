import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - SmartScale SaaS',
  description: 'Login to access your dashboard'
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  
  // Get any error from the URL (e.g., from magic link callback)
  const errorMessage = searchParams?.error ? decodeURIComponent(searchParams.error as string) : null;
  
  // If user is already logged in, redirect to dashboard
  if (data?.session) {
    redirect('/dashboard');
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
        </div>
        <LoginForm initialError={errorMessage} />
      </div>
    </div>
  );
}