'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cn } from '@/lib/utils';

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          router.push('/auth/login');
          return;
        }
        
        if (!session) {
          router.push('/auth/login');
          return;
        }
        
        setUserEmail(session.user?.email || null);
      } catch (err) {
        console.error('Failed to check auth status:', err);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [router, supabase]);
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Subscription', href: '/subscription' },
    { name: 'Settings', href: '/settings', disabled: true },
    { name: 'Support', href: '/support', disabled: true },
  ];
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  if (isLoading) {
    return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-blue-600 font-bold text-xl">SmartScale</span>
              </div>
              <div className="hidden md:block">
                <div className="animate-pulse ml-10 h-4 w-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-blue-600 font-bold text-xl">SmartScale</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.disabled ? '#' : item.href}
                    className={cn(
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'px-3 py-2 rounded-md text-sm font-medium',
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    aria-disabled={item.disabled}
                    onClick={(e) => {
                      if (item.disabled) e.preventDefault();
                    }}
                  >
                    {item.name}
                    {item.disabled && ' (Coming Soon)'}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {userEmail && (
                <span className="text-sm text-gray-600 mr-4">{userEmail}</span>
              )}
              <button
                onClick={handleSignOut}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'block px-3 py-2 rounded-md text-base font-medium',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                aria-disabled={item.disabled}
                onClick={(e) => {
                  if (item.disabled) e.preventDefault();
                }}
              >
                {item.name}
                {item.disabled && ' (Coming Soon)'}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 