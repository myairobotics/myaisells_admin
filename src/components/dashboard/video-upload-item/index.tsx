'use client';

import type { VideoUploadFormWithUrls } from '@/types';
import Image from 'next/image';
import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { PiFilmSlate, PiImage } from 'react-icons/pi';
import { Input } from '@/components/ui';
import { ALLOWED_TYPES, FILE_SIZE_LIMITS } from '@/types';

interface VideoUploadItemProps {
  upload: VideoUploadFormWithUrls;
  index: number;
  setUploads: React.Dispatch<React.SetStateAction<VideoUploadFormWithUrls[]>>;
  onRemove: (id: string) => void;
  disabled: boolean;
}

export function VideoUploadItem({
  upload,
  index,
  setUploads,
  onRemove,
  disabled,
}: VideoUploadItemProps) {
  useEffect(() => {
    return () => {
      if (upload.videoUrl) {
        URL.revokeObjectURL(upload.videoUrl);
      }
      if (upload.thumbnailUrl) {
        URL.revokeObjectURL(upload.thumbnailUrl);
      }
    };
  }, [upload.videoUrl, upload.thumbnailUrl]);

  const validateFile = (file: File, type: 'video' | 'image') => {
    if (file.size > FILE_SIZE_LIMITS[type]) {
      return `File size must be less than ${FILE_SIZE_LIMITS[type] / (1024 * 1024)}MB`;
    }
    if (!(ALLOWED_TYPES[type] as readonly string[]).includes(file.type)) {
      return `File type must be ${ALLOWED_TYPES[type].join(' or ')}`;
    }
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setUploads(current =>
      current.map(item =>
        item.id === upload.id
          ? {
              ...item,
              [name]: value,
              errors: item.errors
                ? { ...item.errors, [name]: undefined }
                : { [name]: undefined },
            }
          : item,
      ),
    );
  };

  const handleVideoChange = (file: File | null) => {
    setUploads((current) => {
      return current.map((item) => {
        if (item.id !== upload.id) {
          return item;
        }

        if (item.videoUrl) {
          URL.revokeObjectURL(item.videoUrl);
        }

        if (!file) {
          return {
            ...item,
            mainVideo: null,
            videoUrl: undefined,
          };
        }

        const error = validateFile(file, 'video');
        const newItem = {
          ...item,
          mainVideo: error ? null : file,
          errors: { ...item.errors, mainVideo: error || undefined },
        };

        if (!error) {
          const url = URL.createObjectURL(file);
          newItem.videoUrl = url;

          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            const minutes = Math.floor(video.duration / 60)
              .toString()
              .padStart(2, '0');
            const seconds = Math.floor(video.duration % 60)
              .toString()
              .padStart(2, '0');

            setUploads(c =>
              c.map(it =>
                it.id === upload.id ? { ...it, duration: `${minutes}:${seconds}` } : it,
              ),
            );
          };
          video.src = url;
        }

        return newItem;
      });
    });
  };

  const handleThumbnailChange = (file: File | null) => {
    setUploads(current =>
      current.map((item) => {
        if (item.id !== upload.id) {
          return item;
        }

        if (item.thumbnailUrl) {
          URL.revokeObjectURL(item.thumbnailUrl);
        }

        const errors = { ...item.errors };
        let thumbnail: File | null = item.thumbnail;
        let thumbnailUrl: string | undefined = item.thumbnailUrl;

        if (file) {
          const error = validateFile(file, 'image');
          errors.thumbnail = error || undefined;

          thumbnail = error ? null : file;
          thumbnailUrl = error ? undefined : URL.createObjectURL(file);
        } else {
          thumbnail = null;
          thumbnailUrl = undefined;
          errors.thumbnail = undefined;
        }

        return { ...item, thumbnail, thumbnailUrl, errors };
      }),
    );
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />

      <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
            <h3 className="bg-linear-to-r from-slate-800 to-blue-900 bg-clip-text font-inter text-xl font-bold text-transparent">
              Video #
              {index + 1}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onRemove(upload.id)}
            disabled={disabled}
            className="group rounded-lg p-2 transition-all hover:bg-red-50 disabled:opacity-50"
          >
            <FiX className="h-5 w-5 text-slate-400 transition-colors group-hover:text-red-500" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Left side */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor={`title-${upload.id}`} className="mb-2 block text-sm font-semibold text-slate-700">
                Video Title
              </label>
              <Input
                id={`title-${upload.id}`}
                name="title"
                type="text"
                placeholder="Enter a descriptive title..."
                className={upload.errors?.title ? 'border-red-500! focus:ring-red-500/10!' : ''}
                value={upload.title}
                onChange={handleChange}
                disabled={disabled}
              />
              {upload.errors?.title && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500">
                  <span className="text-xs">⚠</span>
                  {upload.errors.title}
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label htmlFor={`duration-${upload.id}`} className="mb-2 block text-sm font-semibold text-slate-700">
                Duration
              </label>
              <Input
                id={`duration-${upload.id}`}
                name="duration"
                readOnly
                placeholder="Auto-calculated (MM:SS)"
                className={`bg-slate-50! ${
                  upload.errors?.duration ? 'border-red-500! focus:ring-red-500/10!' : ''
                }`}
                value={upload.duration}
                disabled={disabled}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor={`description-${upload.id}`} className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                id={`description-${upload.id}`}
                name="description"
                rows={4}
                placeholder="Provide a detailed description..."
                className={`w-full rounded-xl border px-4 py-3 text-sm transition-all ${
                  upload.errors?.description
                    ? 'border-red-500! bg-red-50/50 focus:ring-red-500/10!'
                    : 'border-blue-100! bg-white/50 focus:border-blue-300 focus:bg-white focus:ring-blue-500/10'
                }`}
                value={upload.description}
                onChange={handleChange}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-5">

            {/* Video File */}
            <div>
              <label htmlFor={`video-${upload.id}`} className="mb-2 block text-sm font-semibold text-slate-700">Video File</label>
              <div className="group relative">
                <input
                  type="file"
                  accept={ALLOWED_TYPES.video.join(',')}
                  onChange={e => handleVideoChange(e.target.files?.[0] || null)}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                  disabled={disabled}
                />
                <div
                  className={`flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 ${
                    upload.errors?.mainVideo
                      ? 'border-red-300 bg-red-50/50'
                      : 'border-blue-200 bg-blue-50/30 group-hover:border-blue-400'
                  }`}
                >
                  <PiFilmSlate className="h-8 w-8 text-blue-500" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">
                      {upload.mainVideo?.name || 'Choose video file'}
                    </p>
                    <p className="text-xs text-slate-500">MP4, MOV, AVI up to 100MB</p>
                  </div>
                </div>
              </div>

              {upload.videoUrl && (
                <video
                  src={upload.videoUrl}
                  className="mt-3 max-h-[200px] w-full rounded-lg"
                  controls
                  muted
                />
              )}

              {upload.errors?.mainVideo && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500">
                  <span className="text-xs">⚠</span>
                  {upload.errors.mainVideo}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label htmlFor={`thumbnail-${upload.id}`} className="mb-2 block text-sm font-semibold text-slate-700">Thumbnail Image</label>
              <div className="group relative">
                <input
                  type="file"
                  accept={ALLOWED_TYPES.image.join(',')}
                  onChange={e => handleThumbnailChange(e.target.files?.[0] || null)}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                  disabled={disabled}
                />
                <div
                  className={`flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 ${
                    upload.errors?.thumbnail
                      ? 'border-red-300 bg-red-50/50'
                      : 'border-blue-200 bg-blue-50/30 group-hover:border-blue-400'
                  }`}
                >
                  <PiImage className="h-8 w-8 text-blue-500" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">
                      {upload.thumbnail?.name || 'Choose thumbnail'}
                    </p>
                    <p className="text-xs text-slate-500">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>

              {upload.thumbnailUrl && (
                <Image
                  src={upload.thumbnailUrl}
                  alt="Thumbnail preview"
                  height={200}
                  width={400}
                  className="mt-3 max-h-[200px] w-full rounded-lg object-cover"
                />
              )}

              {upload.errors?.thumbnail && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500">
                  <span className="text-xs">⚠</span>
                  {upload.errors.thumbnail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
