import React from "react";

const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#003366] rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-[#003366] rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-slate-600 font-medium animate-pulse">
        Authenticating...
      </p>
    </div>
  </div>
);

export default LoadingSpinner;
