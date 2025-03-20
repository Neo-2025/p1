import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getServerSubscriptionService } from '@/lib/subscription';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard - SmartScale SaaS',
  description: 'Your SmartScale dashboard'
};

export default async function DashboardPage() {
  // Try-catch block for the entire component to catch any errors
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data, error } = await supabase.auth.getUser();
    
    // Handle authentication errors
    if (error) {
      console.error('Authentication error:', error);
      redirect('/auth/login');
    }
    
    // Handle missing user or empty data
    if (!data?.user) {
      console.error('User not found or not authenticated');
      redirect('/auth/login');
    }
    
    const user = data.user;
    
    // Get user's subscription information with proper error handling
    let userSubscription = {
      tier: 'free',
      status: 'active'
    };
    
    try {
      const subscriptionService = getServerSubscriptionService();
      const subscription = await subscriptionService.getUserSubscription(user.id);
      
      // If user doesn't have a subscription yet, create a free one
      if (subscription) {
        userSubscription = subscription;
      } else {
        userSubscription = await subscriptionService.createFreeSubscription(user.id);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // We'll continue with the default subscription defined above
    }
    
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
                  {capitalize(userSubscription.tier)} Plan
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Your subscription is <span className="font-medium">{safeRender(userSubscription.status)}</span>
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
          {userSubscription.tier === 'free' && (
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
  } catch (error) {
    // Global error handler for the component
    console.error('Dashboard rendering error:', error);
    
    // Return simplified error UI instead of crashing
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to your Dashboard</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Free Plan</h2>
            <p className="text-gray-600 mb-4">You're currently on the free plan with access to basic features.</p>
            
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Session
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
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
        </div>
      </main>
    );
  }
} 