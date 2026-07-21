import type { ApiAdminResponse } from './api';

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  type?: string;
  created_at: string;
}

export interface NotificationsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsData {
  data: AdminNotification[];
  pagination: NotificationsPagination;
}

export interface UnreadNotificationCount {
  count: number;
}

export interface NotificationActionResponse {
  success: boolean;
  message: string;
}

export type GetNotificationsResponse = ApiAdminResponse<NotificationsData>;
export type GetUnreadNotificationCountResponse = ApiAdminResponse<UnreadNotificationCount>;
export type MarkNotificationReadResponse = ApiAdminResponse<NotificationActionResponse>;
export type MarkAllNotificationsReadResponse = ApiAdminResponse<NotificationActionResponse>;
