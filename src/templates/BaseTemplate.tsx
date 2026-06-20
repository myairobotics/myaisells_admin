'use client';

import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiGlobe,
  FiGrid,
  FiHelpCircle,
  FiLink,
  FiList,
  FiLock,
  FiLogOut,
  FiSettings,
  FiShield,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { LuChevronsUpDown } from 'react-icons/lu';
import { signOut, useSession } from 'next-auth/react';
import {
  DialogContent,
  DialogRoot,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Logo,
  Tab,
} from '@/components/ui';

type BaseTemplateProps = {
  children: React.ReactNode;
};

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', link: '/home', icon: <FiGrid /> },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Partners', link: '/partners', icon: <FiGlobe /> },
      { name: 'Businesses', link: '/businesses', icon: <FiBriefcase /> },
      { name: 'Users', link: '/users-management', icon: <FiUsers /> },
      { name: 'Sales Agents', link: '/sales-agents', icon: <FiUserCheck /> },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Campaigns', link: '/campaign-analytics', icon: <FiActivity /> },
      { name: 'Appointments', link: '/appointments', icon: <FiCalendar /> },
      { name: 'Subscriptions', link: '/subscription', icon: <FiCreditCard /> },
      { name: 'Token Management', link: '/token-management', icon: <FiZap /> },
    ],
  },
  {
    label: 'Analytics & Reports',
    items: [
      { name: 'Analytics', link: '/analytics', icon: <FiBarChart2 /> },
      { name: 'Payment History', link: '/payment-history', icon: <FiList /> },
    ],
  },
  {
    label: 'Access & Security',
    items: [
      { name: 'Support Access', link: '/support-access', icon: <FiShield /> },
      { name: 'Roles & Permissions', link: '/roles-permissions', icon: <FiLock /> },
      { name: 'Audit Logs', link: '/audit-logs', icon: <FiActivity /> },
    ],
  },
  {
    label: 'Settings',
    items: [
      { name: 'Referral Management', link: '/referral-management', icon: <FiLink /> },
      { name: 'Platform Settings', link: '/settings', icon: <FiSettings /> },
      { name: 'Help Center', link: '/help', icon: <FiHelpCircle /> },
    ],
  },
];

function LogoutConfirmDialog({
  open,
  onCancel,
  onConfirm,
  isLoggingOut,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <DialogRoot open={open} onOpenChange={open => { if (!open) onCancel(); }}>
      <DialogContent hideClose title="Sign out" className="max-w-sm">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <FiAlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-slate-500">
              Are you sure you want to sign out of your account?
            </p>
          </div>
          <div className="flex w-full gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoggingOut}
              className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
            >
              {isLoggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
  <div className="flex h-full flex-col">
    <div className="flex-1 overflow-y-auto p-3">
      {NAV_SECTIONS.map(section => (
        <div key={section.label} className="mb-4">
          <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {section.label}
          </p>
          <div className="space-y-0.5">
            {section.items.map(item => (
              <div key={item.link} onClick={onLinkClick}>
                <Tab name={item.name} link={item.link} icon={item.icon} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BaseTemplate = ({ children }: BaseTemplateProps) => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;
  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name ?? ''}`.trim()
    : 'Admin';
  const initials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : 'A';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 right-0 left-0 z-50 border-b-2 border-primary-200/50 bg-white/90 shadow-xl shadow-primary-500/10 backdrop-blur-xl">
        <div className="h-1 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />

        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              type="button"
              className="group relative hidden h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary-500/40 md:flex"
            >
              <FaBell className="text-lg text-white transition-transform group-hover:scale-110" />
              <span className="absolute top-2 right-2 h-2 w-2 animate-pulse rounded-full border-2 border-primary-500 bg-white shadow-lg" />
            </button>

            {/* User dropdown — desktop only */}
            <div className="hidden md:block">
              <Dropdown
                align="end"
                trigger={(
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-xl border-2 border-primary-200 bg-primary-50/50 px-4 py-2.5 transition-all hover:border-primary-300 hover:bg-primary-100/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-xs font-bold text-white ring-2 ring-primary-200">
                      {initials}
                    </div>
                    <span className="max-w-[120px] truncate text-sm font-semibold text-primary-700">
                      {fullName}
                    </span>
                    <LuChevronsUpDown className="h-4 w-4 shrink-0 text-primary-600" />
                  </button>
                )}
              >
                {/* User info header */}
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-800">{fullName}</p>
                  {user?.email && (
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  )}
                </div>

                <DropdownSeparator />

                <DropdownItem className="gap-2 text-slate-600">
                  <FiUser className="h-4 w-4" />
                  My profile
                </DropdownItem>

                <DropdownSeparator />

                <DropdownItem
                  onSelect={() => setShowLogoutDialog(true)}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign out
                </DropdownItem>
              </Dropdown>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary-500/40 md:hidden"
            >
              <HiOutlineMenuAlt1 className="text-xl text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop sidebar */}
        <aside className="fixed top-16 left-0 hidden h-[calc(100vh-4rem)] w-64 overflow-hidden border-r border-slate-200 bg-white shadow-sm md:block">
          <div className="h-px bg-slate-200" />
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <div
            role="presentation"
            className="fixed inset-0 top-16 z-40 bg-primary-900/30 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <aside
              role="presentation"
              className="absolute top-0 left-0 h-full w-64 overflow-hidden border-r border-slate-200 bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-px bg-slate-200" />
              <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
            </aside>
          </div>
        )}

        <main className="min-h-[calc(100vh-4rem)] flex-1 md:ml-64">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
};

export default BaseTemplate;
