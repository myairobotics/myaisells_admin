'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(pathname);
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startProgress = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWidth(10);
    setVisible(true);
    intervalRef.current = setInterval(() => {
      setWidth(prev => {
        if (prev >= 85) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 85;
        }
        const increment = (85 - prev) * 0.08;
        return prev + Math.max(increment, 0.5);
      });
    }, 80);
  };

  const completeProgress = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWidth(100);
    completeTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      hideTimeoutRef.current = setTimeout(() => setWidth(0), 300);
    }, 250);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor || !anchor.href) return;
      if (anchor.target === '_blank' || anchor.rel?.includes('external')) return;

      let href: URL;
      try {
        href = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (href.origin !== window.location.origin) return;
      if (href.pathname === window.location.pathname && href.search === window.location.search) return;

      startProgress();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      completeProgress();
    }

    return () => {
      if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[99999] h-[2px] transition-all ease-out"
      style={{
        width: `${width}%`,
        opacity: visible ? 1 : 0,
        transitionDuration: visible ? '200ms' : '400ms',
        background: 'linear-gradient(90deg, #2563eb, #3b82f6, #6366f1)',
        boxShadow: '0 0 8px 1px rgba(59,130,246,0.6)',
      }}
    />
  );
}
