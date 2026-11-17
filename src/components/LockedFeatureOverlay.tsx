'use client';

import { useId } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';

interface LockedFeatureOverlayProps {
  align?: 'center' | 'start';
}

export default function LockedFeatureOverlay({ align = 'center' }: LockedFeatureOverlayProps) {
  const titleId = useId();
  const messageId = useId();

  return (
    <div
      className={`absolute inset-0 z-[80] flex flex-col items-center bg-black/50 px-4 text-center backdrop-blur-md ${
        align === 'center' ? 'justify-center' : ''
      }`}
      role="dialog"
      aria-modal={align === 'start' ? true : undefined}
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <div
        className={`my-8 flex w-full max-w-sm flex-col items-center rounded-xl border p-6 md:p-8 ${
          align === 'start' ? 'sticky top-24' : ''
        }`}
        style={{
          backgroundColor: 'color-mix(in oklab, var(--color-white) 6%, transparent)',
          borderColor: 'color-mix(in oklab, var(--color-white) 12%, transparent)',
        }}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
          <LockClosedIcon className="h-8 w-8 text-[#ffc62d]" aria-hidden="true" />
        </div>
        <h2 id={titleId} className="mb-2 text-xl font-bold text-white md:text-2xl">
          Currently Locked
        </h2>
        <p id={messageId} className="text-gray-300">
          Will come back soon
        </p>
      </div>
    </div>
  );
}
