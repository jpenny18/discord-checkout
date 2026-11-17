'use client';

import TrainingNav from '@/components/TrainingNav';
import LockedFeatureOverlay from '@/components/LockedFeatureOverlay';

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-2rem)]">
      <div
        className="pointer-events-none flex min-h-[calc(100vh-2rem)] select-none"
        aria-hidden="true"
        ref={(node) => {
          if (node) node.inert = true;
        }}
      >
        <TrainingNav />
        <div className="flex-1">
          {children}
        </div>
      </div>
      <LockedFeatureOverlay align="start" />
    </div>
  );
}
 