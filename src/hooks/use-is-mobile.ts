'use client';

import { useSyncExternalStore } from 'react';

export function useIsMobile(breakpoint = 768) {
  const subscribe = (onChange: () => void) => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  };
  const getSnapshot = () => window.innerWidth < breakpoint;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
