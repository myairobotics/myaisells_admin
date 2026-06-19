import type {
  AddPermissionsToRoleRequest,
  AddPermissionsToRoleResponse,
  CreatePermissionRequest,
  CreatePermissionResponse,
  FlushPermissionCacheResponse,
  GetOnePermissionResponse,
  GetPermissionsResponse,
  GetRolesResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/rbac');

export const rbacApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getPermissions: builder.query<GetPermissionsResponse, void>({
      query: () => ({
        url: `${baseUrl}/permissions`,
      }),
      providesTags: ['Permission'],
    }),

    getOnePermission: builder.query<GetOnePermissionResponse, string>({
      query: id => ({
        url: `${baseUrl}/permissions/${id}`,
      }),
      providesTags: ['Permission'],
    }),

    createPermission: builder.mutation<CreatePermissionResponse, CreatePermissionRequest>({
      query: body => ({
        url: `${baseUrl}/permissions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Permission'],
    }),

    getRoles: builder.query<GetRolesResponse, void>({
      query: () => ({
        url: `${baseUrl}/roles`,
      }),
      providesTags: ['Role'],
    }),

    addPermissionsToRole: builder.mutation<
      AddPermissionsToRoleResponse,
      { roleId: string } & AddPermissionsToRoleRequest
    >({
      query: ({ roleId, ...body }) => ({
        url: `${baseUrl}/roles/${roleId}/permissions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }),

    flushPermissionCache: builder.mutation<FlushPermissionCacheResponse, void>({
      query: () => ({
        url: `${baseUrl}/cache/flush`,
        method: 'POST',
      }),
      invalidatesTags: ['Permission', 'Role'],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useLazyGetPermissionsQuery,

  useGetOnePermissionQuery,
  useLazyGetOnePermissionQuery,

  useCreatePermissionMutation,

  useGetRolesQuery,
  useLazyGetRolesQuery,

  useAddPermissionsToRoleMutation,

  useFlushPermissionCacheMutation,
} = rbacApi;
