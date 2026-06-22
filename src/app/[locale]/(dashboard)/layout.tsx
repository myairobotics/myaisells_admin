import BaseTemplate from '@/templates/BaseTemplate';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseTemplate>{children}</BaseTemplate>;
}
