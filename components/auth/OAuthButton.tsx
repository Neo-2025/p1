'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface OAuthButtonProps {
  provider: 'github';
  className?: string;
}

export default function OAuthButton({ provider, className = '' }: OAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      
      // Get the base URL - prioritize VERCEL_URL for production or deployed previews
      const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : '');
      
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('OAuth sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      className={`flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading ? (
        'Connecting to GitHub...'
      ) : (
        <>
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Sign in with GitHub
        </>
      )}
    </button>
  );
} 