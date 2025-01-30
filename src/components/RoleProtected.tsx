'use client';

import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole, hasRequiredRole, getUpgradeMessage, formatRoleName } from '@/utils/roleUtils';
import Link from 'next/link';

interface RoleProtectedProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
}

export default function RoleProtected({
  children,
  requiredRole,
  redirectTo = '/dashboard/training/overview'
}: RoleProtectedProps) {
  const { role } = useRole();
  const router = useRouter();
  const hasAccess = hasRequiredRole(role as UserRole, requiredRole);

  useEffect(() => {
    if (!hasAccess) {
      router.push(redirectTo);
    }
  }, [hasAccess, redirectTo, router]);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-[#111111] rounded-lg p-8 max-w-md w-full space-y-4">
          <div className="w-16 h-16 mx-auto mb-6 text-[#ffc62d]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-gray-400 mb-6">
            {getUpgradeMessage(role as UserRole, requiredRole)}
          </p>
          <Link
            href="/dashboard/challenge"
            className="inline-block px-6 py-3 bg-[#ffc62d] text-black rounded-lg font-medium hover:bg-[#e6b229] transition-colors"
          >
            Upgrade to {formatRoleName(requiredRole)}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 