import type {
  CreateCurrencyRequest,
  CreateCurrencyResponse,
  DeleteCurrencyResponse,
  GetCurrenciesResponse,
  GetOneCurrencyResponse,
  UpdateCurrencyRequest,
  UpdateCurrencyResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

// Mutations on this legacy route additionally require a Xynexi internal API key
// header (`requireXynexi`), separate from the normal admin session bearer token.
export const currenciesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCurrencies: builder.query<GetCurrenciesResponse, void>({
      query: () => ({ url: `${baseUrl}/currencies` }),
      providesTags: ['Currency'],
    }),

    getOneCurrency: builder.query<GetOneCurrencyResponse, string>({
      query: id => ({ url: `${baseUrl}/currencies/${id}` }),
      providesTags: ['Currency'],
    }),

    createCurrency: builder.mutation<CreateCurrencyResponse, { body: CreateCurrencyRequest; xynexiApiKey: string }>({
      query: ({ body, xynexiApiKey }) => ({
        url: `${baseUrl}/currencies`,
        method: 'POST',
        body,
        headers: { 'x-xynexi-api-key': xynexiApiKey },
      }),
      invalidatesTags: ['Currency'],
    }),

    updateCurrency: builder.mutation<UpdateCurrencyResponse, { id: string; body: UpdateCurrencyRequest; xynexiApiKey: string }>({
      query: ({ id, body, xynexiApiKey }) => ({
        url: `${baseUrl}/currencies/${id}`,
        method: 'PATCH',
        body,
        headers: { 'x-xynexi-api-key': xynexiApiKey },
      }),
      invalidatesTags: ['Currency'],
    }),

    deleteCurrency: builder.mutation<DeleteCurrencyResponse, { id: string; xynexiApiKey: string }>({
      query: ({ id, xynexiApiKey }) => ({
        url: `${baseUrl}/currencies/${id}`,
        method: 'DELETE',
        headers: { 'x-xynexi-api-key': xynexiApiKey },
      }),
      invalidatesTags: ['Currency'],
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useLazyGetCurrenciesQuery,
  useGetOneCurrencyQuery,
  useLazyGetOneCurrencyQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
} = currenciesApi;
