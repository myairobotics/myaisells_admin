'use client';

import type { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabProps {
  name: string;
  link: string;
  relatedLinks?: string[];
  activeIcon?: string;
  inactiveIcon?: string;
  icon?: ReactElement;
  badge?: number;
}

const emptyArray: string[] = [];

export const Tab = ({
  name,
  link,
  relatedLinks = emptyArray,
  activeIcon,
  inactiveIcon,
  icon,
  badge,
}: TabProps) => {
  const pathname = usePathname();
  const isActive
    = link === '/'
      ? pathname === '/'
      : pathname?.startsWith(link)
        || relatedLinks?.some(relatedLink => pathname?.startsWith(relatedLink));

  return (
    <Link
      href={link}
      className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
        isActive
          ? 'text-white shadow-md shadow-primary-500/30'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      {isActive && (
        <>
          <div className="absolute inset-0 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />
          <div className="absolute inset-0 bg-linear-to-br from-primary-400/30 to-transparent" />
        </>
      )}

      {!isActive && (
        <div className="absolute inset-0 rounded-xl bg-slate-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      )}

      {/* Icon — react-icon or image */}
      <div className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon
          ? (
              <span className={`text-[18px] ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`}>
                {icon}
              </span>
            )
          : activeIcon && inactiveIcon
            ? (
                <Image
                  width={20}
                  height={20}
                  src={`/assets/${isActive ? activeIcon : inactiveIcon}`}
                  alt={`${name} icon`}
                  className="h-full w-full object-contain"
                  style={{
                    filter: isActive
                      ? 'brightness(0) saturate(100%) invert(100%)'
                      : 'brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(1000%) hue-rotate(211deg) brightness(95%) contrast(95%)',
                  }}
                />
              )
            : null}
      </div>

      <span className="relative z-10 flex-1 text-sm">{name}</span>

      {badge !== undefined && badge > 0 && (
        <span className={`relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${isActive ? 'bg-white/30 text-white' : 'bg-primary-100 text-primary-700'}`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {isActive && (
        <div className="absolute top-1/2 left-0 h-10 w-1.5 -translate-y-1/2 rounded-r-full bg-white shadow-lg shadow-white/50" />
      )}

    </Link>
  );
};
