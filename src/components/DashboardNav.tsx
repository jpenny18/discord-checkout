'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  TrophyIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Signals', href: '/dashboard/signals', icon: SignalIcon },
  { name: 'Training', href: '/dashboard/training', icon: AcademicCapIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex-1 flex flex-col">
      {/* New ACI Challenge Button */}
      <div className="px-4 py-4">
        <Link
          href="/dashboard/challenge"
          className="flex items-center justify-center gap-2 bg-[#ffc62d] text-black px-4 py-3 rounded-lg font-semibold hover:bg-[#e5b228] transition-colors"
        >
          <TrophyIcon className="h-5 w-5" />
          New ACI Challenge
        </Link>
      </div>

      {/* Main Menu Text */}
      <div className="px-4 py-2">
        <h2 className="text-sm font-medium text-gray-400">Main menu</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#111111] text-[#ffc62d]'
                      : 'text-gray-300 hover:bg-[#111111] hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive ? 'text-[#ffc62d]' : 'text-gray-400'
                    }`}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 