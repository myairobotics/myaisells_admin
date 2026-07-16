'use client';

import type { NavSection } from '@myairobotics/ui';
import {
  DashboardHeader,
  DashboardSidebarContent,
  Logo,
  LogoutConfirmDialog,
} from '@myairobotics/ui';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  FiActivity,
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
  FiSettings,
  FiShield,
  FiUserCheck,
  FiUserPlus,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

type BaseTemplateProps = {
  children: React.ReactNode;
};

const NAV_SECTIONS: NavSection[] = [
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
      { name: 'Admin Management', link: '/admin-management', icon: <FiUserPlus /> },
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
      <DashboardHeader
        logo={<Logo />}
        userName={fullName}
        userInitials={initials}
        userEmail={user?.email}
        onLogoutClick={() => setShowLogoutDialog(true)}
        onMobileMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex pt-16">
        {/* Desktop sidebar */}
        <aside className="fixed top-16 left-0 hidden h-[calc(100vh-4rem)] w-64 overflow-hidden border-r border-primary-200/50 bg-white shadow-sm md:block">
          <div className="h-px bg-slate-200" />
          <DashboardSidebarContent sections={NAV_SECTIONS} />
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
              className="absolute top-0 left-0 h-full w-64 overflow-hidden border-r border-primary-200/50 bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-px bg-slate-200" />
              <DashboardSidebarContent sections={NAV_SECTIONS} onLinkClick={() => setIsMobileMenuOpen(false)} />
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
