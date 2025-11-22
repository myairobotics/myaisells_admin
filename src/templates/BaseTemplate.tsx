'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaBell } from 'react-icons/fa';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { LuChevronsUpDown, LuSearch } from 'react-icons/lu';
import { DropdownMenu, Logo, Tab } from '@/components/ui';

type BaseTemplateProps = {
  children: React.ReactNode;
};

const BaseTemplate = ({ children }: BaseTemplateProps) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [BusinessDropDownOptions] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const { control } = useForm();

  const logout = () => {
    console.warn('Logout clicked');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-primary-100/50 to-primary-200/30">
      <header className="fixed top-0 right-0 left-0 z-50 border-b-2 border-primary-200/50 bg-white/90 shadow-xl shadow-primary-500/10 backdrop-blur-xl">
        <div className="h-1 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />

        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="mx-8 hidden max-w-2xl flex-1 md:block">
            <Controller
              name="search_text"
              control={control}
              render={() => (
                <div className="group relative">
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary-500/10 to-primary-600/10 opacity-0 blur transition-all duration-300 group-hover:opacity-100" />
                  <LuSearch className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-lg text-primary-600" />
                  <input
                    id="search_text"
                    placeholder="Search anything..."
                    type="search"
                    className="relative w-full rounded-xl border-2 border-primary-200 bg-primary-50/50 py-3 pr-4 pl-12 text-sm text-slate-700 shadow-sm transition-all outline-none placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20"
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="group relative hidden h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary-500/40 md:flex">
              <FaBell className="text-lg text-white transition-transform group-hover:scale-110" />
              <span className="absolute top-2 right-2 h-2 w-2 animate-pulse rounded-full border-2 border-primary-500 bg-white shadow-lg" />
            </button>

            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                className="flex items-center gap-3 rounded-xl border-2 border-primary-200 bg-primary-50/50 px-4 py-2.5 transition-all hover:border-primary-300 hover:bg-primary-100/50"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary-400 to-primary-600 opacity-30 blur-sm" />
                  <Image
                    className="relative h-8 w-8 rounded-full object-cover ring-2 ring-primary-200"
                    src="/assets/placeholder.jpg"
                    alt="user avatar"
                    width={32}
                    height={32}
                  />
                </div>
                <span className="text-sm font-semibold text-primary-700">Myai Sells</span>
                <LuChevronsUpDown className="text-primary-600" />
              </button>
              <DropdownMenu
                options={BusinessDropDownOptions}
                logoutAction={logout}
                isOpen={isDropDownOpen}
                closeAction={() => setIsDropDownOpen(false)}
                triggerRef={triggerRef}
              />

            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary-500/40 md:hidden"
            >
              <HiOutlineMenuAlt1 className="text-xl text-white" />
            </button>
          </div>
        </div>

        {/* <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <LuSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-lg text-primary-600" />
            <input
              placeholder="Search..."
              type="search"
              className="w-full rounded-xl border-2 border-primary-200 bg-primary-50/50 py-3 pr-4 pl-10 text-sm text-slate-700 transition-all outline-none placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20"
            />
          </div>
        </div> */}
      </header>

      <div className="flex pt-16">
        <aside className="fixed top-16 left-0 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r-2 border-primary-200/50 bg-linear-to-b from-white via-primary-50/50 to-primary-100/30 shadow-xl shadow-primary-500/5 md:block">
          <div className="h-1 bg-linear-to-r from-primary-600 to-primary-500" />
          <nav className="relative space-y-2 p-4">
            <Tab name="Dashboard" link="/home" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
            <Tab name="Upload" link="/upload" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
            <Tab name="Subscription" link="/subscription" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
            <Tab name="Appointments" link="/appointments" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
            <Tab name="Users Management" link="/users-management" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
            <Tab name="Payment History" link="/payment-history" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
            <Tab name="Campaign Analytics" link="/campaign-analytics" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
          </nav>
        </aside>

        {isMobileMenuOpen && (
          <div
            role="presentation"
            className="fixed inset-0 top-16 z-40 bg-primary-900/30 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <aside
              role="presentation"
              className="absolute top-0 left-0 h-full w-64 overflow-y-auto border-r-2 border-primary-200 bg-linear-to-b from-white via-primary-50/50 to-primary-100/30 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-1 bg-linear-to-r from-primary-600 to-primary-500" />
              <nav className="relative space-y-2 p-4">
                <Tab name="Dashboard" link="/" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
                <Tab name="Upload" link="/upload" inactiveIcon="dashboard.svg" activeIcon="dashboard_active.png" />
              </nav>
              <div className="relative mt-4 border-t-2 border-primary-200 p-4">
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl border-2 border-transparent px-4 py-3 text-sm font-semibold text-error transition-all hover:border-error/20 hover:bg-error-light"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="min-h-[calc(100vh-4rem)] flex-1 md:ml-64">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseTemplate;
