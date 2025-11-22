'use client';

import type { FileAsset, VideoUploadForm, VideoUploadFormWithUrls } from '@/types';
import { randomUUID } from 'node:crypto';
import { useState } from 'react';
import { PiPlus, PiUploadSimple } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui';
import { useCreateHowToMutation } from '@/services/help';
import { useUploadFilesMutation } from '@/services/upload';
import { VideoUploadItem } from '../video-upload-item';

const NEW_UPLOAD_ITEM_DEFAULT = {
  title: '',
  description: '',
  status: true,
  duration: '',
  mainVideo: null,
  thumbnail: null,
  videoUrl: undefined,
  thumbnailUrl: undefined,
  errors: {},
} satisfies Omit<VideoUploadFormWithUrls, 'id'>;

export default function MultipleVideoUpload() {
  const [uploads, setUploads] = useState<VideoUploadFormWithUrls[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadFilesTrigger] = useUploadFilesMutation();
  const [createHowToTrigger] = useCreateHowToMutation();

  const validateForm = (upload: VideoUploadForm) => {
    const errors: Record<string, string> = {};

    if (!upload.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!upload.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!upload.mainVideo) {
      errors.mainVideo = 'Video file is required';
    }
    if (!upload.thumbnail) {
      errors.thumbnail = 'Thumbnail is required';
    }
    if (!upload.duration) {
      errors.duration = 'Duration is required';
    }

    return errors;
  };

  const handleUpload = async () => {
    const formErrors = uploads.map(validateForm);
    if (formErrors.some(errors => Object.keys(errors).length > 0)) {
      const newUploads = uploads.map((upload, index) => ({
        ...upload,
        errors: formErrors[index],
      }));
      setUploads(newUploads);
      toast.error('Please fix the errors in the forms before uploading.');
      return;
    }

    setIsUploading(true);
    try {
      const uploadResults = await Promise.all(
        uploads.map(async (upload) => {
          const files: { type: string; asset: FileAsset }[] = [];

          const mainVideoResponse = await uploadFilesTrigger({
            files: [upload.mainVideo!],
          }).unwrap();
          if (mainVideoResponse && mainVideoResponse[0]) {
            files.push({ type: 'main', asset: mainVideoResponse[0] });
          } else {
            throw new Error('Server did not return a file for the main video.');
          }

          const thumbnailResponse = await uploadFilesTrigger({
            files: [upload.thumbnail!],
          }).unwrap();
          if (thumbnailResponse && thumbnailResponse[0]) {
            files.push({ type: 'thumbnail', asset: thumbnailResponse[0] });
          } else {
            throw new Error('Server did not return a file for the thumbnail.');
          }

          return { upload, files };
        }),
      );

      await createHowToTrigger(
        uploadResults.map(({ upload, files }) => ({
          title: upload.title,
          description: upload.description,
          status: upload.status,
          duration: upload.duration,
          app_fileasset_id_main:
            files.find(f => f.type === 'main')?.asset.id || 0,
          app_fileasset_id_thumbnail:
            files.find(f => f.type === 'thumbnail')?.asset.id || 0,
        })),
      ).unwrap();

      toast.success('Videos uploaded successfully!');
      setUploads([]);
    } catch (error: any) {
      toast.error(error.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddItem = () => {
    setUploads(prev => [
      ...prev,
      { ...NEW_UPLOAD_ITEM_DEFAULT, id: randomUUID() },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    const target = uploads.find(u => u.id === id);
    if (target?.videoUrl) {
      URL.revokeObjectURL(target.videoUrl);
    }
    if (target?.thumbnailUrl) {
      URL.revokeObjectURL(target.thumbnailUrl);
    }

    setUploads(uploads.filter(u => u.id !== id));
  };

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      {/* Header Section */}
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />
        <div className="absolute inset-0 bg-linear-to-br from-primary-400/30 to-transparent" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />

        <div className="relative flex flex-col justify-between space-y-4 px-6 py-8 md:px-8 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
              Upload Help Videos 🎥
            </h1>
            <p className="text-base font-medium text-white/90 md:text-lg">
              Create engaging tutorials and guides for your users
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-sm">
              <PiUploadSimple className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">
                {uploads.length}
                {' '}
                {uploads.length === 1 ? 'video' : 'videos'}
                {' '}
                ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 space-y-6">
        {uploads.length === 0
          ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                <div className="relative flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-blue-100/50 bg-white/80 p-12 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <PiUploadSimple className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-800">
                    No videos added yet
                  </h3>
                  <p className="mb-8 max-w-md text-center text-slate-600">
                    Start by adding your first video to create helpful tutorials for your users
                  </p>
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    className="btn-gradient-primary"
                  >
                    <PiPlus className="mr-2 h-5 w-5" />
                    Add Your First Video
                  </Button>
                </div>
              </div>
            )
          : (
              <>
                {uploads.map((upload, index) => (
                  <VideoUploadItem
                    key={upload.id}
                    upload={upload}
                    index={index}
                    setUploads={setUploads}
                    onRemove={handleRemoveItem}
                    disabled={isUploading}
                  />
                ))}

                <div className="sticky bottom-0 z-10 flex flex-col gap-4 rounded-xl border border-blue-100/50 bg-white/90 p-4 shadow-xl backdrop-blur-sm sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={isUploading}
                    className="btn-gradient-secondary"
                  >
                    <PiPlus className="mr-2 h-5 w-5" />
                    Add Another Video
                  </Button>

                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading || uploads.length === 0}
                    className="btn-gradient-primary"
                  >
                    <PiUploadSimple className="mr-2 h-5 w-5" />
                    {isUploading ? 'Uploading...' : `Upload All Videos (${uploads.length})`}
                  </Button>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
