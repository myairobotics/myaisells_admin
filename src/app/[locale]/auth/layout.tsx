import Image from 'next/image';
import Link from 'next/link';
import { FiActivity, FiBarChart2, FiLock } from 'react-icons/fi';

const FEATURES = [
  { icon: FiActivity, label: 'Real-time audit logs & activity tracking' },
  { icon: FiLock, label: 'Role-based access control for every admin' },
  { icon: FiBarChart2, label: 'Deep analytics across all business accounts' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">

      {/* Left brand panel (desktop only) */}
      <aside className="relative hidden flex-col overflow-hidden bg-linear-to-br from-primary-900 via-primary-800 to-primary-700 lg:flex lg:w-[480px] xl:w-[540px]">

        {/* Decorative geometry */}
        <div className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-white/4" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-[480px] w-[480px] rounded-full bg-primary-600/20 blur-2xl" />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/" className="inline-flex">
            <Image
              src="/assets/logo.png"
              alt="Xynexi"
              width={66}
              height={36}
              priority
              className="h-9 w-auto"
            />
          </Link>
        </div>

        {/* Brand copy */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-10 pb-16">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-primary-100 uppercase backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Admin Portal
          </div>

          <h2 className="text-4xl leading-tight font-bold text-white xl:text-5xl">
            Manage your
            <br />
            <span className="text-primary-300">entire platform</span>
            <br />
            from one place.
          </h2>

          <p className="mt-5 max-w-xs text-base leading-relaxed text-primary-200">
            Full control over businesses, partners, users, tokens, and platform settings, built for the people who run the show.
          </p>

          {/* Feature cards */}
          <div className="mt-12 space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/7 px-4 py-3.5 backdrop-blur-sm"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary-300" />
                <span className="text-sm font-medium text-primary-100">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="relative z-10 border-t border-white/10 px-10 py-5">
          <p className="text-xs text-primary-300">
            {`© ${new Date().getFullYear()} Xynexi. All rights reserved.`}
          </p>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-1 flex-col bg-snowBlue">

        {/* Mobile header */}
        <div className="flex items-center border-b border-slate-100 bg-white px-6 py-4 lg:hidden">
          <Link href="/" className="inline-flex">
            <Image
              src="/assets/logo.png"
              alt="Xynexi"
              width={59}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-5 py-12">
          {children}
        </div>
      </main>

    </div>
  );
}
