"use client";

import { useState } from "react";

import { Input, Textarea, Button } from "@/components/ui/index";
import { ZodErrors } from "../ZodError";
import { FormData } from "../../page";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
};

const SecondCardForLawyer = ({
  register,
  errors,
  goToNextStep,
  goToPreviousStep,
}: Props) => {
  const [, setSelectedDocs] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDocs(e.target.files);
  };

  const handleNextStep = () => {
    // document uploading to cloudflare r2

    if (goToNextStep) goToNextStep();
  };

  const handlePreviousStep = goToPreviousStep;

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1">
          Өмгөөлөгчийн дугаар
        </label>
        <Input id="licenseNumber" {...register("licenseNumber")} />
        <ZodErrors
          error={
            errors.licenseNumber?.message
              ? [errors.licenseNumber.message]
              : undefined
          }
        />
      </div>

      <div>
        <label htmlFor="university" className="block text-sm font-medium mb-1">
          Их Сургуулийн Мэдээлэл
        </label>
        <Input id="university" {...register("university")} />
        <ZodErrors
          error={
            errors.university?.message ? [errors.university.message] : undefined
          }
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          Мэргэжлийн намтар
        </label>
        <Textarea id="bio" {...register("bio")} rows={4} />
        <ZodErrors error={errors.bio?.message ? [errors.bio.message] : undefined} />
      </div>

      <div>
        <label htmlFor="documents" className="block text-sm font-medium mb-1">
          Шаардлагатай бичиг баримт (сонголтоор)
        </label>
        <Input
          id="documents"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      </div>

      <div className="w-full grid grid-cols-2 justify-between gap-5 mt-4">
        <Button
          onClick={handlePreviousStep}
          className="bg-[#333333] text-white cursor-pointer hover:bg-gray-800 "
        >
          Буцах
        </Button>
        <Button
          onClick={handleNextStep}
          className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white"
        >
          Үргэжлүүлэх
        </Button>
      </div>
    </div>
  );
};

export default SecondCardForLawyer;
 