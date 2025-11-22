import type { ApiResponse } from './api';
import type { FileAsset } from './file';

export interface HowToItem {
  id: number;
  title: string;
  description: string;
  duration: string;
  status: boolean;
  created_at: string;
  mainFileAsset: Pick<FileAsset, 'path' | 'content_type'>;
  thumbnailFileAsset: Pick<FileAsset, 'path' | 'content_type'>;
}

export interface CreateHowTo {
  title: string;
  description: string;
  status: boolean;
  duration: string;
  app_fileasset_id_main: number;
  app_fileasset_id_thumbnail: number;
}

export interface HowToPaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

export interface HowToListData {
  data: HowToItem[];
  meta: HowToPaginationMeta;
}

export type GetAllHowTosResponse = ApiResponse<HowToListData>;
export type GetOneHowToResponse = ApiResponse<HowToItem>;
export type CreateHowToResponse = ApiResponse<HowToItem[]>;
