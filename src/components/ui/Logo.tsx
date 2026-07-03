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
        width={220}
        height={120}
        src="/assets/logo.png"
        className="hidden h-10 w-auto transition-transform group-hover:scale-105 md:block"
        alt="Xynexi"
      />
      <Image
        width={220}
        height={120}
        src="/assets/logo.png"
        className="block h-9 w-auto transition-transform group-hover:scale-105 md:hidden"
        alt="Xynexi"
      />
    </div>
  );
};

export default Logo;
