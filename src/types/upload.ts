import type { FileAsset, VideoUploadForm } from './file';

export interface UploadFilesRequest {
  files: File[];
  tag?: string;
}

export type UploadFilesResponse = FileAsset[];

export interface VideoUploadFormWithUrls extends VideoUploadForm {
  id: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  errors?: Record<string, string | undefined>;
}
