"use client";
import { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Button, Input, Textarea } from "@/components/ui";

const GET_AVAILABILITY = gql`
  query GetAvailability($lawyerId: String!) {
    getAvailability(lawyerId: $lawyerId) {
      day
      startTime
      endTime
      availableDays
    }
  }
`;

const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      lawyerId
      schedule
      status
      chatRoomId
    }
  }
`;

type BookAppointmentModalProps = {
  lawyerId: string;
  clientId: string;
  specializationId: string;
  onClose: () => void;
};

type AvailabilitySlot = {
  day: string;
  startTime: string;
  endTime: string;
  availableDays: string[];
};

export default function BookAppointmentModal({ lawyerId, clientId, specializationId, onClose }: BookAppointmentModalProps) {
  const { data, loading } = useQuery<{ getAvailability: AvailabilitySlot[] }>(GET_AVAILABILITY, { variables: { lawyerId } });
  const [createAppointment, { loading: creating }] = useMutation(CREATE_APPOINTMENT);

  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createAppointment({
        variables: {
          input: {
            clientId,
            lawyerId,
            specializationId,
            slot: { day: selectedDay, startTime, endTime },
            notes,
          },
        },
      });
      onClose();
    } catch (err) {
      setError("Захиалга үүсгэхэд алдаа гарлаа.");
      if (err instanceof Error) {
        setError(err.message);
      }
    } 
  };

  if (loading) return <div>Ачааллаж байна...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-2">Цаг захиалах</h2>
        <label className="block">
          Өдөр сонгох:
          <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} required className="w-full mt-1 p-2 border rounded">
            <option value="">Өдөр сонгох</option>
            {data?.getAvailability.map((slot, idx) => (
              <option key={idx} value={slot.day}>{slot.day}</option>
            ))}
          </select>
        </label>
        <Input
          type="time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          required
          placeholder="Эхлэх цаг"
        />
        <Input
          type="time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          required
          placeholder="Дуусах цаг"
        />
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Тэмдэглэл (заавал биш)"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end">
          <Button type="button" onClick={onClose} variant="outline">Болих</Button>
          <Button type="submit" disabled={creating}>Захиалах</Button>
        </div>
      </form>
    </div>
  );
} 