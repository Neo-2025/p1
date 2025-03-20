'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // CURRENT: Single user login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    setError(null);
    setDebugInfo(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      console.log(`Attempting login with email: ${email}`);
      setDebugInfo(`Attempting login with: ${email}`);

      // Simple validation for single user
      if (email !== 'bracketmaster@proton.me') {
        console.warn('Email validation failed - not our test user');
        setError('Invalid credentials');
        setDebugInfo(`Email validation failed - expected bracketmaster@proton.me`);
        setLoading(false);
        return;
      }

      // Log before Supabase call
      console.log('Calling Supabase auth.signInWithPassword...');
      setDebugInfo('Calling Supabase authentication...');
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Log after Supabase call
      console.log('Supabase auth call completed');
      
      if (signInError) {
        console.error('Supabase error:', signInError);
        setDebugInfo(`Supabase error: ${signInError.message}`);
        throw signInError;
      }

      console.log('Login successful, session:', data.session ? 'exists' : 'missing');
      setDebugInfo('Login successful, redirecting...');

      // Successful login
      router.refresh();
      console.log('Router refreshed, redirecting to dashboard');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Invalid credentials');
      setDebugInfo(`Error: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded">
          {error}
        </div>
      )}
      
      {/* Debug info - only in development */}
      {debugInfo && (
        <div className="bg-blue-50 text-blue-500 p-3 rounded text-xs">
          <p className="font-bold">Debug Info:</p>
          <p>{debugInfo}</p>
        </div>
      )}
      
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            defaultValue="bracketmaster@proton.me"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            defaultValue="Episode1!"  // Pre-filled for debugging only
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => console.log('Login button clicked')}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      {/* Help text - only in development */}
      <div className="text-xs text-gray-500 mt-4">
        <p><strong>Email:</strong> bracketmaster@proton.me</p>
        <p><strong>Password:</strong> Episode1!</p>
      </div>
    </form>
  );
} 