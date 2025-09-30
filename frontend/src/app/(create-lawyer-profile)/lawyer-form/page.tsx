"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { schemaLawyerProfile } from "./actions/schema";
import FirstCardForLawyer from "./components/cards/FirstCardForLawyer";
import SecondCardForLawyer from "./components/cards/SecondCardForLawyer";
import ThirdCardForLawyer from "./components/cards/ThirdCardForLawyer";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export type FormData = z.infer<typeof schemaLawyerProfile>;

// Hardcoded sample data
const SAMPLE_DATA: Partial<FormData> = {
  firstName: "Батбаяр",
  lastName: "Мөнхбаяр",
  phone: "99887766",
  licenseNumber: "LAW-2014-001",
  university: "Монгол Улсын Их Сургууль - Хууль зүйн сургууль",
  bio: "10 жилийн турш хуульчны мэргэжлээр ажиллаж, олон төрлийн хэргийг амжилттай шийдвэрлэсэн туршлагатай. Хувийн хэрэг, бизнесийн зөрчил, эд хөрөнгийн маргаан зэрэг талбаруудад мэргэшсэн. Үйлчлүүлэгчдийн эрх ашгийг хамгаалах, шударга шүүх шийдвэр гаргахад хувь нэмэр оруулах нь миний зорилго.",
};

const LawyerRegistrationForm = () => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schemaLawyerProfile),
    defaultValues: {
      specializations: [],
    },
  });

  const {
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;
  const watchedSpecializations = watch("specializations");

  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);

  const goToNextStep = async () => {
    let valid = false;

    if (currentStep === 0) {
      valid = await trigger(["firstName", "lastName", "avatar"]);
    } else if (currentStep === 1) {
      valid = await trigger(["licenseNumber", "university", "bio"]);
    } else if (currentStep === 2) {
      valid = await trigger(["specializations"]);
    }

    if (valid) {
      setPreviousStep(currentStep);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const fillWithSampleData = () => {
    // Fill all form fields with sample data
    Object.entries(SAMPLE_DATA).forEach(([key, value]) => {
      if (value !== undefined) {
        methods.setValue(key as keyof FormData, value);
      }
    });

    // Trigger validation to clear any errors
    trigger();

    console.log("Form filled with sample data:", SAMPLE_DATA);
  };

  const CurrentStepComponent = [
    FirstCardForLawyer,
    SecondCardForLawyer,
    ThirdCardForLawyer,
  ][currentStep];

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-screen flex justify-center items-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#003366] to-[#004080] rounded-t-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Өмгөөлөгчийн бүртгэл
                </h1>
                <p className="text-blue-100">
                  Мэргэжлийн өмгөөлөгч болох эхний алхам
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fillWithSampleData}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Түүвэр мэдээлэл оруулах
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 flex items-center space-x-4">
              {[0, 1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      currentStep >= step
                        ? "bg-white text-[#003366]"
                        : "bg-white/20 text-white/70"
                    }
                  `}
                  >
                    {step + 1}
                  </div>
                  {step < 2 && (
                    <div
                      className={`
                      w-12 h-0.5 ml-2
                      ${currentStep > step ? "bg-white" : "bg-white/20"}
                    `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="bg-white border-2 border-[#003366]/20 shadow-2xl rounded-b-2xl p-8 space-y-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{
                  opacity: 0,
                  x: currentStep > previousStep ? 100 : -100,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: currentStep > previousStep ? -100 : 100,
                }}
                className="space-y-4"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <CurrentStepComponent
                  errors={errors}
                  setValue={methods.setValue}
                  register={methods.register}
                  getValues={methods.getValues}
                  watchedSpecializations={watchedSpecializations}
                  goToNextStep={goToNextStep}
                  goToPreviousStep={goToPreviousStep}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default LawyerRegistrationForm;
