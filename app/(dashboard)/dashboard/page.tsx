'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState({
    tier: 'free',
    status: 'active'
  });
  
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    // Fetch user data
    async function loadUserData() {
      try {
        setIsLoading(true);
        
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error('Authentication error: ' + sessionError.message);
        }
        
        if (!session || !session.user) {
          router.push('/auth/login');
          return;
        }
        
        setUser(session.user);
        
        // We'll just use the default subscription values defined in state
        // In a real app, you would fetch this from your database
        
      } catch (err: any) {
        console.error('Error loading user data:', err);
        setError(err.message || 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [router, supabase]);
  
  // Safe rendering function for user properties
  const safeRender = (value: any, fallback: string = 'Not available') => {
    return value || fallback;
  };
  
  // Safe date formatting with fallback
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Safe string capitalization
  const capitalize = (str: string) => {
    if (typeof str !== 'string' || !str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading your dashboard...</h1>
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }
  
  // Error state
  if (error) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-red-700">There was a problem loading your dashboard</p>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Login
          </Link>
        </div>
      </main>
    );
  }
  
  // Main dashboard (only shown when user data is available)
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Here's everything you need to manage your account
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Subscription Overview Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Subscription Overview</h2>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {capitalize(subscription.tier)} Plan
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Your subscription is <span className="font-medium">{safeRender(subscription.status)}</span>
            </p>
            <div className="mt-6">
              <Link 
                href="/subscription" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Subscription
              </Link>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {safeRender(user.email)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">User ID:</span> {user.id ? `${user.id.substring(0, 8)}...` : 'Unknown'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Last Sign In:</span> {formatDate(user.last_sign_in_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Features Section - Shows based on subscription tier */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">Projects</h3>
              <p className="text-gray-600">Create up to 3 projects</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">Storage</h3>
              <p className="text-gray-600">5GB of storage</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">Personal Use</h3>
              <p className="text-gray-600">Single user account</p>
            </div>
          </div>
        </section>

        {/* Upgrade CTA - Only show for free tier */}
        {subscription.tier === 'free' && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Ready to upgrade?</h2>
                <p>
                  More features coming soon! You'll be the first to know when premium plans are available.
                </p>
              </div>
              <div className="flex-shrink-0">
                {/* Disabled button - will be enabled when premium plans are available */}
                <button
                  disabled
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 opacity-70 cursor-not-allowed"
                >
                  Premium Plans Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 