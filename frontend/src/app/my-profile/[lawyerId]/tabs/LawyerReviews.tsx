"use client";

interface Review {
  client: string;
  rating: number;
  comment: string;
  date: string;
}

export const LawyerReviews = () => {
  // Fake review data
  const reviews: Review[] = [
    {
      client: "А. Батболд",
      rating: 5,
      comment: "Маш туршлагатай, үр дүнтэй зөвлөгөө өгсөн.",
      date: "2025-07-01",
    },
    {
      client: "С. Энхжин",
      rating: 4,
      comment: "Хурдан хариу өгсөн. Сэтгэл хангалуун байна.",
      date: "2025-06-28",
    },
  ];

  const totalClients = 22; // simulate number of unique clients

  // Badge logic
  let badge = "";
  let nextLevel = "";
  const current = totalClients;
  let max = 50;

  if (totalClients >= 50) {
    badge = "🏆 Elite Lawyer";
    max = 50;
  } else if (totalClients >= 20) {
    badge = "🥈 Pro Lawyer";
    nextLevel = "Elite Lawyer";
    max = 50;
  } else if (totalClients >= 10) {
    badge = "🥉 Good Lawyer";
    nextLevel = "Pro Lawyer";
    max = 20;
  } else {
    badge = "🔰 Шинэ өмгөөлөгч";
    nextLevel = "Good Lawyer";
    max = 10;
  }

  const progressPercent = Math.min((current / max) * 100, 100);

  return (
    <div className="sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pt-4">
      <div className=" rounded-2xl p-4 sm:p-6 lg:p-8  border border-gray-100">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Амжилтын түвшин</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Нийт <span className="font-bold text-[#003366]">{totalClients}</span> захиалагч
            </p>
          </div>

          <div className="inline-flex items-center bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-lg sm:text-2xl font-bold text-[#003366]">{badge}</span>
          </div>

          {nextLevel && (
            <div className="text-sm sm:text-base text-gray-600">
              Дараагийн түвшин: <span className="font-semibold text-[#003366]">{nextLevel}</span>
            </div>
          )}

          <div className="max-w-xs sm:max-w-md mx-auto">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>{current}</span>
              <span>{max}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div className="bg-[#003366] h-2 sm:h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Үйлчлүүлэгчдийн сэтгэгдэл</h2>

        <div className="grid gap-3 sm:gap-4">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-2 sm:p-6 shadow-none sm:shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-[#003366] font-medium text-sm sm:text-base">{review.client.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{review.client}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center ml-11 sm:ml-0">
                  {[...Array(5)].map((_, starIndex) => (
                    <span
                      key={starIndex}
                      className={`text-base sm:text-lg ${starIndex < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
