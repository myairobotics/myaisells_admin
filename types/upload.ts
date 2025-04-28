export interface FileAsset {
  id: number;
  path: string;
  content_type: string;
  size: number;
  tags: string[];
  in_knowledge_base: boolean;
}

export interface VideoUploadForm {
  title: string;
  description: string;
  status: boolean;
  duration: string;
  mainVideo: File | null;
  thumbnail: File | null;
  progress: {
    main: number;
    thumbnail: number;
  };
  errors?: {
    title?: string;
    description?: string;
    mainVideo?: string;
    thumbnail?: string;
    duration?: string;
  };
}

export const FILE_SIZE_LIMITS = {
  video: 100 * 1024 * 1024, // 100MB
  image: 5 * 1024 * 1024, // 5MB
};

export const ALLOWED_TYPES = {
  video: ["video/mp4", "video/webm"],
  image: ["image/jpeg", "image/png", "image/webp"],
};
