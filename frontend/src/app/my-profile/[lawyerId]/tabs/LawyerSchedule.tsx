"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";

const GET_AVAILABILITY = gql`
  query GetAvailability($lawyerId: String!) {
    getAvailability(lawyerId: $lawyerId) {
      availableDays {
        day
        startTime
        endTime
        booked
      }
    }
  }
`;

const SET_AVAILABILITY = gql`
  mutation SetAvailability($input: SetAvailabilityInput!) {
    setAvailability(input: $input) {
      _id
      lawyerId
      availableDays {
        day
        startTime
        endTime
        booked
      }
    }
  }
`;

const UPDATE_AVAILABILITY = gql`
  mutation UpdateAvailabilityDate($input: UpdateAvailabilityDateInput!) {
    updateAvailabilityDate(input: $input) {
      _id
      lawyerId
      availableDays {
        day
        startTime
        endTime
        booked
      }
    }
  }
`;

type Availability = Record<string, string[]>;

interface LawyerScheduleProps {
  lawyerId: string;
}

interface UpdateFormState {
  oldDay: string;
  oldStart: string;
  oldEnd: string;
  newDay: string;
  newStart: string;
  newEnd: string;
}

const generateHourlySlots = (startHour = 0, endHour = 24): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const timeString = `${hour.toString().padStart(2, "0")}:00`;
    slots.push(timeString);
  }
  return slots;
};

// const formatDate = (date: Date) => {
//   return date.toLocaleDateString("mn-MN", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     weekday: "long",
//   });
// };

const addMinutesToTime = (time: string, minutes: number): string => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(0, 0, 0, h, m + minutes);
  return date.toTimeString().slice(0, 5);
};

export default function LawyerSchedule({ lawyerId }: LawyerScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<Availability>({});
  const [isLoading, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [notification, setNotification] = useState("");

  // Fetch existing availability
  const { loading: loadingAvailability } = useQuery(GET_AVAILABILITY, {
    variables: { lawyerId },
    onCompleted: (data) => {
      if (data?.getAvailability?.[0]?.availableDays) {
        const savedAvailability: Availability = {};
        data.getAvailability[0].availableDays.forEach((slot: any) => {
          if (!savedAvailability[slot.day]) {
            savedAvailability[slot.day] = [];
          }
          savedAvailability[slot.day].push(slot.startTime);
        });
        setAvailability(savedAvailability);
      }
    },
  });

  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    oldDay: "",
    oldStart: "",
    oldEnd: "",
    newDay: "",
    newStart: "",
    newEnd: "",
  });

  const [setAvailabilityMutation] = useMutation(SET_AVAILABILITY, {
    refetchQueries: [{ query: GET_AVAILABILITY, variables: { lawyerId } }],
  });
  const [updateAvailabilityDate] = useMutation(UPDATE_AVAILABILITY, {
    refetchQueries: [{ query: GET_AVAILABILITY, variables: { lawyerId } }],
  });

  const selectedDateKey = selectedDate.toISOString().split("T")[0];
  const selectedTimeSlots = availability[selectedDateKey] || [];
  const timeSlots = generateHourlySlots();

  useEffect(() => {
    const now = new Date();
    const cutoff = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );
    const weekLater = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 7
    );

    setAvailability((currentAvailability) => {
      const newAvailability = Object.entries(currentAvailability).reduce(
        (acc: Availability, [dateKey, slots]) => {
          const dateObj = new Date(dateKey);
          if (dateObj >= cutoff && dateObj <= weekLater) {
            acc[dateKey] = slots;
          }
          return acc;
        },
        {}
      );
      return newAvailability;
    });
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const toggleTimeSlot = (time: string) => {
    setAvailability((prev) => {
      const current = prev[selectedDateKey] || [];
      const updated = current.includes(time)
        ? current.filter((t) => t !== time)
        : [...current, time].sort();
      return {
        ...prev,
        [selectedDateKey]: updated,
      };
    });
  };

  const removeTimeSlot = async (dateKey: string, time: string) => {
    try {
      setDeleting(true);

      // Remove the slot from local state first
      const updatedAvailability = { ...availability };
      if (updatedAvailability[dateKey]) {
        updatedAvailability[dateKey] = updatedAvailability[dateKey].filter(
          (t) => t !== time
        );
        if (updatedAvailability[dateKey].length === 0) {
          delete updatedAvailability[dateKey];
        }
      }

      // Convert updated availability to the format expected by setAvailability
      const availableDays = Object.entries(updatedAvailability).flatMap(
        ([date, slots]) =>
          slots.map((startTime) => ({
            day: date,
            startTime,
            endTime: addMinutesToTime(startTime, 30),
          }))
      );

      // Update database with new availability (without the deleted slot)
      await setAvailabilityMutation({
        variables: { input: { availableDays } },
      });

      // Update local state after successful database update
      setAvailability(updatedAvailability);

      showNotification("Цаг амжилттай устгагдлаа! ✅");
    } catch (error) {
      showNotification("Цаг устгахад алдаа гарлаа. Дахин оролдоно уу.");
      if (error instanceof Error) {
        console.error("Delete slot error:", error.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      const availableDays = Object.entries(availability).flatMap(
        ([dateKey, slots]) =>
          slots.map((startTime) => ({
            day: dateKey,
            startTime,
            endTime: addMinutesToTime(startTime, 30),
          }))
      );

      if (availableDays.length === 0) {
        showNotification("Хадгалах цаг сонгоно уу");
        setSaving(false);
        return;
      }

      await setAvailabilityMutation({
        variables: { input: { availableDays } },
      });
      showNotification("Хуваарь амжилттай хадгалагдлаа! ✅");
    } catch (error) {
      showNotification("Алдаа гарлаа. Дахин оролдоно уу.");
      if (error instanceof Error) {
        showNotification(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAvailabilityDate({
        variables: {
          input: {
            lawyerId,
            oldDay: updateForm.oldDay,
            oldStartTime: updateForm.oldStart,
            oldEndTime: updateForm.oldEnd,
            newDay: updateForm.newDay,
            newStartTime: updateForm.newStart,
            newEndTime: updateForm.newEnd,
          },
        },
      });

      setUpdateForm({
        oldDay: "",
        oldStart: "",
        oldEnd: "",
        newDay: "",
        newStart: "",
        newEnd: "",
      });
      setShowUpdateForm(false);
      showNotification("Хуваарь амжилттай шинэчлэгдлээ! ✅");
    } catch (error) {
      showNotification("Алдаа гарлаа. Дахин оролдоно уу.");
      if (error instanceof Error) {
        showNotification(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const clearAllSlots = () => {
    setAvailability({});
    showNotification("Бүх цаг арилгагдлаа");
  };

  const addQuickSlots = (startHour: number, endHour: number) => {
    const slots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < endHour - 1 || endHour % 1 !== 0) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }

    setAvailability((prev) => ({
      ...prev,
      [selectedDateKey]: [
        ...new Set([...(prev[selectedDateKey] || []), ...slots]),
      ].sort(),
    }));
    showNotification(`${startHour}:00-${endHour}:00 цагууд нэмэгдлээ`);
  };

  const now = new Date();
  // const maxDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (loadingAvailability) {
    return (
      <div className="py-4 px-2 sm:p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Хуваарь ачааллаж байна...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-2 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          {notification}
        </div>
      )}

      <div>
        <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-100 shadow-none sm:shadow-sm p-0 sm:p-4 mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Өдөр сонгох
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                7 хоногийн хуваарь
              </p>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-3">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(now);
                date.setDate(now.getDate() + i);
                const dateKey = date.toISOString().split("T")[0];
                const isSelected = dateKey === selectedDateKey;
                const hasSlots = availability[dateKey]?.length > 0;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`relative p-2 sm:p-4 rounded-lg sm:rounded-xl text-center transition-all duration-200 border-2 hover:scale-105 ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm sm:text-lg font-bold">
                      {date.getDate()}
                    </div>
                    <div className="text-xs opacity-70 hidden sm:block">
                      {date.toLocaleDateString("mn-MN", { weekday: "short" })}
                    </div>
                    {hasSlots && (
                      <div
                        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          isSelected ? "bg-yellow-400" : "bg-emerald-500"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-100 shadow-none sm:shadow-sm p-0   sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Цаг сонгох
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Боломжит цагаа сонгоно уу
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addQuickSlots(9, 12)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-50 text-blue-700 rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors font-medium border border-blue-200"
              >
                Өглөө (9-12)
              </button>
              <button
                onClick={() => addQuickSlots(13, 17)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-orange-50 text-orange-700 rounded-lg sm:rounded-xl hover:bg-orange-100 transition-colors font-medium border border-orange-200"
              >
                Үдээс хойш (13-17)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => toggleTimeSlot(time)}
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border-2 hover:scale-105 text-center ${
                  selectedTimeSlots.includes(time)
                    ? "bg-[#003366] text-white border-[#003366] shadow-lg"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold">{time}</div>
                <div className="text-xs opacity-70 hidden sm:block">
                  {addMinutesToTime(time, 60)}
                </div>
              </button>
            ))}
          </div>

          <div>
            {selectedTimeSlots.length > 0 ? (
              <div></div>
            ) : (
              <div className="text-center bg-blue-50 border border-gray-100 rounded-xl p-3 sm:p-5 mb-4 sm:mb-6">
                <p className="text-gray-500 font-medium text-sm sm:text-base">
                  Цаг сонгоно уу
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Дээрх цагнуудаас сонгож болно
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={saveAvailability}
              disabled={isLoading || selectedTimeSlots.length === 0}
              className="flex-1 bg-[#003366] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Хадгалж байна...
                </>
              ) : (
                <>Хадгалах ({selectedTimeSlots.length} цаг)</>
              )}
            </button>

            <button
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Засах
            </button>

            {Object.keys(availability).length > 0 && (
              <button
                onClick={clearAllSlots}
                className="px-4 sm:px-6 py-2.5 sm:py-4 bg-red-50 text-red-700 border border-red-200 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                Арилгах
              </button>
            )}
          </div>
        </div>
      </div>

      {showUpdateForm && (
        <div className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-100 shadow-none sm:shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#003366] rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">EDIT</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Хуваарь шинэчлэх
              </h3>
              <p className="text-sm text-gray-500">
                Хуучин цагийг шинэ цагаар солино
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Хуучин мэдээлэл</h4>
              <input
                type="date"
                value={updateForm.oldDay}
                onChange={(e) =>
                  setUpdateForm((prev) => ({ ...prev, oldDay: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={updateForm.oldStart}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      oldStart: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={updateForm.oldEnd}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      oldEnd: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Шинэ мэдээлэл</h4>
              <input
                type="date"
                value={updateForm.newDay}
                onChange={(e) =>
                  setUpdateForm((prev) => ({ ...prev, newDay: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={updateForm.newStart}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      newStart: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={updateForm.newEnd}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      newEnd: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpdateAvailability}
              disabled={isLoading}
              className="bg-[#003366] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#004080] disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Шинэчилж байна...
                </>
              ) : (
                "Шинэчлэх"
              )}
            </button>
            <button
              onClick={() => setShowUpdateForm(false)}
              className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Болих
            </button>
          </div>
        </div>
      )}

      {Object.keys(availability).length > 0 && (
        <div className="grid gap-4">
          {Object.entries(availability).map(([dateKey, slots]) => (
            <div
              key={dateKey}
              className="bg-gray-100 border border-emerald-100 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {new Date(dateKey).toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    </h4>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  {slots.length} цаг
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {slots.map((slot) => (
                  <div
                    key={slot}
                    className={`relative bg-white border border-emerald-200 rounded-lg px-3 py-2 text-center group hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer ${
                      isDeleting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => !isDeleting && removeTimeSlot(dateKey, slot)}
                  >
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-red-700">
                      {slot}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-red-500">
                      {addMinutesToTime(slot, 60)}
                    </div>

                    {/* X button that appears on hover */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold hover:bg-red-600">
                      ×
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
