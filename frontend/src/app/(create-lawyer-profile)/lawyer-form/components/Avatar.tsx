"use client";

import { FormData } from "../page";
import { ZodErrors } from "./ZodError";
import { Input } from "@/components/ui/input";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";

type Props = {
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  localPreview?: string | null;
  previewLink?: string | null;
  uploading?: boolean;
  isDragging?: boolean;
  openBrowse?: () => void;
  handleFileSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  setSelectedFile?: (file: File | null) => void;
  setLocalPreview?: (url: string | null) => void;
  deleteImage?: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Avatar = ({
  errors,
  setValue,
  localPreview,
  previewLink,
  uploading,
  isDragging,
  openBrowse,
  handleFileSelect,
  handleDrop,
  setSelectedFile,
  setLocalPreview,
  deleteImage,
  fileInputRef,
  setIsDragging,
}: Props) => {
  return (
    <div className="grid grid-cols-2">
      <div>
        <label
          htmlFor="profileImage"
          className="block text-sm font-medium mb-1"
        >
          Нүүр зураг оруулах
        </label>

        {(localPreview || previewLink) && (
          <button
            type="button"
            onClick={() => {
              setSelectedFile?.(null);
              setLocalPreview?.(null);
              setValue("avatar", "");
              deleteImage?.();
            }}
            className="mt-2 text-sm text-red-500 hover:underline cursor-pointer"
          >
            Зураг арилгах
          </button>
        )}
        {uploading ? (
          <div className="text-sm text-blue-500 mt-2 ">Илгээж байна...</div>
        ) : (
          <ZodErrors
            error={errors.avatar?.message ? [errors.avatar.message] : undefined}
          />
        )}
      </div>

      <Input
        id="profileImage"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <div
        className={`flex items-center justify-center bg-[#eee] w-40 h-40 rounded-full border-dashed border-2 mb-2 ml-auto mr-20 cursor-pointer 
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"}  `}
        onClick={openBrowse}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging?.(true);
        }}
        onDragLeave={() => setIsDragging?.(false)}
      >
        {localPreview ? (
          <img src={localPreview} alt="" className="size-full rounded-full" />
        ) : previewLink ? (
          <img src={previewLink} alt="" className="size-full rounded-full" />
        ) : (
          <span className="text-gray-500 text-center">
            Зураг оруулах талбар
          </span>
        )}
      </div>
    </div>
  );
};

export default Avatar;
