'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  TrophyIcon,
  SignalIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Signals', href: '/dashboard/signals', icon: SignalIcon },
  { name: 'Training', href: '/dashboard/training', icon: AcademicCapIcon },
  { name: 'Community', href: '/dashboard/community', icon: ChatBubbleLeftRightIcon },
  { name: 'Trading Tools', href: '/dashboard/trading-tools', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex-1 flex flex-col pl-6 pr-6">
      {/* Logo Header */}
      

      {/* New ACI Challenge Button */}
      <div className="py-6">
        <Link
          href="/dashboard/challenge"
          className="flex items-center justify-center gap-2 bg-[#ffc62d] text-black px-4 py-3 rounded-lg font-semibold hover:bg-[#e5b228] transition-colors shadow-[0_0_25px_rgba(255,198,45,0.25)] hover:shadow-[0_0_25px_rgba(255,198,45,0.4)]"
        >
          <TrophyIcon className="h-5 w-5" />
          New ACI Challenge
        </Link>
      </div>

      {/* Main Menu Text */}
      <div className="py-3">
        <h2 className="text-sm font-medium text-gray-400">Main menu</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#111111] text-[#ffc62d] shadow-[0_0_20px_rgba(17,17,17,0.5)]'
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