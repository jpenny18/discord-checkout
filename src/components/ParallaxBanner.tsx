'use client';

import { useParallax } from 'react-scroll-parallax';

export default function ParallaxBanner() {
  const { ref } = useParallax<HTMLDivElement>({ speed: -10 });

  return (
    <div ref={ref} className="absolute inset-0 z-0">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      
      {/* Animated pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(234, 179, 8, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(234, 179, 8, 0.15) 2%, transparent 0%)`,
          backgroundSize: '100px 100px',
        }} />
      </div>
    </div>
  );
} 