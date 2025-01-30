'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { RoleProvider } from '@/contexts/RoleContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RoleProvider>
        {children}
      </RoleProvider>
    </AuthProvider>
  );
} 