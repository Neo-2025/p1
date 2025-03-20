import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getServerSubscriptionService, getAvailablePlans } from '@/lib/subscription';
import Link from 'next/link';
import { SubscriptionPlanCard } from '@/components/subscription/SubscriptionPlanCard';
import { SubscriptionFeatureTable } from '@/components/subscription/SubscriptionFeatureTable';

export const metadata = {
  title: 'Subscription Management - SmartScale SaaS',
  description: 'Manage your SmartScale SaaS subscription'
};

export default async function SubscriptionPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null; // This should be handled by middleware, but just in case
  }

  // Get user's subscription information
  const subscriptionService = getServerSubscriptionService();
  const subscription = await subscriptionService.getUserSubscription(user.id);
  
  // If user doesn't have a subscription yet, create a free one
  const userSubscription = subscription || await subscriptionService.createFreeSubscription(user.id);
  
  // Get available plans
  const availablePlans = getAvailablePlans();
  
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            <Link 
              href="/dashboard" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Back to Dashboard
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            Manage your subscription plan and billing details
          </p>
        </header>

        {/* Current Plan Summary */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-12">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mb-4">
                {userSubscription.tier.charAt(0).toUpperCase() + userSubscription.tier.slice(1)} Plan
              </span>
              <p className="text-gray-600 mb-2">
                Status: <span className="font-medium">{userSubscription.status}</span>
              </p>
              <p className="text-gray-600">
                Renews: {userSubscription.tier === 'free' 
                  ? 'Never expires' 
                  : new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              {userSubscription.tier !== 'free' && (
                <button
                  className="mr-4 text-red-600 hover:text-red-800 font-medium"
                >
                  Cancel Subscription
                </button>
              )}
              
              <button
                disabled={availablePlans.length <= 1}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Plan
              </button>
            </div>
          </div>
        </section>

        {/* Available Plans */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          
          {availablePlans.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map(plan => (
                <SubscriptionPlanCard 
                  key={plan.id}
                  plan={plan}
                  isCurrentPlan={plan.tier === userSubscription.tier}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Plans Coming Soon</h3>
              <p className="text-gray-600">
                We're currently working on additional subscription tiers with more features.
                Stay tuned for updates!
              </p>
            </div>
          )}
        </section>

        {/* Feature Comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
          <SubscriptionFeatureTable currentTier={userSubscription.tier} />
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">When will premium plans be available?</h3>
              <p className="text-gray-600">
                We're working hard to bring premium plans to our platform. 
                Sign up for our newsletter to be the first to know when they launch.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">What happens if I need more resources?</h3>
              <p className="text-gray-600">
                The free plan should be sufficient for personal use. When premium plans 
                become available, you'll be able to upgrade to access more resources.
              </p>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I pay annually?</h3>
              <p className="text-gray-600">
                Yes, annual plans will be available at a discount when premium 
                subscriptions launch.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 