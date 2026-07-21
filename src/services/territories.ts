import type {
  AssignTerritoryRequest,
  AssignTerritoryResponse,
  CreateTerritoryRequest,
  CreateTerritoryResponse,
  DeleteTerritoryResponse,
  GetOneTerritoryResponse,
  GetTerritoriesResponse,
  GetTerritoryAssignmentsResponse,
  GetTerritoryBusinessesResponse,
  UnassignTerritoryResponse,
  UpdateTerritoryRequest,
  UpdateTerritoryResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const territoriesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTerritoryBusinesses: builder.query<GetTerritoryBusinessesResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 15 } = {}) => ({
        url: `${baseUrl}/territories/businesses`,
        params: { page, limit },
      }),
      providesTags: ['Territory'],
    }),

    getTerritories: builder.query<GetTerritoriesResponse, { parentId?: string; type?: string; search?: string }>({
      query: ({ parentId, type, search } = {}) => ({
        url: `${baseUrl}/territories`,
        params: { ...(parentId && { parentId }), ...(type && { type }), ...(search && { search }) },
      }),
      providesTags: ['Territory'],
    }),

    createTerritory: builder.mutation<CreateTerritoryResponse, CreateTerritoryRequest>({
      query: body => ({
        url: `${baseUrl}/territories`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Territory'],
    }),

    getOneTerritory: builder.query<GetOneTerritoryResponse, string>({
      query: territoryId => ({ url: `${baseUrl}/territories/${territoryId}` }),
      providesTags: ['Territory'],
    }),

    updateTerritory: builder.mutation<UpdateTerritoryResponse, { territoryId: string; body: UpdateTerritoryRequest }>({
      query: ({ territoryId, body }) => ({
        url: `${baseUrl}/territories/${territoryId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Territory'],
    }),

    deleteTerritory: builder.mutation<DeleteTerritoryResponse, string>({
      query: territoryId => ({
        url: `${baseUrl}/territories/${territoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Territory'],
    }),

    assignTerritory: builder.mutation<AssignTerritoryResponse, { territoryId: string; body: AssignTerritoryRequest }>({
      query: ({ territoryId, body }) => ({
        url: `${baseUrl}/territories/${territoryId}/assign`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Territory'],
    }),

    unassignTerritory: builder.mutation<UnassignTerritoryResponse, { territoryId: string; body: AssignTerritoryRequest }>({
      query: ({ territoryId, body }) => ({
        url: `${baseUrl}/territories/${territoryId}/assign`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Territory'],
    }),

    getTerritoryAssignments: builder.query<GetTerritoryAssignmentsResponse, { ownerType: string; ownerId: string }>({
      query: ({ ownerType, ownerId }) => ({
        url: `${baseUrl}/territories/owners/${ownerType}/${ownerId}/assignments`,
      }),
      providesTags: ['Territory'],
    }),
  }),
});

export const {
  useGetTerritoryBusinessesQuery,
  useLazyGetTerritoryBusinessesQuery,

  useGetTerritoriesQuery,
  useLazyGetTerritoriesQuery,

  useCreateTerritoryMutation,

  useGetOneTerritoryQuery,
  useLazyGetOneTerritoryQuery,

  useUpdateTerritoryMutation,
  useDeleteTerritoryMutation,
  useAssignTerritoryMutation,
  useUnassignTerritoryMutation,

  useGetTerritoryAssignmentsQuery,
  useLazyGetTerritoryAssignmentsQuery,
} = territoriesApi;
