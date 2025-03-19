'use client';

import { SubscriptionTier } from '@/types/subscription';
import { cn } from '@/lib/utils';

interface SubscriptionFeatureTableProps {
  currentTier: SubscriptionTier;
}

// Feature data for the comparison table
const features = [
  {
    name: 'Projects',
    free: '3 projects',
    basic: '10 projects',
    pro: '50 projects',
    enterprise: 'Unlimited projects'
  },
  {
    name: 'Collaborators',
    free: '1 collaborator',
    basic: '5 collaborators',
    pro: '20 collaborators',
    enterprise: '100+ collaborators'
  },
  {
    name: 'Storage',
    free: '5GB',
    basic: '20GB',
    pro: '100GB',
    enterprise: '500GB'
  },
  {
    name: 'Analytics',
    free: 'Basic',
    basic: 'Basic',
    pro: 'Advanced',
    enterprise: 'Advanced + Custom'
  },
  {
    name: 'Support',
    free: 'Community',
    basic: 'Email',
    pro: 'Priority',
    enterprise: 'Dedicated'
  },
  {
    name: 'Custom Domain',
    free: false,
    basic: false,
    pro: true,
    enterprise: true
  },
  {
    name: 'API Access',
    free: false,
    basic: true,
    pro: true,
    enterprise: true
  },
  {
    name: 'White Labeling',
    free: false,
    basic: false,
    pro: false,
    enterprise: true
  }
];

export function SubscriptionFeatureTable({ currentTier }: SubscriptionFeatureTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Feature
            </th>
            <th className={cn(
              "py-3 px-4 text-center text-xs font-medium uppercase tracking-wider border-b",
              currentTier === 'free' ? "bg-blue-50 text-blue-600" : "text-gray-500"
            )}>
              Free
            </th>
            <th className={cn(
              "py-3 px-4 text-center text-xs font-medium uppercase tracking-wider border-b",
              currentTier === 'basic' ? "bg-blue-50 text-blue-600" : "text-gray-500"
            )}>
              Basic
            </th>
            <th className={cn(
              "py-3 px-4 text-center text-xs font-medium uppercase tracking-wider border-b",
              currentTier === 'pro' ? "bg-blue-50 text-blue-600" : "text-gray-500"
            )}>
              Pro
            </th>
            <th className={cn(
              "py-3 px-4 text-center text-xs font-medium uppercase tracking-wider border-b",
              currentTier === 'enterprise' ? "bg-blue-50 text-blue-600" : "text-gray-500"
            )}>
              Enterprise
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                {feature.name}
              </td>
              <td className={cn(
                "py-3 px-4 text-center text-sm", 
                currentTier === 'free' ? "bg-blue-50" : ""
              )}>
                {typeof feature.free === 'boolean' ? (
                  feature.free ? (
                    <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                  ) : (
                    <XIcon className="mx-auto h-5 w-5 text-red-500" />
                  )
                ) : (
                  <span className="text-gray-600">{feature.free}</span>
                )}
              </td>
              <td className={cn(
                "py-3 px-4 text-center text-sm", 
                currentTier === 'basic' ? "bg-blue-50" : ""
              )}>
                {typeof feature.basic === 'boolean' ? (
                  feature.basic ? (
                    <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                  ) : (
                    <XIcon className="mx-auto h-5 w-5 text-red-500" />
                  )
                ) : (
                  <span className="text-gray-600">{feature.basic}</span>
                )}
              </td>
              <td className={cn(
                "py-3 px-4 text-center text-sm", 
                currentTier === 'pro' ? "bg-blue-50" : ""
              )}>
                {typeof feature.pro === 'boolean' ? (
                  feature.pro ? (
                    <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                  ) : (
                    <XIcon className="mx-auto h-5 w-5 text-red-500" />
                  )
                ) : (
                  <span className="text-gray-600">{feature.pro}</span>
                )}
              </td>
              <td className={cn(
                "py-3 px-4 text-center text-sm", 
                currentTier === 'enterprise' ? "bg-blue-50" : ""
              )}>
                {typeof feature.enterprise === 'boolean' ? (
                  feature.enterprise ? (
                    <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                  ) : (
                    <XIcon className="mx-auto h-5 w-5 text-red-500" />
                  )
                ) : (
                  <span className="text-gray-600">{feature.enterprise}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Check icon component
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

// X icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
} 