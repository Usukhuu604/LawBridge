import React from "react";
import { Scale } from "lucide-react";

const WelcomeScreen = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 bg-white">
    <div className="text-center max-w-4xl w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-[#003366] to-[#004080] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Scale className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#003366] mb-4 font-playfair-display">
          <span className="bg-gradient-to-r from-[#003366] to-[#004080] bg-clip-text text-transparent">
            LawBridge
          </span>{" "}
          -д тавтай морилно уу
        </h1>
        <p className="text-xl sm:text-2xl text-[#003366]/80 font-medium">
          Таны мэргэжлийн хууль зүйн AI туслах
        </p>
      </div>

      {/* Important Information Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">!</span>
          </div>
          <h3 className="text-lg font-bold text-amber-800">Чухал мэдээлэл</h3>
        </div>
        <p className="text-sm text-amber-800 leading-relaxed">
          Энэ нь зөвхөн мэдээллийн зориулалттай бөгөөд хууль зүйн зөвлөгөө биш
          юм. Тодорхой хууль зүйн асуудлын талаар мэргэжлийн өмгөөлөгчтэй
          зөвлөлдөх хэрэгтэй.
        </p>
      </div>

      {/* Start Section */}
      <div className="bg-white border border-[#003366]/20 rounded-2xl p-6 shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-[#003366] mb-4 text-center">
          Эхлэх
        </h3>
        <p className="text-base text-[#003366]/70 mb-4 text-center">
          Хууль зүйн ойлголт, журам, ерөнхий хууль зүйн асуултуудын талаар
          асууна уу. Би танд дараах зүйлсэд тусалж чадна:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#003366]/80">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-[#003366] rounded-full mr-3 flex-shrink-0"></div>
            Хууль зүйн нэр томъёоны тайлбар
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-[#003366] rounded-full mr-3 flex-shrink-0"></div>
            Ерөнхий хууль зүйн журам
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default WelcomeScreen;
