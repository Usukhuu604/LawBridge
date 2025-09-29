"use client";

import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ZodErrors } from "../ZodError";
import { FormData } from "../../page";
import { useUploadAvatar } from "../../hooks/useUploadAvatar";
import Avatar from "../Avatar";

type Props = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  goToNextStep?: () => void;
  setValue: UseFormSetValue<FormData>;
  getValues: UseFormGetValues<FormData>;
};

const FirstCardForLawyer = ({ register, errors, goToNextStep, setValue }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { fileInputRef, previewLink, uploading, isDragging, openBrowse, deleteImage, setIsDragging, uploadToServer } = useUploadAvatar({
    onUpload: (url: string) => {
      setValue("avatar", url);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleNextStep = async () => {
    if (errors.firstName?.message || errors.lastName?.message) {
      return;
    }

    // Хэрэв зураг сонгогдсон бол сервер рүү upload хийж URL авах
    if (selectedFile) {
      const uploadedUrl = await uploadToServer(selectedFile);
      if (typeof uploadedUrl === "string") {
        setValue("avatar", uploadedUrl);
      }
    }

    // Дараагийн алхам руу шилжих
    if (goToNextStep) goToNextStep();
  };

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            Нэр
          </label>
          <Input id="firstName" {...register("firstName")} />
          <ZodErrors error={errors.firstName?.message ? [errors.firstName.message] : undefined} />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Овог
          </label>
          <Input id="lastName" {...register("lastName")} />
          <ZodErrors error={errors.lastName?.message ? [errors.lastName.message] : undefined} />
        </div>
      </div>

      <Avatar
        errors={errors}
        setValue={setValue}
        localPreview={localPreview}
        previewLink={previewLink}
        uploading={uploading}
        isDragging={isDragging}
        openBrowse={openBrowse}
        handleFileSelect={handleFileSelect}
        handleDrop={handleDrop}
        setSelectedFile={setSelectedFile}
        setLocalPreview={setLocalPreview}
        deleteImage={deleteImage}
        fileInputRef={fileInputRef}
        setIsDragging={setIsDragging}
      />

      <Button onClick={handleNextStep} className="w-full bg-blue-500 hover:bg-blue-400 cursor-pointer text-white">
        Дараачийн
      </Button>
    </div>
  );
};

export default FirstCardForLawyer;
