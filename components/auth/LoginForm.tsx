'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  initialError?: string | null;
}

export default function LoginForm({ initialError }: LoginFormProps) {
  const [error, setError] = useState<string | null>(initialError || null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<'password' | 'magic'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // Update error if initialError changes
  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    setError(null);
    setDebugInfo(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;

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

      if (loginMode === 'password') {
        const password = formData.get('password') as string;

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
      } else {
        // Magic link login
        console.log('Sending magic link to email:', email);
        setDebugInfo('Sending magic link...');
        
        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (magicLinkError) {
          console.error('Magic link error:', magicLinkError);
          setDebugInfo(`Magic link error: ${magicLinkError.message}`);
          throw magicLinkError;
        }
        
        console.log('Magic link sent successfully');
        setSuccessMessage('Magic link sent! Check your email to complete login.');
        setDebugInfo('Magic link sent successfully');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Invalid credentials');
      setDebugInfo(`Error: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between password and magic link login
  const toggleLoginMode = () => {
    setLoginMode(loginMode === 'password' ? 'magic' : 'password');
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded">
          {error}
        </div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-3 rounded">
          {successMessage}
        </div>
      )}
      
      {/* Debug info - only in development */}
      {debugInfo && (
        <div className="bg-blue-50 text-blue-500 p-3 rounded text-xs">
          <p className="font-bold">Debug Info:</p>
          <p>{debugInfo}</p>
        </div>
      )}
      
      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
      </div>
      
      {/* Password field - only shown in password mode */}
      {loginMode === 'password' && (
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => console.log('Login button clicked')}
      >
        {loading ? 'Processing...' : loginMode === 'password' ? 'Sign in' : 'Send Magic Link'}
      </button>
      
      {/* Login mode toggle */}
      <div className="text-center">
        <button
          type="button"
          className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none"
          onClick={toggleLoginMode}
        >
          {loginMode === 'password' 
            ? 'Use magic link instead' 
            : 'Use password instead'}
        </button>
      </div>

      {/* Help text - only in development */}
      <div className="text-xs text-gray-500 mt-4">
        <p><strong>Email:</strong> bracketmaster@proton.me</p>
        {loginMode === 'password' && <p><strong>Password:</strong> Episode1!</p>}
      </div>
    </form>
  );
} 