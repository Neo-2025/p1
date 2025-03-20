'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import OAuthButton from './OAuthButton';

interface LoginFormProps {
  initialError?: string | null;
}

export default function LoginForm({ initialError }: LoginFormProps) {
  const [error, setError] = useState<string | null>(initialError || null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<'password' | 'magic'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailAuth, setShowEmailAuth] = useState(false);
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
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const submittedEmail = email.trim();

      if (loginMode === 'password') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: submittedEmail,
          password: password,
        });
        
        if (signInError) {
          throw signInError;
        }

        router.refresh();
        router.push('/dashboard');
      } else {
        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email: submittedEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (magicLinkError) {
          throw magicLinkError;
        }
        
        setSuccessMessage('Magic link sent! Check your email to complete login.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Invalid credentials');
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

  // Toggle showing email authentication
  const toggleEmailAuth = () => {
    setShowEmailAuth(!showEmailAuth);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="space-y-8">
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

      {/* GitHub OAuth - Primary Authentication */}
      <div className="py-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Sign in with GitHub</h3>
          <p className="text-sm text-gray-500 mt-1">Recommended for SS4 team members</p>
        </div>
        <OAuthButton provider="github" />
      </div>

      {!showEmailAuth ? (
        <div className="text-center">
          <button
            type="button"
            onClick={toggleEmailAuth}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Or sign in with email
          </button>
        </div>
      ) : (
        <>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Email Authentication</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
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
                  name="password"
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
          </form>
        </>
      )}
    </div>
  );
} 