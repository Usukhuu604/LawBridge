import { useState, useCallback } from "react";

interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedUrl: string | null;
}

interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<string>;
  uploadState: FileUploadState;
  resetUploadState: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedUrl: null,
  });

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    // Reset state
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      uploadedUrl: null,
    });

    try {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/mp3",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "File type not supported. Please upload images, videos, audio, or documents."
        );
      }

      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 50MB.");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      // Upload to R2
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      // Complete progress
      setUploadState((prev) => ({
        ...prev,
        progress: 100,
        isUploading: false,
        uploadedUrl: data.url,
      }));

      return data.url;
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : "Upload failed",
        progress: 0,
      }));
      throw error;
    }
  }, []);

  const resetUploadState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      uploadedUrl: null,
    });
  }, []);

  return {
    uploadFile,
    uploadState,
    resetUploadState,
  };
};
