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

export type FormData = z.infer<typeof schemaLawyerProfile>;

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
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full max-w-2xl border-2 border-blue-400 shadow-2xl p-8 rounded-lg space-y-6"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            Өмгөөлөгчийн бүртгэл
          </h1>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                x: currentStep > previousStep ? 100 : -100,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentStep > previousStep ? -100 : 100 }}
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
    </FormProvider>
  );
};

export default LawyerRegistrationForm;
