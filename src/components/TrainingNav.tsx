'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AcademicCapIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useRole } from '@/contexts/RoleContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type UserRole = 'ascendant_hero' | 'ascendant_challenger' | 'ascendant_trader' | 'default';

interface TrainingRoute {
  name: string;
  path: string;
  minRole?: UserRole;
  description?: string;
}

const trainingRoutes: TrainingRoute[] = [
  { 
    name: 'Overview', 
    path: '/dashboard/training/overview',
    description: 'Your learning journey starts here'
  },
  { 
    name: 'Beginners Course', 
    path: '/dashboard/training/beginners',
    minRole: 'ascendant_trader',
    description: 'Master the fundamentals of trading'
  },
  { 
    name: 'Intermediate Course', 
    path: '/dashboard/training/intermediate',
    minRole: 'ascendant_challenger',
    description: 'Advanced trading strategies'
  },
  { 
    name: 'Advanced Course', 
    path: '/dashboard/training/advanced',
    minRole: 'ascendant_hero',
    description: 'Expert-level trading mastery'
  }
];

const roleHierarchy: Record<UserRole, number> = {
  'ascendant_hero': 3,
  'ascendant_challenger': 2,
  'ascendant_trader': 1,
  'default': 0
};

export default function TrainingNav() {
  const pathname = usePathname();
  const { role } = useRole();
  const [clickedRoute, setClickedRoute] = useState<string | null>(null);

  // Reset clicked route when pathname changes
  useEffect(() => {
    setClickedRoute(null);
  }, [pathname]);

  const isRouteAccessible = (route: TrainingRoute) => {
    if (!route.minRole) return true;
    return roleHierarchy[role as UserRole] >= roleHierarchy[route.minRole];
  };

  return (
    <div className="relative min-w-[250px] pr-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center text-xl font-bold text-[#ffc62d] mb-8"
      >
        <AcademicCapIcon className="w-6 h-6 mr-2" />
        Training
      </motion.h2>
      
      {/* Vertical line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 'auto' }}
        transition={{ duration: 0.5 }}
        className="absolute left-2 top-16 bottom-4 w-0.5 bg-gray-800"
      />
      
      <nav className="space-y-6">
        {trainingRoutes.map((route, index) => {
          const isActive = pathname === route.path;
          const isAccessible = isRouteAccessible(route);
          
          return (
            <motion.div
              key={route.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={isAccessible ? route.path : '#'}
                className={`flex items-center group relative ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (isAccessible) {
                    setClickedRoute(route.path);
                  }
                }}
              >
                {/* Horizontal arrow line with animation */}
                <motion.div 
                  className="w-8 h-0.5 bg-gray-800 origin-left"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div 
                    className={`h-full ${isActive || isAccessible ? 'bg-[#ffc62d]' : 'bg-gray-800'}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                
                <div className={`flex items-center ml-4 ${
                  isActive ? 'text-[#ffc62d]' : 
                  isAccessible ? 'text-white group-hover:text-[#ffc62d] transition-colors' : 'text-gray-500'
                }`}>
                  {!isAccessible && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="mr-2"
                    >
                      <LockClosedIcon className="w-4 h-4 text-[#ffc62d]" />
                    </motion.div>
                  )}
                  <span>{route.name}</span>

                  {/* Loading Spinner */}
                  {clickedRoute === route.path && (
                    <div className="ml-3">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
                    </div>
                  )}
                </div>

                {/* Tooltip for locked courses */}
                {!isAccessible && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-gray-800 rounded text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Unlock with {route.minRole?.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
} 