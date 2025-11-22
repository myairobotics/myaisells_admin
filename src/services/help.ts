import type { CreateHowTo, CreateHowToResponse, GetAllHowTosResponse, GetOneHowToResponse } from '@/types';
import { baseApi } from '@/store/api/baseApi';

export const howtosApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createHowTo: builder.mutation<CreateHowToResponse, CreateHowTo[]>({
      query: body => ({
        url: `/howtos`,
        method: 'POST',
        body,
      }),
    }),

    getAllHowTos: builder.query<GetAllHowTosResponse, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `/howtos`,
        params: { page, pageSize },
      }),
    }),

    getOneHowTo: builder.query<GetOneHowToResponse, number>({
      query: id => ({
        url: `/howtos/${id}`,
      }),
    }),
  }),
});

export const { useGetAllHowTosQuery, useGetOneHowToQuery, useCreateHowToMutation } = howtosApi;
