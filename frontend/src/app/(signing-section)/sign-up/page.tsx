"use client";

import { useRouter } from "next/navigation";
import { UserIcon, GavelIcon } from "lucide-react";

const RoleSelectPage = () => {
  const { push } = useRouter();

  const selectRole = (role: "user" | "lawyer") => {
    localStorage.setItem("selected_role", role);
    push(`/sign-up/${role}`)
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="w-full max-w-md md:max-w-2xl p-8 md:p-12 bg-white rounded-3xl shadow-2xl text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0930a5]">
          Бүртгэл үүсгэх
        </h1>
        <p className="text-gray-500 text-base md:text-lg">
          Та бүртгүүлэх төрлөө сонгоно уу
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
          <button
            onClick={() => selectRole("user")}
            className="bg-gray-100 hover:bg-blue-100 transition-all duration-300 rounded-xl shadow-md hover:shadow-xl p-6 md:p-8 flex flex-col items-center gap-2 w-full md:w-1/2 text-center"
          >
            <UserIcon className="w-8 h-8 text-blue-600" />
            <span className="font-medium text-gray-800">
              Хэрэглэгчээр бүртгүүлэх
            </span>
          </button>

          <button
            onClick={() => selectRole("lawyer")}
            className="bg-gray-100 hover:bg-purple-100 transition-all duration-300 rounded-xl shadow-md hover:shadow-xl p-6 md:p-8 flex flex-col items-center gap-2 w-full md:w-1/2 text-center"
          >
            <GavelIcon className="w-8 h-8 text-purple-700" />
            <span className="font-medium text-gray-800">
              Өмгөөлөгчөөр бүртгүүлэх
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectPage;
