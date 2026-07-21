import type {
  BusinessDepartment,
  BusinessFaq,
  BusinessFolder,
  BusinessKnowledgeBaseSource,
  BusinessProduct,
  BusinessProductExpert,
  BusinessSalesCampaign,
  BusinessSupportEntity,
  BusinessSupportInfo,
  BusinessTextContent,
  CreateDepartmentRequest,
  CreateProductExpertRequest,
  CreateProductRequest,
  CreateSalesCampaignRequest,
  CreateSupportInfoRequest,
  CreateTextContentRequest,
  CreateWorkingHourRequest,
  DeleteEntityResponse,
  GetAgentAvatarsResponse,
  GetAgentLanguageResponse,
  GetBusinessProfileResponse,
  GetBusinessSupportOverviewResponse,
  GetOneAgentAvatarResponse,
  GetWorkingHoursResponse,
  ListEntityResponse,
  OneEntityResponse,
  ResetWorkingHoursResponse,
  ScrapeKnowledgeBaseResponse,
  ToggleWorkingHoursDayResponse,
  UpdateAgentAvatarRequest,
  UpdateAgentAvatarResponse,
  UpdateAgentLanguageRequest,
  UpdateAgentLanguageResponse,
  UpdateBusinessProfileResponse,
  UpdateWorkingHourRequest,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');
const businessBase = (businessId: string) => `${baseUrl}/businesses/${businessId}`;

/**
 * Restricted-action DELETE/reset routes read `confirm` and `reason` from the
 * query string, not the body. See RestrictedActionParams in types.
 */
type DeleteWithReason = { businessId: string; id: string; reason: string };

export const adminBusinessSupportApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Support-mode overview
    getBusinessSupportOverview: builder.query<GetBusinessSupportOverviewResponse, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/support-overview` }),
      providesTags: ['BusinessSupport'],
    }),

    // Profile (singleton)
    getBusinessSupportProfile: builder.query<GetBusinessProfileResponse, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/profile` }),
      providesTags: ['BusinessSupport'],
    }),

    updateBusinessSupportProfile: builder.mutation<UpdateBusinessProfileResponse, { businessId: string; body: Record<string, unknown> }>({
      query: ({ businessId, body }) => ({
        url: `${businessBase(businessId)}/profile`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Products & Services. NOTE: creating with {name, description, price}
    // consistently 500s server-side as of 2026-07-20; this is a backend bug,
    // not a client-side field mismatch (validation passes, the DB write fails).
    getBusinessProducts: builder.query<ListEntityResponse<BusinessProduct>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/products` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessProduct: builder.mutation<OneEntityResponse<BusinessProduct>, { businessId: string; body: CreateProductRequest }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/products`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessProduct: builder.query<OneEntityResponse<BusinessProduct>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/products/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessProduct: builder.mutation<OneEntityResponse<BusinessProduct>, { businessId: string; id: string; body: Partial<CreateProductRequest> }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/products/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessProduct: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/products/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // FAQs
    getBusinessFaqs: builder.query<ListEntityResponse<BusinessFaq>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/faqs` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessFaq: builder.mutation<OneEntityResponse<BusinessFaq>, { businessId: string; body: { question: string; answer: string } }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/faqs`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessFaq: builder.query<OneEntityResponse<BusinessFaq>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/faqs/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessFaq: builder.mutation<OneEntityResponse<BusinessFaq>, { businessId: string; id: string; body: { question?: string; answer?: string } }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/faqs/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessFaq: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/faqs/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Support Info
    getBusinessSupportInfos: builder.query<ListEntityResponse<BusinessSupportInfo>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/support` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessSupportInfo: builder.mutation<OneEntityResponse<BusinessSupportInfo>, { businessId: string; body: CreateSupportInfoRequest }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/support`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessSupportInfo: builder.query<OneEntityResponse<BusinessSupportInfo>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/support/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessSupportInfo: builder.mutation<OneEntityResponse<BusinessSupportInfo>, { businessId: string; id: string; body: Partial<CreateSupportInfoRequest> }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/support/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessSupportInfo: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/support/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Departments
    getBusinessDepartments: builder.query<ListEntityResponse<BusinessDepartment>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/departments` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessDepartment: builder.mutation<OneEntityResponse<BusinessDepartment>, { businessId: string; body: CreateDepartmentRequest }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/departments`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessDepartment: builder.query<OneEntityResponse<BusinessDepartment>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/departments/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessDepartment: builder.mutation<OneEntityResponse<BusinessDepartment>, { businessId: string; id: string; body: Partial<CreateDepartmentRequest> }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/departments/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessDepartment: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/departments/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Product Experts
    getBusinessProductExperts: builder.query<ListEntityResponse<BusinessProductExpert>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/product-experts` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessProductExpert: builder.mutation<OneEntityResponse<BusinessProductExpert>, { businessId: string; body: CreateProductExpertRequest }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/product-experts`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessProductExpert: builder.query<OneEntityResponse<BusinessProductExpert>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/product-experts/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessProductExpert: builder.mutation<OneEntityResponse<BusinessProductExpert>, { businessId: string; id: string; body: Partial<CreateProductExpertRequest> }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/product-experts/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessProductExpert: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/product-experts/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Learning Bucket folders
    getBusinessFolders: builder.query<ListEntityResponse<BusinessFolder>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/folders` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessFolder: builder.mutation<OneEntityResponse<BusinessFolder>, { businessId: string; body: Record<string, unknown> }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/folders`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessFolder: builder.query<OneEntityResponse<BusinessFolder>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/folders/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessFolder: builder.mutation<OneEntityResponse<BusinessFolder>, { businessId: string; id: string; body: Record<string, unknown> }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/folders/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessFolder: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/folders/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Learning Bucket text content
    getBusinessTextContents: builder.query<ListEntityResponse<BusinessTextContent>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/text-contents` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessTextContent: builder.mutation<OneEntityResponse<BusinessTextContent>, { businessId: string; body: CreateTextContentRequest }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/text-contents`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessTextContent: builder.query<OneEntityResponse<BusinessTextContent>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/text-contents/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessTextContent: builder.mutation<OneEntityResponse<BusinessTextContent>, { businessId: string; id: string; body: Partial<CreateTextContentRequest> }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/text-contents/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessTextContent: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/text-contents/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Sales Campaigns ("Promotions")
    getBusinessSalesCampaigns: builder.query<ListEntityResponse<BusinessSalesCampaign>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/sales-campaigns` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessSalesCampaign: builder.mutation<OneEntityResponse<BusinessSalesCampaign>, { businessId: string; body: CreateSalesCampaignRequest }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/sales-campaigns`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessSalesCampaign: builder.query<OneEntityResponse<BusinessSalesCampaign>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/sales-campaigns/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessSalesCampaign: builder.mutation<OneEntityResponse<BusinessSalesCampaign>, { businessId: string; id: string; body: Partial<CreateSalesCampaignRequest> }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/sales-campaigns/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessSalesCampaign: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/sales-campaigns/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // AI agent avatars (read + name/gender update only)
    getBusinessAgentAvatars: builder.query<GetAgentAvatarsResponse, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/agent/avatars` }),
      providesTags: ['BusinessSupport'],
    }),
    getBusinessAgentAvatar: builder.query<GetOneAgentAvatarResponse, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/agent/avatars/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessAgentAvatar: builder.mutation<UpdateAgentAvatarResponse, { businessId: string; id: string; body: UpdateAgentAvatarRequest }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/agent/avatars/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // AI agent language
    getBusinessAgentLanguage: builder.query<GetAgentLanguageResponse, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/agent/language` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessAgentLanguage: builder.mutation<UpdateAgentLanguageResponse, { businessId: string; body: UpdateAgentLanguageRequest }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/agent/language`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Knowledge base (website crawl sources)
    getBusinessKnowledgeBase: builder.query<ListEntityResponse<BusinessKnowledgeBaseSource>, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/knowledge-base` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessKnowledgeBaseSource: builder.mutation<OneEntityResponse<BusinessKnowledgeBaseSource>, { businessId: string; body: Record<string, unknown> }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/knowledge-base`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    getBusinessKnowledgeBaseSource: builder.query<OneEntityResponse<BusinessKnowledgeBaseSource>, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/knowledge-base/${id}` }),
      providesTags: ['BusinessSupport'],
    }),
    updateBusinessKnowledgeBaseSource: builder.mutation<OneEntityResponse<BusinessKnowledgeBaseSource>, { businessId: string; id: string; body: Record<string, unknown> }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/knowledge-base/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessKnowledgeBaseSource: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/knowledge-base/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),
    rescrapeBusinessKnowledgeBaseSource: builder.mutation<ScrapeKnowledgeBaseResponse, { businessId: string; id: string }>({
      query: ({ businessId, id }) => ({ url: `${businessBase(businessId)}/knowledge-base/${id}/scrape`, method: 'POST' }),
      invalidatesTags: ['BusinessSupport'],
    }),

    // Working hours
    getBusinessWorkingHours: builder.query<GetWorkingHoursResponse, string>({
      query: businessId => ({ url: `${businessBase(businessId)}/working-hours` }),
      providesTags: ['BusinessSupport'],
    }),
    createBusinessWorkingHour: builder.mutation<OneEntityResponse<BusinessSupportEntity>, { businessId: string; body: CreateWorkingHourRequest }>({
      query: ({ businessId, body }) => ({ url: `${businessBase(businessId)}/working-hours`, method: 'POST', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    updateBusinessWorkingHour: builder.mutation<OneEntityResponse<BusinessSupportEntity>, { businessId: string; id: string; body: UpdateWorkingHourRequest }>({
      query: ({ businessId, id, body }) => ({ url: `${businessBase(businessId)}/working-hours/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BusinessSupport'],
    }),
    deleteBusinessWorkingHour: builder.mutation<DeleteEntityResponse, DeleteWithReason>({
      query: ({ businessId, id, reason }) => ({ url: `${businessBase(businessId)}/working-hours/${id}`, method: 'DELETE', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),
    resetBusinessWorkingHours: builder.mutation<ResetWorkingHoursResponse, { businessId: string; reason: string }>({
      query: ({ businessId, reason }) => ({ url: `${businessBase(businessId)}/working-hours/reset`, method: 'POST', params: { confirm: true, reason } }),
      invalidatesTags: ['BusinessSupport'],
    }),
    toggleBusinessWorkingHoursDay: builder.mutation<ToggleWorkingHoursDayResponse, { businessId: string; dow: string | 'all'; disabled: boolean }>({
      query: ({ businessId, dow, disabled }) => ({
        url: `${businessBase(businessId)}/working-hours/${dow}/disable`,
        method: 'PATCH',
        body: { disabled },
      }),
      invalidatesTags: ['BusinessSupport'],
    }),
  }),
});

export const {
  useGetBusinessSupportOverviewQuery,
  useLazyGetBusinessSupportOverviewQuery,

  useGetBusinessSupportProfileQuery,
  useLazyGetBusinessSupportProfileQuery,
  useUpdateBusinessSupportProfileMutation,

  useGetBusinessProductsQuery,
  useCreateBusinessProductMutation,
  useGetBusinessProductQuery,
  useUpdateBusinessProductMutation,
  useDeleteBusinessProductMutation,

  useGetBusinessFaqsQuery,
  useCreateBusinessFaqMutation,
  useGetBusinessFaqQuery,
  useUpdateBusinessFaqMutation,
  useDeleteBusinessFaqMutation,

  useGetBusinessSupportInfosQuery,
  useCreateBusinessSupportInfoMutation,
  useGetBusinessSupportInfoQuery,
  useUpdateBusinessSupportInfoMutation,
  useDeleteBusinessSupportInfoMutation,

  useGetBusinessDepartmentsQuery,
  useCreateBusinessDepartmentMutation,
  useGetBusinessDepartmentQuery,
  useUpdateBusinessDepartmentMutation,
  useDeleteBusinessDepartmentMutation,

  useGetBusinessProductExpertsQuery,
  useCreateBusinessProductExpertMutation,
  useGetBusinessProductExpertQuery,
  useUpdateBusinessProductExpertMutation,
  useDeleteBusinessProductExpertMutation,

  useGetBusinessFoldersQuery,
  useCreateBusinessFolderMutation,
  useGetBusinessFolderQuery,
  useUpdateBusinessFolderMutation,
  useDeleteBusinessFolderMutation,

  useGetBusinessTextContentsQuery,
  useCreateBusinessTextContentMutation,
  useGetBusinessTextContentQuery,
  useUpdateBusinessTextContentMutation,
  useDeleteBusinessTextContentMutation,

  useGetBusinessSalesCampaignsQuery,
  useCreateBusinessSalesCampaignMutation,
  useGetBusinessSalesCampaignQuery,
  useUpdateBusinessSalesCampaignMutation,
  useDeleteBusinessSalesCampaignMutation,

  useGetBusinessAgentAvatarsQuery,
  useGetBusinessAgentAvatarQuery,
  useUpdateBusinessAgentAvatarMutation,

  useGetBusinessAgentLanguageQuery,
  useUpdateBusinessAgentLanguageMutation,

  useGetBusinessKnowledgeBaseQuery,
  useCreateBusinessKnowledgeBaseSourceMutation,
  useGetBusinessKnowledgeBaseSourceQuery,
  useUpdateBusinessKnowledgeBaseSourceMutation,
  useDeleteBusinessKnowledgeBaseSourceMutation,
  useRescrapeBusinessKnowledgeBaseSourceMutation,

  useGetBusinessWorkingHoursQuery,
  useCreateBusinessWorkingHourMutation,
  useUpdateBusinessWorkingHourMutation,
  useDeleteBusinessWorkingHourMutation,
  useResetBusinessWorkingHoursMutation,
  useToggleBusinessWorkingHoursDayMutation,
} = adminBusinessSupportApi;
