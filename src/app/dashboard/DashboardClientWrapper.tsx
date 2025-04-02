'use client';

import { useEffect, useState } from 'react';

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

export default function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 