"use client";

import { Users, Clock8, Shield } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useQuery } from "@apollo/client";
import { GET_ALL_LAWYERS_QUERY } from "@/graphql/lawyer";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Lawyer {
  clientId: string;
  firstName: string;
  lastName: string;
}

interface GetLawyersData {
  getLawyers: Lawyer[];
}

const HeroSection = () => {
  const { data } = useQuery<GetLawyersData>(GET_ALL_LAWYERS_QUERY);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (data?.getLawyers && searchTerm.trim() !== "") {
      const filtered = data.getLawyers.filter((lawyer) =>
        (lawyer.firstName + " " + lawyer.lastName).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLawyers(filtered);
    } else {
      setFilteredLawyers([]);
    }
  }, [searchTerm, data]);

  return (
    <header
      className="
      relative
      w-full
      min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] 
      p-6 sm:p-8 md:p-10 lg:p-12
      bg-gradient-to-t from-[#1453b4] to-[#003366] 
      flex flex-col items-center justify-center
      space-y-6 sm:space-y-8 md:space-y-10 
      text-center text-[#f8f8f8]
    "
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-6 sm:mt-8 md:mt-10 leading-tight">
          Монголын хууль зүйн шийдлүүдэд хүрэх таны гүүр.
        </h1>
        {/* <h2 className="mt-3 sm:mt-4 md:mt-5 text-base sm:text-lg md:text-xl lg:text-3xl font-semibold leading-relaxed">
          LawBridge нь хууль зүйн туслалцаа хайж буй хувь хүмүүсийг чадварлаг хуульчидтай холбож, хялбар цаг товлох болон үнэ цэнэтэй
          мэдээлэл өгдөг.
        </h2> */}
      </div>

      <div className="w-full max-w-xl space-y-4 sm:space-y-5 mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-10 md:mb-12 px-4 sm:px-0">
        {/* <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => push("/find-lawyers")}
            className="w-full sm:w-auto bg-[#D4AF37] text-[#333333] text-base sm:text-lg md:text-2xl p-4 sm:p-5 md:p-6 hover:cursor-pointer hover:opacity-85"
          >
            Өмгөөлөгчдийг харах
          </Button>
          <Button className="w-full sm:w-auto bg-[#f8f8f8] text-[#0a2342] text-base sm:text-lg md:text-2xl p-4 sm:p-5 md:p-6 hover:cursor-pointer hover:opacity-85">
            Хууль зүйн туслалцаа авах
          </Button>
        </div> */}

        <div className="relative w-full">
          <Input
            placeholder="Хууль зүйн талбар эсвэл өмгөөлөгч хайх"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            className="w-full bg-[#eee] text-[#333333] p-5 md:p-6 pr-16 md:pr-32 text-base sm:text-lg rounded-md"
          />
          <Button className="absolute top-1/2 -translate-y-1/2 right-1 sm:right-2 text-[#f8f8f8] bg-[#003366] text-lg sm:text-lg px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:cursor-pointer hover:opacity-85">
            Хайх
          </Button>
          {isFocused && searchTerm && (
            <div
              className="absolute left-0 z-10 mt-2 w-full max-w-xl text-black shadow-md rounded-md max-h-60 overflow-y-auto bg-white"
              style={{
                textAlign: "left",

                opacity: 0.9,
                backdropFilter: "blur(10px)",
              }}
            >
              {filteredLawyers.length > 0 ? (
                filteredLawyers.map((lawyer) => (
                  <Link
                    href={`/lawyer/${lawyer.clientId}`}
                    key={lawyer.clientId}
                    className="block px-4 py-2 border-b border-gray-200 text-left text-gray-800 opacity-50  transition-all duration-200"
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "1.125rem",
                    }}
                  >
                    {lawyer.firstName} {lawyer.lastName}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 font-inter">Тохирох өмгөөлөгч олдсонгүй.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 text-base sm:text-lg md:text-xl lg:text-2xl text-[#f8f8f8] mx-4 sm:mx-8 md:mx-16 lg:mx-20 max-w-5xl pb-6 sm:pb-8 md:pb-10">
        <div className="flex flex-col items-center p-4">
          <Shield className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-3 sm:mb-4 opacity-80" />
          <h3 className="font-semibold text-lg sm:text-xl md:text-3xl">Аюулгүй байдал</h3>
          <p className="opacity-70 text-sm sm:text-[16px]] mt-2">Хэрэглэгчийн итгэл даасан, эрх зүйн орчин</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <Clock8 className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-3 sm:mb-4 opacity-80" />
          <h3 className="font-semibold text-lg sm:text-xl md:text-3xl">24/7 Идэвхитэй</h3>
          <p className="opacity-70 text-sm sm:text-[16px] mt-2">Өдөр, шөнө үл хамааран хуулийн туслалцаа хүртээрэй</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-3 sm:mb-4 opacity-80" />
          <h3 className="font-semibold text-lg sm:text-xl md:text-3xl">Мэргэжилтнүүд</h3>
          <p className="opacity-70 text-sm sm:text-[16px]] mt-2">Хүссэн хуулийн мэргэжилтнүүдтэйгээ холбогдоорой</p>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
