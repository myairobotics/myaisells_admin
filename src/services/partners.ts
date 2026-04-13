import type {
  CreatePartnerRequest,
  CreatePartnerResponse,
  GetAllPartnersResponse,
  GetOnePartnerResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const partnersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllPartners: builder.query<GetAllPartnersResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `${baseUrl}/partners`,
        params: { page, limit },
      }),
      providesTags: ['Partner'],
    }),

    getOnePartner: builder.query<GetOnePartnerResponse, string>({
      query: id => ({
        url: `${baseUrl}/partners/${id}`,
      }),
      providesTags: ['Partner'],
    }),

    createPartner: builder.mutation<CreatePartnerResponse, CreatePartnerRequest>({
      query: body => ({
        url: `${baseUrl}/partners`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),
  }),
});

export const {
  useGetAllPartnersQuery,
  useGetOnePartnerQuery,
  useCreatePartnerMutation,
} = partnersApi;
