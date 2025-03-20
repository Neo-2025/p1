'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StaticDashboard() {
  const router = useRouter();
  
  // Simple sign out function
  const handleSignOut = async () => {
    try {
      // We'll just redirect to login page for now
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
                  <Link
                    href="/subscription"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Manage Subscription
                  </Link>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
                <dl className="mt-3 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">user@example.com</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">Individual</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                    <dd className="mt-1 text-sm text-gray-900">January 2023</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Available Features</h2>
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-md font-medium text-gray-900">Projects</h3>
                  <p className="mt-1 text-sm text-gray-600">Create up to 3 projects with the Free plan.</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-md font-medium text-gray-900">Storage</h3>
                  <p className="mt-1 text-sm text-gray-600">5GB of storage included.</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-md font-medium text-gray-900">Support</h3>
                  <p className="mt-1 text-sm text-gray-600">Community support via documentation and forums.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-6 sm:p-6 sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Ready to upgrade?</h3>
                <p className="mt-2 text-sm text-indigo-100">
                  More features coming soon! You'll be the first to know when premium plans are available.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  disabled
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 opacity-70 cursor-not-allowed"
                >
                  Premium Plans Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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