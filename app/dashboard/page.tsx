'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * StaticDashboard Component
 * 
 * NOTE: This is a temporary workaround implementation using client components to bypass 
 * server-side rendering errors. This approach will need further development to:
 * 1. Properly fetch and display user-specific data
 * 2. Implement proper authentication checks
 * 3. Reintegrate with server components when SSR issues are resolved
 * 4. Add dynamic functionality for user interactions
 * 
 * The current static implementation is functional but limited in features.
 * See SAAS_TEMPLATE_STATUS.md for more details on the implementation strategy.
 */
export default function StaticDashboard() {
  const router = useRouter();
  
  const handleSignOut = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple static header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-blue-600 font-bold text-xl">SmartScale</span>
            </div>
            <nav className="ml-10 flex space-x-4">
              <Link 
                href="/dashboard" 
                className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/subscription" 
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Subscription
              </Link>
            </nav>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Here's an overview of your account and subscription.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Subscription Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Your Subscription</h2>
                <div className="mt-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-blue-800">Free Plan</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    You're currently on the Free plan. Enjoy basic features to get you started.
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
                <p className="mt-3 text-sm text-gray-600">
                  User account information will be displayed here in future updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 