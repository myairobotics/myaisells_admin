"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FileAsset,
  VideoUploadForm,
  FILE_SIZE_LIMITS,
  ALLOWED_TYPES,
} from "@/types/upload";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { PiPlus } from "react-icons/pi";
import Image from "next/image";

interface VideoUploadFormWithUrls extends VideoUploadForm {
  videoUrl?: string;
  thumbnailUrl?: string;
}

export default function MultipleVideoUpload() {
  const [uploads, setUploads] = useState<VideoUploadFormWithUrls[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      uploads.forEach((upload) => {
        if (upload.videoUrl) URL.revokeObjectURL(upload.videoUrl);
        if (upload.thumbnailUrl) URL.revokeObjectURL(upload.thumbnailUrl);
      });
    };
  }, []);

  const validateFile = (file: File, type: "video" | "image") => {
    if (file.size > FILE_SIZE_LIMITS[type]) {
      return `File size must be less than ${
        FILE_SIZE_LIMITS[type] / (1024 * 1024)
      }MB`;
    }
    if (!ALLOWED_TYPES[type].includes(file.type)) {
      return `File type must be ${ALLOWED_TYPES[type].join(" or ")}`;
    }
    return null;
  };

  const validateForm = (upload: VideoUploadForm) => {
    const errors: {
      title?: string;
      description?: string;
      mainVideo?: string;
      thumbnail?: string;
      duration?: string;
    } = {};

    if (!upload.title.trim()) errors.title = "Title is required";
    if (!upload.description.trim())
      errors.description = "Description is required";
    if (!upload.mainVideo) errors.mainVideo = "Video file is required";
    if (!upload.thumbnail) errors.thumbnail = "Thumbnail is required";
    if (!upload.duration) errors.duration = "Duration is required";

    return errors;
  };

  const handleUpload = async () => {
    try {
      const formErrors = uploads.map(validateForm);
      if (formErrors.some((errors) => Object.keys(errors).length > 0)) {
        const newUploads = uploads.map((upload, index) => ({
          ...upload,
          errors: formErrors[index],
        }));
        setUploads(newUploads);
        return;
      }

      setIsUploading(true);

      const uploadResults = await Promise.all(
        uploads.map(async (upload, index) => {
          const files: { type: string; asset: FileAsset }[] = [];

          // Upload main video with progress
          if (upload.mainVideo) {
            const formData = new FormData();
            formData.append("files", upload.mainVideo);

            const mainVideoResponse = await axios.post<FileAsset[]>(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/buckets/${
                JSON.parse(sessionStorage.getItem("profile") || "{}").bucket_id
              }/files`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                onUploadProgress: (progressEvent) => {
                  const progress =
                    (progressEvent.loaded / (progressEvent.total || 0)) * 100;
                  const newUploads = [...uploads];
                  newUploads[index].progress.main = progress;
                  setUploads(newUploads);
                },
              }
            );
            files.push({ type: "main", asset: mainVideoResponse.data[0] });
          }

          // Upload thumbnail with progress
          if (upload.thumbnail) {
            const formData = new FormData();
            formData.append("files", upload.thumbnail);

            const thumbnailResponse = await axios.post<FileAsset[]>(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/buckets/${
                JSON.parse(sessionStorage.getItem("profile") || "{}").bucket_id
              }/files`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                onUploadProgress: (progressEvent) => {
                  const progress =
                    (progressEvent.loaded / (progressEvent.total || 0)) * 100;
                  const newUploads = [...uploads];
                  newUploads[index].progress.thumbnail = progress;
                  setUploads(newUploads);
                },
              }
            );
            files.push({ type: "thumbnail", asset: thumbnailResponse.data[0] });
          }

          return { upload, files };
        })
      );

      // Create and submit help video posts
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/howtos`,
        uploadResults.map(({ upload, files }) => ({
          title: upload.title,
          description: upload.description,
          status: upload.status,
          duration: upload.duration,
          app_fileasset_id_main:
            files.find((f) => f.type === "main")?.asset.id || 0,
          app_fileasset_id_thumbnail:
            files.find((f) => f.type === "thumbnail")?.asset.id || 0,
        })),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Videos uploaded successfully!");
      setUploads([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Modified file change handler for video
  const handleVideoChange = (file: File | null, index: number) => {
    const newUploads = [...uploads];

    // Cleanup old URL if it exists
    if (newUploads[index].videoUrl) {
      URL.revokeObjectURL(newUploads[index].videoUrl);
    }

    if (file) {
      const error = validateFile(file, "video");
      newUploads[index].mainVideo = error ? null : file;

      if (!error) {
        const url = URL.createObjectURL(file);
        newUploads[index].videoUrl = url;

        // Get video duration
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          const minutes = Math.floor(video.duration / 60);
          const seconds = Math.floor(video.duration % 60);

          // Updating state with the detected duration
          const newUploadsWithDuration = [...uploads];
          newUploadsWithDuration[index].duration = `${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          setUploads(newUploadsWithDuration);
        };
        video.src = url;
      }

      newUploads[index].errors = {
        ...newUploads[index].errors,
        mainVideo: error || undefined,
      };
    }

    setUploads(newUploads);
  };

  const handleThumbnailChange = (file: File | null, index: number) => {
    const newUploads = [...uploads];

    // Cleanup
    if (newUploads[index].thumbnailUrl) {
      URL.revokeObjectURL(newUploads[index].thumbnailUrl);
    }

    if (file) {
      const error = validateFile(file, "image");
      newUploads[index].thumbnail = error ? null : file;
      newUploads[index].thumbnailUrl = error
        ? undefined
        : URL.createObjectURL(file);
      newUploads[index].errors = {
        ...newUploads[index].errors,
        thumbnail: error || undefined,
      };
    }

    setUploads(newUploads);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Help Videos</h1>

      <div className="space-y-6">
        {uploads.map((upload, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => setUploads(uploads.filter((_, i) => i !== index))}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      upload.errors?.title ? "border-red-500" : ""
                    }`}
                    value={upload.title}
                    onChange={(e) => {
                      const newUploads = [...uploads];
                      newUploads[index].title = e.target.value;
                      setUploads(newUploads);
                    }}
                  />
                  {upload.errors?.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {upload.errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (MM:SS)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 05:30"
                    pattern="[0-9]{1,2}:[0-9]{2}"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      upload.errors?.duration ? "border-red-500" : ""
                    }`}
                    value={upload.duration}
                    onChange={(e) => {
                      const newUploads = [...uploads];
                      newUploads[index].duration = e.target.value;
                      setUploads(newUploads);
                    }}
                  />
                  {upload.errors?.duration && (
                    <p className="mt-1 text-sm text-red-500">
                      {upload.errors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      upload.errors?.description ? "border-red-500" : ""
                    }`}
                    rows={3}
                    value={upload.description}
                    onChange={(e) => {
                      const newUploads = [...uploads];
                      newUploads[index].description = e.target.value;
                      setUploads(newUploads);
                    }}
                  />
                  {upload.errors?.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {upload.errors.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Video File
                  </label>
                  <input
                    type="file"
                    accept={ALLOWED_TYPES.video.join(",")}
                    onChange={(e) =>
                      handleVideoChange(e.target.files?.[0] || null, index)
                    }
                    className="mt-1 block w-full"
                  />
                  {upload.videoUrl && (
                    <video
                      className="mt-2 max-h-32 rounded"
                      src={upload.videoUrl}
                      controls
                    />
                  )}
                  {upload.progress.main > 0 && upload.progress.main < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${upload.progress.main}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    accept={ALLOWED_TYPES.image.join(",")}
                    onChange={(e) =>
                      handleThumbnailChange(e.target.files?.[0] || null, index)
                    }
                    className="mt-1 block w-full"
                  />
                  {upload.thumbnailUrl && (
                    <Image
                      src={upload.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="mt-2 max-h-32 rounded object-cover"
                    />
                  )}
                  {upload.progress.thumbnail > 0 &&
                    upload.progress.thumbnail < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${upload.progress.thumbnail}%` }}
                        ></div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            onClick={() => {
              setUploads([
                ...uploads,
                {
                  title: "",
                  description: "",
                  status: true,
                  duration: "",
                  mainVideo: null,
                  thumbnail: null,
                  progress: { main: 0, thumbnail: 0 },
                  videoUrl: undefined,
                  thumbnailUrl: undefined,
                },
              ]);
            }}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PiPlus className="h-5 w-5 mr-2" />
            Add Another Video
          </button>

          <button
            onClick={handleUpload}
            disabled={isUploading || uploads.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isUploading ? "Uploading..." : "Upload All Videos"}
          </button>
        </div>
      </div>
    </div>
  );
}
