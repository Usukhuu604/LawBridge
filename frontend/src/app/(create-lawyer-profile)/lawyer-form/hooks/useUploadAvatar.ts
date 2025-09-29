"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const LOCALSTORAGE_KEY = "avatar_image_key";
const LOCALSTORAGE_EXP = "avatar_image_key_exp";
const CACHE_MINUTES = 15;

export const useUploadAvatar = ({ onUpload }: { onUpload: (key: string) => void }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageKey, setImageKey] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 1. Expiration/caching logic
  useEffect(() => {
    const cachedKey = localStorage.getItem(LOCALSTORAGE_KEY);
    const cachedExp = localStorage.getItem(LOCALSTORAGE_EXP);
    if (cachedKey && cachedExp && Date.now() < Number(cachedExp)) {
      setImageKey(cachedKey);
      onUpload(cachedKey);

      const msUntilExpire = Number(cachedExp) - Date.now();
      const timeout = setTimeout(() => {
        deleteImage();
      }, msUntilExpire);

      return () => clearTimeout(timeout);
    } else if (cachedKey && cachedExp && Date.now() >= Number(cachedExp)) {
      deleteImage();
    }
    // eslint-disable-next-line
  }, [onUpload]);

  // 2. Generate preview URL (replace with real public url if needed)
  const getPreviewLink = useCallback(
    (key: string) => (key ? `/lawyer-form/api/get?key=${encodeURIComponent(key)}&t=${Date.now()}` : ""),
    []
  );

  // 3. Open browse
  const openBrowse = () => fileInputRef.current?.click();

  // 4. Upload logic
  const uploadToServer = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (imageKey) formData.append("existingKey", imageKey);

    try {
      const res = await fetch("/lawyer-form/api/upload", {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const key = data.key || imageKey;
      setImageKey(key);
      onUpload(key);
      const exp = Date.now() + CACHE_MINUTES * 60 * 1000;
      localStorage.setItem(LOCALSTORAGE_KEY, key);
      localStorage.setItem(LOCALSTORAGE_EXP, exp.toString());

      setTimeout(() => {
        deleteImage();
      }, CACHE_MINUTES * 60 * 1000);

      return key;
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image");
      return "";
    } finally {
      setUploading(false);
    }
  };

  // 5. Handle file select
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadToServer(file);
  };

  // 6. Handle drop (drag & drop support)
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      await uploadToServer(event.dataTransfer.files[0]);
    }
  };

  // 7. Delete from R2 and clear everything
  const deleteImage = async () => {
    if (imageKey) {
      try {
        await fetch("/lawyer-form/api/delete", {
          method: "POST",
          body: JSON.stringify({ key: imageKey }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Failed to delete image from bucket", err);
      }
    }
    setImageKey("");
    onUpload("");
    localStorage.removeItem(LOCALSTORAGE_KEY);
    localStorage.removeItem(LOCALSTORAGE_EXP);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    fileInputRef,
    previewLink: getPreviewLink(imageKey),
    uploading,
    isDragging,
    openBrowse,
    handleFileSelect,
    handleDrop,
    deleteImage,
    setIsDragging,
    uploadToServer,
    imageKey,
  };
};
