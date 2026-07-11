export type ScheduledBooking = {
  id: string;
  bookingId: number;
  dateTime: string;
  endDateTime?: string;
  title: string;
  subtitle: string;
  icon: string;
  travelers: string[];
};

export const bookingSchedule: ScheduledBooking[] = [
  {
    id: "car-pickup",
    bookingId: 4,
    dateTime: "2026-08-06T16:00:00",
    title: "Ritiro auto",
    subtitle: "Localiza · Aeroporto di Cancún",
    icon: "🚗",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
  },
  {
    id: "ferry-isla-out",
    bookingId: 2,
    dateTime: "2026-08-06T19:00:00",
    endDateTime: "2026-08-06T19:20:00",
    title: "Traghetto per Isla Mujeres",
    subtitle: "Xcaret Ferry · Zona Hotelera km 4.5 · presentarsi alle 18:30",,
    icon: "⛴️",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
  },
  {
    id: "ferry-isla-return",
    bookingId: 3,
    dateTime: "2026-08-08T11:00:00",
    endDateTime: "2026-08-08T11:20:00",
    title: "Traghetto per Cancún",
    subtitle: "Xcaret Ferry · arrivo nella Zona Hotelera · presentarsi alle 10:30",
    icon: "⛴️",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
  },
  {
    id: "ferry-holbox-out",
    bookingId: 6,
    dateTime: "2026-08-13T15:30:00",
    endDateTime: "2026-08-13T15:50:00",
    title: "Traghetto per Holbox",
    subtitle: "Holbox Express · presentarsi alle 15:00",
    icon: "⛴️",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
  },
  {
    id: "ferry-holbox-return",
    bookingId: 7,
    dateTime: "2026-08-14T18:30:00",
    endDateTime: "2026-08-14T18:50:00",
    title: "Traghetto per Chiquilá",
    subtitle: "Holbox Express · presentarsi alle 18:00",
    icon: "⛴️",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
  },
  {
    id: "car-return",
    bookingId: 4,
    dateTime: "2026-08-15T08:00:00",
    title: "Riconsegna auto",
    subtitle: "Localiza · Aeroporto di Cancún",
    icon: "🚗",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
  },
  {
    id: "flight-return-group-1",
    bookingId: 8,
    dateTime: "2026-08-15T14:07:00",
    title: "Volo Cancún → Miami",
    subtitle: "Leonardo, Eva e Stefano · BA1793",
    icon: "✈️",
    travelers: ["Leonardo", "Eva", "Stefano"],
  },
  {
    id: "flight-return-group-2",
    bookingId: 9,
    dateTime: "2026-08-15T16:30:00",
    title: "Volo Cancún → Miami",
    subtitle: "Valentina e Maristella · BA1837",
    icon: "✈️",
    travelers: ["Valentina", "Maristella"],
  },
];