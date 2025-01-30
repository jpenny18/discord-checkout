'use client';

import TrainingNav from '@/components/TrainingNav';

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-2rem)]">
      <TrainingNav />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 