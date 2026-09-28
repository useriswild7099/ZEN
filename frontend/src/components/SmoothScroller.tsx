'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollerProps {
  children: React.ReactNode;
}

export function SmoothScroller({ children }: SmoothScrollerProps) {
  // We use the recommended configuration for a premium, buttery smooth feel.
  // smoothTouch: false is critical - native mobile scrolling is always better for UX.
  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      } as any}
    >
      {children as any}
    </ReactLenis>
  );
}
