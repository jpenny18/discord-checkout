'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserRole } from '@/utils/roleUtils';

interface RoleContextType {
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  hasAccess: (requiredRole: UserRole) => boolean;
  canAccessCourse: (courseLevel: 'beginner' | 'intermediate' | 'advanced') => boolean;
  canAccessSignals: boolean;
  setTestRole?: (role: UserRole) => void; // Only available in development
  setRole: (role: UserRole | null) => void;
}

const roleHierarchy: Record<UserRole, number> = {
  'ascendant_hero': 3,
  'ascendant_challenger': 2,
  'ascendant_trader': 1,
  'default': 0
};

const ADMIN_EMAILS = ['joshpenny6@gmail.com'];

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role as UserRole || 'default');
          // Set admin status based on email
          setIsAdmin(ADMIN_EMAILS.includes(user.email || ''));
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasAccess = (requiredRole: UserRole) => {
    return role ? roleHierarchy[role] >= roleHierarchy[requiredRole] : false;
  };

  const canAccessCourse = (courseLevel: 'beginner' | 'intermediate' | 'advanced') => {
    switch (courseLevel) {
      case 'beginner':
        return true; // Everyone can access beginner courses (but only half for default users)
      case 'intermediate':
        return hasAccess('ascendant_challenger');
      case 'advanced':
        return hasAccess('ascendant_hero');
      default:
        return false;
    }
  };

  const canAccessSignals = hasAccess('ascendant_trader');

  // Development testing feature
  const contextValue: RoleContextType = {
    role,
    isAdmin,
    isLoading,
    hasAccess,
    canAccessCourse,
    canAccessSignals,
    setRole,
    ...(process.env.NODE_ENV === 'development' && {
      setTestRole: (newRole: UserRole) => setRole(newRole)
    })
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {process.env.NODE_ENV === 'development' && !isAdmin && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/90 p-4 rounded-lg border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Testing Role:</div>
          <select
            value={role || ''}
            onChange={(e) => setRole(e.target.value as UserRole | null)}
            className="w-full rounded-lg bg-[#111111] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]"
          >
            <option value="default">Free</option>
            <option value="ascendant_trader">Ascendant Trader</option>
            <option value="ascendant_challenger">Ascendant Challenger</option>
            <option value="ascendant_hero">Ascendant Hero</option>
          </select>
        </div>
      )}
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
} 