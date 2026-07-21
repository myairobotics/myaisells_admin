'use client';

import { Dropdown } from '@myairobotics/ui';
import { FiBell, FiCheck } from 'react-icons/fi';
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/services';

export default function NotificationBell() {
  const { data: countData } = useGetUnreadNotificationCountQuery(undefined, { pollingInterval: 60_000 });
  const { data, isLoading } = useGetNotificationsQuery({ limit: 8 });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const unreadCount = countData?.data?.count ?? 0;
  const notifications = data?.data?.data ?? [];

  return (
    <Dropdown
      align="end"
      trigger={(
        <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100">
          <FiBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}
    >
      <div className="w-80 max-w-[90vw]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-bold text-slate-800">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead()}
              disabled={isMarkingAll}
              className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline disabled:opacity-60"
            >
              <FiCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading
            ? <p className="px-4 py-6 text-center text-sm text-slate-400">Loading…</p>
            : notifications.length === 0
              ? <p className="px-4 py-6 text-center text-sm text-slate-400">No notifications yet</p>
              : notifications.map(n => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => !n.read && markRead(n.id)}
                    className={`block w-full border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50 ${n.read ? '' : 'bg-primary-50/40'}`}
                  >
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.body}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{new Date(n.created_at).toLocaleString()}</p>
                  </button>
                ))}
        </div>
      </div>
    </Dropdown>
  );
}
