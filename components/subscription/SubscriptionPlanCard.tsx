'use client';

import { SubscriptionPlan } from '@/types/subscription';
import { cn } from '@/lib/utils';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
}

export function SubscriptionPlanCard({ plan, isCurrentPlan }: SubscriptionPlanCardProps) {
  const { name, description, price, interval, features, isPopular } = plan;
  
  // Format price display
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price / 100);
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md p-6 border",
      isCurrentPlan ? "border-blue-500" : "border-gray-200",
      isPopular ? "ring-2 ring-blue-500" : ""
    )}>
      {isPopular && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 absolute -top-2 right-4">
          Popular
        </span>
      )}
      
      {isCurrentPlan && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-4">
          Current Plan
        </span>
      )}
      
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="mb-4">
        <span className="text-3xl font-bold">{formattedPrice}</span>
        {interval === 'monthly' ? (
          <span className="text-gray-500">/month</span>
        ) : (
          <span className="text-gray-500">/year</span>
        )}
      </div>
      
      <ul className="mb-6 space-y-2">
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{features.maxProjects} projects</span>
        </li>
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{features.maxCollaborators} {features.maxCollaborators === 1 ? 'collaborator' : 'collaborators'}</span>
        </li>
        <li className="flex items-start">
          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{features.maxStorage}GB storage</span>
        </li>
        {features.apiAccess && (
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>API access</span>
          </li>
        )}
      </ul>
      
      <button
        disabled={isCurrentPlan || !plan.isAvailable}
        className={cn(
          "w-full px-4 py-2 rounded-md text-sm font-medium",
          isCurrentPlan 
            ? "bg-gray-100 text-gray-800 cursor-not-allowed" 
            : plan.isAvailable 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-gray-100 text-gray-500 cursor-not-allowed"
        )}
      >
        {isCurrentPlan ? 'Current Plan' : plan.isAvailable ? 'Select Plan' : 'Coming Soon'}
      </button>
    </div>
  );
} 