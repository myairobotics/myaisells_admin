export type FileAsset = {
  id: number;
  path: string;
  content_type: string;
  size: number;
  tags: string[];
  in_knowledge_base: boolean;

  bucket_id: string;
  name: string;

  owner_id: string | null;
  owner_type: string | null;
  created_at: string;
  updated_at: string;
  error: string | null;
  status: string | null;
};

export type UploadProgress = {
  main: number;
  thumbnail: number;
};

export type VideoUploadForm = {
  title: string;
  description: string;
  status: boolean;
  duration: string;
  mainVideo: File | null;
  thumbnail: File | null;
  errors?: Partial<Record<'title' | 'description' | 'mainVideo' | 'thumbnail' | 'duration', string>>;
};

export const FILE_SIZE_LIMITS = {
  video: 100 * 1024 * 1024, // 100MB
  image: 5 * 1024 * 1024, // 5MB
} as const;

export const ALLOWED_TYPES = {
  video: ['video/mp4', 'video/webm'],
  image: ['image/jpeg', 'image/png', 'image/webp'],
} as const;
