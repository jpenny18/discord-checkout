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
    name: 'Training', 
    path: '/dashboard/training',
    description: 'Access all training courses'
  },
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
  const [isVisible, setIsVisible] = useState(false); // Start closed on mobile

  // Reset clicked route when pathname changes
  useEffect(() => {
    setClickedRoute(null);
  }, [pathname]);

  // Set initial visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsVisible(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isRouteAccessible = (route: TrainingRoute) => {
    if (!route.minRole) return true;
    return roleHierarchy[role as UserRole] >= roleHierarchy[route.minRole];
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-[120px] right-4 z-[60]">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-[#111111] p-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          aria-label="Toggle training menu"
        >
          <svg
            className="w-5 h-5 text-[#ffc62d]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isVisible 
                ? "M6 18L18 6M6 6l12 12" 
                : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isVisible && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[51]"
          onClick={() => setIsVisible(false)}
        />
      )}

      {/* Training Navigation */}
      <div 
        className={`
          min-w-[200px] pr-4
          lg:relative lg:translate-x-0 lg:h-auto lg:bg-transparent lg:opacity-100
          fixed top-0 left-0 h-full bg-black z-[52]
          transform transition-transform duration-300 ease-in-out
          ${isVisible ? 'translate-x-0' : '-translate-x-full'}
          overflow-y-auto overflow-x-hidden
          pt-32 lg:pt-0 px-6 lg:px-2
        `}
      >
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-lg font-bold text-[#ffc62d] mb-6"
        >
          <AcademicCapIcon className="w-5 h-5 mr-2" />
          Training
        </motion.h2>
        
        {/* Get Access Button */}
        <Link href="/dashboard/training" className="block mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-2 px-3 rounded-lg font-semibold text-xs hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg"
          >
            Get Access
          </motion.button>
        </Link>
        
        <nav className="space-y-4 relative">
          {trainingRoutes.map((route, index) => {
            const isActive = pathname === route.path;
            const isAccessible = isRouteAccessible(route);
            
            // Skip rendering the Training route in the nav items since we have the button
            if (route.path === '/dashboard/training') return null;
            
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
                      setIsVisible(false); // Close nav on mobile after clicking
                    }
                  }}
                >
                  {/* Horizontal arrow line with animation */}
                  <motion.div 
                    className="w-6 h-0.5 bg-gray-800 origin-left"
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
                  
                  <div className={`flex items-center ml-3 ${
                    isActive ? 'text-[#ffc62d]' : 
                    isAccessible ? 'text-white group-hover:text-[#ffc62d] transition-colors' : 'text-gray-500'
                  }`}>
                    {!isAccessible && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="mr-1.5"
                      >
                        <LockClosedIcon className="w-3.5 h-3.5 text-[#ffc62d]" />
                      </motion.div>
                    )}
                    <span className="text-sm">{route.name}</span>

                    {clickedRoute === route.path && (
                      <div className="ml-2">
                        <div className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
                      </div>
                    )}
                  </div>

                  {/* Tooltip - hidden on mobile */}
                  {!isAccessible && (
                    <div className="hidden lg:block absolute left-full ml-4 px-3 py-1 bg-gray-800 rounded text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
    </>
  );
} 