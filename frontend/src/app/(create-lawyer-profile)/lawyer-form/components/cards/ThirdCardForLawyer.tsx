"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FieldErrors, useFormContext, UseFormSetValue } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { Button, Checkbox, Input } from "@/components/ui/index";
import { ZodErrors } from "../ZodError";
import { FormData } from "../../page";
import { formatMoneyDigits } from "../../../../utils/numberFormat";
import { CREATE_LAWYER_MUTATION } from "@/graphql/lawyer";
import { useUser } from "@clerk/nextjs";
import {
  useCreateSpecializationMutation,
  useGetAdminSpecializationsQuery,
  useGetLawyerByIdQuery,
} from "@/generated";
import { Shield } from "lucide-react";

type Props = {
  errors: FieldErrors<FormData>;
  watchedSpecializations: string[];
  setValue: UseFormSetValue<FormData>;
  isSubmitting?: boolean;
  goToPreviousStep?: () => void;
};

const ThirdCardForLawyer = ({
  errors,
  watchedSpecializations,
  setValue,
  goToPreviousStep,
}: Props) => {
  const { push } = useRouter();
  const { getValues } = useFormContext<FormData>();
  const { user } = useUser();

  const [hourlyRates, setHourlyRates] = useState<{ [key: string]: string }>({});

  const [recommendPaid, setRecommendPaid] = useState<{
    [key: string]: boolean;
  }>({});

  const [createLawyer, { loading: creatingLawyer }] = useMutation(
    CREATE_LAWYER_MUTATION
  );
  const [createSpecialization] = useCreateSpecializationMutation();
  const { data } = useGetAdminSpecializationsQuery();
  const specializations = data?.getAdminSpecializations || [];

  // Check if lawyer already exists
  const { data: existingLawyer, loading: checkingLawyer } =
    useGetLawyerByIdQuery({
      variables: { lawyerId: user?.id || "" },
      skip: !user?.id,
      errorPolicy: "ignore", // Don't show error if lawyer doesn't exist
    });

  useEffect(() => {
    if (Array.isArray(watchedSpecializations)) {
      setRecommendPaid((prev) => {
        const updated: { [key: string]: boolean } = {};
        watchedSpecializations.forEach((id) => {
          updated[id] = prev[id] ?? false;
        });
        return updated;
      });
    }
  }, [watchedSpecializations]);

  const handleRegister = async () => {
    const formData = getValues();
    const lawyerId = user?.id;
    const EmailAddress = user?.emailAddresses[0]?.emailAddress;

    if (!lawyerId) {
      console.error("lawyerId олдсонгүй");
      return alert("Нэвтэрсэн хэрэглэгчийн ID олдсонгүй.");
    }

    // Check if user is already registered as a lawyer
    if (existingLawyer?.getLawyerById) {
      alert(
        "Та аль хэдийн өмгөөлөгчөөр бүртгэгдсэн байна. Профайл хуудас руу шилжиж байна."
      );
      push("/my-profile/me");
      return;
    }

    try {
      await createLawyer({
        variables: {
          input: {
            lawyerId: lawyerId,
            email: EmailAddress,
            firstName: formData.firstName,
            lastName: formData.lastName,
            profilePicture: formData.avatar,
            licenseNumber: formData.licenseNumber,
            university: formData.university,
            bio: formData.bio,
            document: "",
          },
        },
      });
      // Only create specializations if there are any selected
      if (
        Array.isArray(watchedSpecializations) &&
        watchedSpecializations.length > 0
      ) {
        try {
          // Map string IDs to actual ObjectIds from the API
          const specializationsToCreate = watchedSpecializations
            .map((specId) => {
              // Find the actual specialization object from the API response
              const actualSpec = specializations.find(
                (spec) => spec.id === specId
              );

              if (!actualSpec) {
                return null;
              }

              const sub = Boolean(recommendPaid[specId] ?? false);
              let price = 0;

              if (sub && hourlyRates[specId]) {
                try {
                  const raw = hourlyRates[specId]
                    .split(" ")[1]
                    ?.replace(/'/g, "");
                  price = raw ? parseInt(raw, 10) : 0;
                } catch {
                  price = 0;
                }
              }

              return {
                lawyerId: lawyerId,
                specializationId: actualSpec.id, // Use the actual ObjectId from API
                subscription: sub,
                pricePerHour: price,
              };
            })
            .filter(Boolean); // Remove null entries

          // Check if we have any valid specializations after mapping
          if (specializationsToCreate.length === 0) {
            return;
          }

          // Validate the data before sending
          const validSpecializations = specializationsToCreate
            .filter((spec) => spec !== null)
            .map((spec) => ({
              ...spec,
              subscription: Boolean(spec.subscription),
            }))
            .filter(
              (spec) =>
                spec.lawyerId &&
                spec.specializationId &&
                typeof spec.subscription === "boolean" &&
                typeof spec.pricePerHour === "number"
            );

          if (validSpecializations.length === 0) {
            return;
          }

          await createSpecialization({
            variables: {
              input: {
                specializations: validSpecializations,
              },
            },
          });
        } catch {
          // Don't throw the error, just continue
          // The lawyer profile was already created successfully
        }
      }

      push("/pending-approval");
    } catch (error: any) {
      // Handle specific GraphQL errors
      if (error?.message && error.message.includes("already exists")) {
        push("/my-profile/me"); // Redirect to profile page
      }
    }
  };

  const handleCheckboxChange = (checked: boolean | string, value: string) => {
    const current = Array.isArray(watchedSpecializations)
      ? watchedSpecializations
      : [];
    if (checked) {
      setValue("specializations", [...current, value]);
    } else {
      setValue(
        "specializations",
        current.filter((s) => s !== value)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-[#003366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-[#003366]" />
        </div>
        <h2 className="text-2xl font-bold text-[#003366] mb-2">
          Тусгайлсан талбарууд
        </h2>
        <p className="text-gray-600">Ажиллах мэргэжлийн талбараа сонгоно уу</p>
      </div>

      <div>
        <label className="block font-semibold text-[#003366] mb-4 text-lg">
          Ажиллах талбараа сонгоно уу *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {specializations.map((spec) => (
            <div
              key={spec.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200
                ${
                  Array.isArray(watchedSpecializations) &&
                  watchedSpecializations.includes(spec.id)
                    ? "border-[#003366] bg-[#003366]/5"
                    : "border-gray-200 hover:border-[#003366]/50 hover:bg-[#003366]/5"
                }
              `}
            >
              <Checkbox
                id={`spec-${spec.id}`}
                checked={
                  Array.isArray(watchedSpecializations) &&
                  watchedSpecializations.includes(spec.id)
                }
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked, spec.id)
                }
                className="cursor-pointer data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366]"
              />
              <label
                htmlFor={`spec-${spec.id}`}
                className="text-sm cursor-pointer flex-1 font-medium"
              >
                {spec.categoryName}
              </label>
            </div>
          ))}
        </div>
        <ZodErrors
          error={
            errors.specializations?.message
              ? [errors.specializations.message]
              : undefined
          }
        />
      </div>

      {watchedSpecializations.length > 0 && (
        <div className="space-y-4 relative">
          <label className="block font-medium mb-4 text-[16px]">
            Та төлбөртэй үйлчилгээ санал болгох уу?
          </label>
          {watchedSpecializations.map((specId) => {
            const spec = specializations.find((s) => s.id === specId);
            if (!spec) return null;

            const isChecked = recommendPaid[specId] || false;

            return (
              <div
                key={specId}
                className={`flex items-center p-3 border rounded-lg transition-colors ${
                  isChecked
                    ? "bg-[#003366] border-[#003366] text-white"
                    : "border-[#003366] hover:bg-gray-100"
                }`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).tagName !== "INPUT") {
                    setRecommendPaid((prev) => ({
                      ...prev,
                      [specId]: !isChecked,
                    }));
                  }
                }}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    setRecommendPaid((prev) => ({
                      ...prev,
                      [specId]: Boolean(checked),
                    }))
                  }
                />
                <label className="text-sm ml-2">
                  {`${spec.categoryName} ${
                    isChecked ? "талбарт төлбөртэй ажиллана" : "үнэгүй ажиллана"
                  }`}
                </label>
                {isChecked && (
                  <div className="ml-auto">
                    <Input
                      placeholder="Цагийн хөлс"
                      value={hourlyRates[specId] || ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        setHourlyRates((prev) => ({
                          ...prev,
                          [specId]: formatMoneyDigits(raw),
                        }));
                      }}
                      className="w-32 text-xs"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 mt-6 gap-10">
        <Button
          onClick={goToPreviousStep}
          className="bg-[#333333] text-white hover:bg-gray-800"
        >
          Буцах
        </Button>
        <Button
          onClick={handleRegister}
          disabled={creatingLawyer || checkingLawyer}
          className="bg-[#003366] text-white hover:bg-[#003366]/80"
        >
          {creatingLawyer
            ? "Илгээж байна..."
            : checkingLawyer
            ? "Шалгаж байна..."
            : "Бүртгүүлэх"}
        </Button>
      </div>
    </div>
  );
};

export default ThirdCardForLawyer;
