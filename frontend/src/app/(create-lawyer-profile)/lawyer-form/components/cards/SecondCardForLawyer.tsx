"use client";

import { useState } from "react";

import { Input, Textarea, Button } from "@/components/ui/index";
import { ZodErrors } from "../ZodError";
import { FormData } from "../../page";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { GraduationCap } from "lucide-react";

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
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-[#003366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-[#003366]" />
        </div>
        <h2 className="text-2xl font-bold text-[#003366] mb-2">
          Мэргэжлийн мэдээлэл
        </h2>
        <p className="text-gray-600">
          Өөрийн мэргэжлийн тухай мэдээллийг оруулна уу
        </p>
      </div>

      <div>
        <label
          htmlFor="licenseNumber"
          className="block text-sm font-semibold text-[#003366] mb-2"
        >
          Өмгөөлөгчийн дугаар *
        </label>
        <Input
          id="licenseNumber"
          {...register("licenseNumber")}
          className="border-[#003366]/30 focus:border-[#003366] focus:ring-[#003366]/20"
          placeholder="Жишээ: LAW-2014-001"
        />
        <ZodErrors
          error={
            errors.licenseNumber?.message
              ? [errors.licenseNumber.message]
              : undefined
          }
        />
      </div>

      <div>
        <label
          htmlFor="university"
          className="block text-sm font-semibold text-[#003366] mb-2"
        >
          Их Сургуулийн Мэдээлэл *
        </label>
        <Input
          id="university"
          {...register("university")}
          className="border-[#003366]/30 focus:border-[#003366] focus:ring-[#003366]/20"
          placeholder="Жишээ: Монгол Улсын Их Сургууль"
        />
        <ZodErrors
          error={
            errors.university?.message ? [errors.university.message] : undefined
          }
        />
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-semibold text-[#003366] mb-2"
        >
          Мэргэжлийн намтар *
        </label>
        <Textarea
          id="bio"
          {...register("bio")}
          rows={4}
          className="border-[#003366]/30 focus:border-[#003366] focus:ring-[#003366]/20"
          placeholder="Өөрийн мэргэжлийн туршлага, онцлогийг товчоор тайлбарлана уу..."
        />
        <ZodErrors
          error={errors.bio?.message ? [errors.bio.message] : undefined}
        />
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
          className="bg-[#003366] hover:bg-[#003366]/80 cursor-pointer text-white"
        >
          Үргэжлүүлэх
        </Button>
      </div>
    </div>
  );
};

export default SecondCardForLawyer;
