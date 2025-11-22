'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Logo: React.FC = () => {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && router.push('/')}
      onClick={() => router.push('/')}
      className="group cursor-pointer"
    >
      <Image
        width={1000}
        height={1000}
        src="/assets/logo.svg"
        className="hidden h-10 w-auto transition-transform group-hover:scale-105 md:block"
        alt="logo"
      />
      <Image
        width={1000}
        height={1000}
        src="/assets/logo_min.svg"
        className="block h-9 w-auto transition-transform group-hover:scale-105 md:hidden"
        alt="logo"
      />
    </div>
  );
};

export default Logo;
