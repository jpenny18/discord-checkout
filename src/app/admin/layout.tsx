'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const adminNavigation = [
  { name: 'Overview', href: '/admin' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Signals', href: '/admin/signals' },
  { name: 'Content', href: '/admin/content' },
  { name: 'Analytics', href: '/admin/analytics' }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user && userProfile) {
      if (!userProfile.roles?.includes('admin')) {
        window.location.href = '/';
      }
      setLoading(false);
    }
  }, [user, userProfile]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#111111] border-r border-gray-800 transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0`}>
        <div className="flex h-16 items-center px-6">
          <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
        </div>
        <nav className="space-y-1 px-3">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-gray-800 p-4">
          <Link
            href="/dashboard"
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-50 flex h-16 w-16 items-center justify-center bg-[#111111] md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-[#ffc62d] focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-black">
        <div className="p-8 pt-20 md:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
} 