'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabProps {
  name: string;
  link: string;
  relatedLinks?: string[];
  activeIcon?: string;
  inactiveIcon?: string;
}

const emptyArray: string[] = [];

export const Tab = ({
  name,
  link,
  relatedLinks = emptyArray,
  activeIcon,
  inactiveIcon,
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
      className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 font-semibold transition-all duration-300 ${
        isActive
          ? 'text-white shadow-lg shadow-primary-500/40'
          : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
      }`}
    >
      {/* Active blue gradient background */}
      {isActive && (
        <>
          <div className="absolute inset-0 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />
          <div className="absolute inset-0 bg-linear-to-br from-primary-400/30 to-transparent" />
        </>
      )}

      {/* Hover effect */}
      {!isActive && (
        <div className="absolute inset-0 bg-linear-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}

      {activeIcon && inactiveIcon && (
        <div className={`relative flex h-5 w-5 items-center justify-center transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          <Image
            width={20}
            height={20}
            src={`/assets/${isActive ? activeIcon : inactiveIcon}`}
            alt={`${name} icon`}
            className="h-full w-full object-contain"
            style={{
              filter: isActive
                ? 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'
                : 'brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(1000%) hue-rotate(211deg) brightness(95%) contrast(95%)',
            }}
          />
        </div>
      )}

      <span className="relative z-10 text-sm">{name}</span>

      {/* Active indicator bar - more prominent blue */}
      {isActive && (
        <div className="absolute top-1/2 left-0 h-10 w-1.5 -translate-y-1/2 rounded-r-full bg-white shadow-lg shadow-white/50" />
      )}

      {/* Shine effect on hover */}
      {!isActive && (
        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-primary-500/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
    </Link>
  );
};
