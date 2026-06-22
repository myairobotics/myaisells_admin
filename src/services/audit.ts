import type {
  AuditLogsFilters,
  GetActorLogsResponse,
  GetAuditLogsResponse,
  GetAuditStatsResponse,
  GetOneAuditLogResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const auditApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAuditLogs: builder.query<GetAuditLogsResponse, AuditLogsFilters>({
      query: ({ page = 1, limit = 10, ...filters }) => ({
        url: `${baseUrl}/audit/logs`,
        params: { page, limit, ...filters },
      }),
      providesTags: ['AuditLog'],
    }),

    getAuditLogStats: builder.query<GetAuditStatsResponse, { from?: string; to?: string }>({
      query: params => ({
        url: `${baseUrl}/audit/logs/stats`,
        params,
      }),
      providesTags: ['AuditLog'],
    }),

    getActorLogs: builder.query<
      GetActorLogsResponse,
      { pool: string; actorId: string }
    >({
      query: ({ pool, actorId }) => ({
        url: `${baseUrl}/audit/actors/${pool}/${actorId}/logs`,
      }),
      providesTags: ['AuditLog'],
    }),

    getOneAuditLog: builder.query<GetOneAuditLogResponse, string>({
      query: logId => ({
        url: `${baseUrl}/audit/logs/${logId}`,
      }),
      providesTags: ['AuditLog'],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
  useLazyGetAuditLogsQuery,

  useGetAuditLogStatsQuery,
  useLazyGetAuditLogStatsQuery,

  useGetActorLogsQuery,
  useLazyGetActorLogsQuery,

  useGetOneAuditLogQuery,
  useLazyGetOneAuditLogQuery,
} = auditApi;
