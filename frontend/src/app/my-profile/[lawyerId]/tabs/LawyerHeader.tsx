"use client";

import { useState, useEffect } from "react";
import { MailIcon, Pencil, Save, University, X } from "lucide-react";
import { useUploadAvatar } from "@/app/(create-lawyer-profile)/lawyer-form/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Removed unused card imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { GET_LAWYER_BY_LAWYERID_QUERY, UPDATE_LAWYER_MUTATION } from "@/graphql/lawyer";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SPECIALIZATION_BY_LAWYER_ID } from "@/graphql/specializationsbylawyer";

type LawyerProfileHeaderProps = {
  lawyerId: string;
};

export const LawyerProfileHeader = ({ lawyerId }: LawyerProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const { data, loading } = useQuery(GET_LAWYER_BY_LAWYERID_QUERY, {
    variables: { lawyerId },
  });

  const lawyer = data?.getLawyerById;

  const { data: specializationData, loading: specialLoad } = useQuery(GET_SPECIALIZATION_BY_LAWYER_ID, {
    variables: { lawyerId },
  });

  const [form, setForm] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    specialization: [] as {
      specializationId: string;
      categoryName: string;
    }[],
    bio: "",
  });

  useEffect(() => {
    if (lawyer && specializationData?.getSpecializationsByLawyer) {
      setForm({
        avatar: lawyer.profilePicture || "",
        firstName: lawyer.firstName || "",
        lastName: lawyer.lastName || "",
        email: lawyer.email || "",
        university: lawyer.university || "",
        specialization: specializationData.getSpecializationsByLawyer || [],
        bio: lawyer.bio || "",
      });
    }
  }, [lawyer, specializationData]);

  const [updateLawyer, { loading: updating }] = useMutation(UPDATE_LAWYER_MUTATION);

  const { fileInputRef, uploading, openBrowse, uploadToServer } = useUploadAvatar({
    onUpload: () => {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      let uploadedUrl = form.avatar;

      if (selectedFile) {
        const result = await uploadToServer(selectedFile);
        if (typeof result === "string") {
          uploadedUrl = result;
        } else {
          throw new Error("Зургийн хаяг алга байна.");
        }
      }

      const variables = {
        updateLawyerLawyerId2: lawyer._id,
        input: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          bio: form.bio,
          profilePicture: uploadedUrl,
        },
      };

      const { data } = await updateLawyer({ variables });

      console.log("Амжилттай шинэчлэгдлээ:", data);
      setIsEditing(false);
      setLocalPreview(null);
    } catch (error) {
      console.error("Шинэчлэх үед алдаа гарлаа:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse bg-white rounded-2xl h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="md:border-b border-gray-100">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            <div className="relative group flex-shrink-0">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-4 border-white shadow-lg">
                <AvatarImage
                  src={localPreview || `https://pub-c16a65dfb75c4bf1b7d1984fa8323c49.r2.dev/${form.avatar}`}
                  alt="Avatar"
                  className="object-cover"
                />
                <AvatarFallback className="text-xl font-semibold bg-blue-100 text-[#003366]">
                  {form.firstName.charAt(0)}
                  {form.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={openBrowse}
                    className="absolute bottom-2 right-2 p-2 bg-[#003366] text-white rounded-full shadow-lg hover:bg-[#004080] transition-colors group-hover:opacity-100 opacity-80"
                    disabled={uploading}
                  >
                    <Pencil size={16} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} hidden />
                </>
              )}
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 text-left space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 text-center sm:text-left">
                  {form.lastName} {form.firstName}
                </h1>

                {!isEditing && (
                  <>
                    {specialLoad ? (
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                      </div>
                    ) : form.specialization.length > 0 ? (
                      <div className="flex flex-wrap justify-start gap-2 mb-4">
                        {form.specialization.map((spec) => (
                          <span
                            key={spec.specializationId}
                            className="bg-[#003366] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg font-medium"
                          >
                            {spec.categoryName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4">Мэргэжлийн чиглэл оруулаагүй байна</p>
                    )}

                    <div className="space-y-2 text-gray-600">
                      <div className="flex gap-2 justify-start items-center">
                        <University size={18} className="text-gray-500" />
                        <span>{form.university}</span>
                      </div>
                      <div className="flex gap-2 justify-start items-center">
                        <MailIcon size={18} className="text-gray-500" />
                        <span>{form.email}</span>
                      </div>
                    </div>

                    {form.bio && <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-4 max-w-2xl">{form.bio}</p>}
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="flex justify-start">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="bg-white border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-colors px-6 py-2 rounded-lg font-medium"
                  >
                    <Pencil size={16} className="mr-2" />
                    Шинэчлэх
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Section */}
      {isEditing && (
        <div className="p-4 sm:p-6 lg:p-8 bg-white">
          <Separator className="mb-6 lg:mb-8" />
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Мэдээлэл засах</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Нэр</Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#003366] focus:ring-[#003366]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Овог</Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#003366] focus:ring-[#003366]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Имэйл</Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#003366] focus:ring-[#003366]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Их сургууль</Label>
                <Input
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#003366] focus:ring-[#003366]"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-700">Танилцуулга</Label>
                <Textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  className="border-gray-300 focus:border-[#003366] focus:ring-[#003366]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setLocalPreview(null);
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 sm:px-6 py-2 rounded-lg w-full sm:w-auto"
              >
                <X size={16} className="mr-2" />
                Болих
              </Button>

              <Button
                onClick={handleSave}
                disabled={uploading || updating}
                className="bg-[#003366] hover:bg-[#004080] text-white px-4 sm:px-6 py-2 rounded-lg font-medium w-full sm:w-auto"
              >
                <Save size={16} className="mr-2" />
                {uploading || updating ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
