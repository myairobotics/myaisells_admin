"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Logo: React.FC = () => {
  const router = useRouter();

  return (
    <div onClick={() => router.push("/")} className='cursor-pointer'>
      <Image
        width={1000}
        height={1000}
        src='/assets/logo.svg'
        className='hidden md:block w-32 h-12'
        alt='logo'
      />
      <Image
        width={1000}
        height={1000}
        src='/assets/logo_min.svg'
        className='block md:hidden w-12 h-8'
        alt='logo'
      />
    </div>
  );
};

export default Logo;
