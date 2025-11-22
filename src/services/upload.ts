import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { UploadFilesRequest, UploadFilesResponse } from '@/types';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
});

export const uploadsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    uploadFiles: builder.mutation<UploadFilesResponse, UploadFilesRequest>({
      queryFn: async ({ files, tag }, _queryApi, _extraOptions) => {
        const session = await getSession();
        const bucketId = session?.business?.bucket_id;

        if (!bucketId) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Bucket ID not found in session',
            } as FetchBaseQueryError,
          };
        }

        const formData = new FormData();
        files.forEach((file, i) => formData.append(`file${i + 1}`, file));
        if (tag) {
          formData.append('tag', tag);
        }

        const result = await rawBaseQuery(
          {
            url: `/buckets/${bucketId}/files`,
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              Accept: 'application/json',
            },
          },
          _queryApi,
          _extraOptions,
        );

        if (result.error) {
          return { error: result.error };
        }
        return { data: result.data as UploadFilesResponse };
      },
    }),
  }),
});

export const { useUploadFilesMutation } = uploadsApi;
