import MetricsDashboard from '@/components/dashboard/metrics-dashboard';
import { DashboardRefreshButton } from '@/components/dashboard/metrics-dashboard/refresh-button';
import { auth } from '@/libs/auth';

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />
        <div className="absolute inset-0 bg-linear-to-br from-primary-400/30 to-transparent" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />

        <div className="relative flex flex-col justify-between space-y-4 px-6 py-8 md:px-8 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
              {`Hello, ${session?.user?.first_name || session?.user?.email || 'Admin'}! 👋`}
            </h1>
            <p className="text-base font-medium text-white/90 md:text-lg">
              Here's an overview of
              {' '}
              <span className="font-bold text-white">
                MyaiSells
              </span>
              {' '}
              performance in the last 7 days
            </p>
          </div>

          <DashboardRefreshButton />
        </div>
      </div>

      <div className="relative flex-1">
        <MetricsDashboard />
      </div>
    </div>
  );
}
