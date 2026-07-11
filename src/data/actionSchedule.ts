export type ActionType =
  | "confirmed"
  | "suggested"
  | "reminder";

export type TripAction = {
  id: string;
  dateTime: string;
  endDateTime?: string;
  title: string;
  description: string;
  icon: string;
  type: ActionType;
  travelers?: string[];
  mapsQuery?: string;
};

const allTravelers = [
  "Leonardo",
  "Eva",
  "Stefano",
  "Valentina",
  "Maristella",
];

export const actionSchedule: TripAction[] = [
  {
    id: "day-1-flight-arrival",
    dateTime: "2026-08-06T13:05:00",
    endDateTime: "2026-08-06T14:00:00",
    title: "Arrivo a Cancún",
    description:
      "Recuperate il bagaglio e dirigetevi verso l’area autonoleggi.",
    icon: "✈️",
    type: "confirmed",
    travelers: allTravelers,
    mapsQuery: "Cancun International Airport",
  },
  {
    id: "day-1-car-pickup",
    dateTime: "2026-08-06T16:00:00",
    endDateTime: "2026-08-06T16:45:00",
    title: "Ritiro dell’auto",
    description:
      "Localiza, Aeroporto di Cancún. Maristella deve avere patente, passaporto e carta di credito fisica.",
    icon: "🚗",
    type: "confirmed",
    travelers: allTravelers,
    mapsQuery: "Localiza Cancun International Airport",
  },
  {
    id: "day-1-xcaret-terminal",
    dateTime: "2026-08-06T18:30:00",
    endDateTime: "2026-08-06T19:00:00",
    title: "Presentatevi al terminal Xcaret",
    description:
      "Convertite il voucher Bookaway al botteghino prima dell’imbarco.",
    icon: "🎫",
    type: "confirmed",
    travelers: allTravelers,
    mapsQuery:
      "Embarcadero Isla Mujeres by Xcaret Zona Hotelera Cancun",
  },
  {
    id: "day-1-ferry",
    dateTime: "2026-08-06T19:00:00",
    endDateTime: "2026-08-06T19:20:00",
    title: "Traghetto per Isla Mujeres",
    description:
      "Xcaret Ferry dalla Zona Hotelera di Cancún.",
    icon: "⛴️",
    type: "confirmed",
    travelers: allTravelers,
  },

  {
    id: "day-2-musa",
    dateTime: "2026-08-07T09:00:00",
    endDateTime: "2026-08-07T12:00:00",
    title: "MUSA e snorkeling",
    description:
      "Mattinata suggerita per il Museo Subacqueo.",
    icon: "🤿",
    type: "suggested",
    travelers: allTravelers,
  },
  {
    id: "day-2-playa-norte",
    dateTime: "2026-08-07T13:00:00",
    endDateTime: "2026-08-07T17:00:00",
    title: "Relax a Playa Norte",
    description:
      "Pomeriggio libero in spiaggia.",
    icon: "🏖️",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Playa Norte Isla Mujeres",
  },
  {
    id: "day-2-evening",
    dateTime: "2026-08-07T19:30:00",
    endDateTime: "2026-08-07T22:30:00",
    title: "Cena e serata sull’isola",
    description:
      "Cocktail e musica tranquilla.",
    icon: "🍹",
    type: "suggested",
    travelers: allTravelers,
  },

  {
    id: "day-3-ferry-checkin",
    dateTime: "2026-08-08T10:30:00",
    endDateTime: "2026-08-08T11:00:00",
    title: "Presentatevi al terminal Xcaret",
    description:
      "Preparate voucher e documenti per il traghetto di ritorno.",
    icon: "🎫",
    type: "confirmed",
    travelers: allTravelers,
    mapsQuery: "Xcaret Xailing Ferry Isla Mujeres",
  },
  {
    id: "day-3-ferry",
    dateTime: "2026-08-08T11:00:00",
    endDateTime: "2026-08-08T11:20:00",
    title: "Traghetto per Cancún",
    description:
      "Dopo lo sbarco recuperate l’auto dal parcheggio.",
    icon: "⛴️",
    type: "confirmed",
    travelers: allTravelers,
  },
  {
    id: "day-3-puerto-morelos",
    dateTime: "2026-08-08T13:00:00",
    endDateTime: "2026-08-08T14:30:00",
    title: "Sosta a Puerto Morelos",
    description:
      "Pausa suggerita durante il trasferimento verso Tulum.",
    icon: "📍",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Puerto Morelos Quintana Roo",
  },
  {
    id: "day-3-tulum",
    dateTime: "2026-08-08T16:30:00",
    endDateTime: "2026-08-08T19:00:00",
    title: "Arrivo e check-in a Tulum",
    description:
      "Sistematevi nell’alloggio e riposatevi prima di cena.",
    icon: "🏨",
    type: "suggested",
    travelers: allTravelers,
  },

  {
    id: "day-4-ruins",
    dateTime: "2026-08-09T08:00:00",
    endDateTime: "2026-08-09T10:30:00",
    title: "Rovine di Tulum",
    description:
      "Partite presto per evitare caldo e affollamento.",
    icon: "🏛️",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Tulum archaeological zone",
  },
  {
    id: "day-4-cenote",
    dateTime: "2026-08-09T11:00:00",
    endDateTime: "2026-08-09T13:00:00",
    title: "Cenote",
    description:
      "Gran Cenote oppure Cenote Calavera.",
    icon: "💧",
    type: "suggested",
    travelers: allTravelers,
  },
  {
    id: "day-4-valladolid",
    dateTime: "2026-08-09T15:00:00",
    endDateTime: "2026-08-09T17:00:00",
    title: "Partenza per Valladolid",
    description:
      "Controllate carburante e percorso prima di partire.",
    icon: "🚗",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Tulum to Valladolid Yucatan",
  },

  {
    id: "day-5-valladolid",
    dateTime: "2026-08-10T09:00:00",
    endDateTime: "2026-08-10T11:30:00",
    title: "Centro di Valladolid",
    description:
      "Centro storico e Calzada de los Frailes.",
    icon: "🌇",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Calzada de los Frailes Valladolid",
  },
  {
    id: "day-5-ek-balam",
    dateTime: "2026-08-10T13:00:00",
    endDateTime: "2026-08-10T17:00:00",
    title: "Ek’ Balam",
    description:
      "Escursione pomeridiana con rientro a Valladolid.",
    icon: "🏛️",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Ek Balam archaeological zone",
  },

  {
    id: "day-6-chichen",
    dateTime: "2026-08-11T08:00:00",
    endDateTime: "2026-08-11T11:00:00",
    title: "Chichén Itzá",
    description:
      "Arrivate vicino all’orario di apertura.",
    icon: "🏛️",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Chichen Itza",
  },
  {
    id: "day-6-yokdzonot",
    dateTime: "2026-08-11T11:30:00",
    endDateTime: "2026-08-11T14:00:00",
    title: "Cenote Yokdzonot",
    description:
      "Bagno e pausa prima di proseguire verso Mérida.",
    icon: "💧",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Cenote Yokdzonot",
  },
  {
    id: "day-6-merida",
    dateTime: "2026-08-11T15:00:00",
    endDateTime: "2026-08-11T17:30:00",
    title: "Trasferimento a Mérida",
    description:
      "Controllate carburante e navigazione.",
    icon: "🚗",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Cenote Yokdzonot to Merida",
  },

  {
    id: "day-7-uxmal",
    dateTime: "2026-08-12T08:30:00",
    endDateTime: "2026-08-12T11:30:00",
    title: "Visita a Uxmal",
    description:
      "Prima tappa della Ruta Puuc.",
    icon: "🏛️",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Uxmal archaeological zone",
  },
  {
    id: "day-7-kabah",
    dateTime: "2026-08-12T12:00:00",
    endDateTime: "2026-08-12T14:00:00",
    title: "Sosta a Kabah",
    description:
      "Seconda tappa prima del rientro a Mérida.",
    icon: "🏛️",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Kabah archaeological zone",
  },

  {
    id: "day-8-departure",
    dateTime: "2026-08-13T09:00:00",
    endDateTime: "2026-08-13T13:30:00",
    title: "Partenza per Chiquilá",
    description:
      "Viaggio lungo: controllate carburante e fate una pausa.",
    icon: "🚗",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Merida to Chiquila ferry terminal",
  },
  {
    id: "day-8-ferry-checkin",
    dateTime: "2026-08-13T15:00:00",
    endDateTime: "2026-08-13T15:30:00",
    title: "Presentatevi al porto",
    description:
      "Portate il voucher Holbox Express stampato.",
    icon: "🎫",
    type: "confirmed",
    travelers: allTravelers,
    mapsQuery: "Puerto de Chiquila",
  },
  {
    id: "day-8-ferry",
    dateTime: "2026-08-13T15:30:00",
    endDateTime: "2026-08-13T15:50:00",
    title: "Traghetto per Holbox",
    description:
      "Holbox Express.",
    icon: "⛴️",
    type: "confirmed",
    travelers: allTravelers,
  },

  {
    id: "day-9-beach",
    dateTime: "2026-08-14T09:00:00",
    endDateTime: "2026-08-14T13:00:00",
    title: "Spiaggia o Punta Mosquito",
    description:
      "Mattinata libera prima del viaggio verso Cancún.",
    icon: "🏖️",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Punta Mosquito Holbox",
  },
  {
    id: "day-9-ferry-checkin",
    dateTime: "2026-08-14T18:00:00",
    endDateTime: "2026-08-14T18:30:00",
    title: "Presentatevi al molo",
    description:
      "Tenete pronto il voucher Holbox Express.",
    icon: "🎫",
    type: "confirmed",
    travelers: allTravelers,
    mapsQuery: "Muelle de Holbox",
  },
  {
    id: "day-9-ferry",
    dateTime: "2026-08-14T18:30:00",
    endDateTime: "2026-08-14T18:50:00",
    title: "Traghetto per Chiquilá",
    description:
      "Dopo lo sbarco recuperate l’auto.",
    icon: "⛴️",
    type: "confirmed",
    travelers: allTravelers,
  },
  {
    id: "day-9-cancun",
    dateTime: "2026-08-14T19:00:00",
    endDateTime: "2026-08-14T21:30:00",
    title: "Trasferimento verso Cancún",
    description:
      "Guida serale verso l’alloggio dell’ultima notte.",
    icon: "🚗",
    type: "suggested",
    travelers: allTravelers,
    mapsQuery: "Chiquila to Cancun",
  },

  {
    id: "day-10-car-return",
    dateTime: "2026-08-15T08:00:00",
    endDateTime: "2026-08-15T09:00:00",
    title: "Riconsegna dell’auto",
    description:
      "Fate rifornimento e fotografate l’auto prima della consegna.",
    icon: "🚗",
    type: "confirmed",
    travelers: allTravelers,
    mapsQuery: "Localiza Cancun International Airport",
  },
  {
    id: "day-10-flight-group-1",
    dateTime: "2026-08-15T14:07:00",
    endDateTime: "2026-08-15T17:02:00",
    title: "Volo Cancún → Miami",
    description:
      "BA1793, operato da American Airlines.",
    icon: "✈️",
    type: "confirmed",
    travelers: ["Leonardo", "Eva", "Stefano"],
  },
  {
    id: "day-10-flight-group-2",
    dateTime: "2026-08-15T16:30:00",
    endDateTime: "2026-08-15T19:29:00",
    title: "Volo Cancún → Miami",
    description:
      "BA1837, operato da American Airlines.",
    icon: "✈️",
    type: "confirmed",
    travelers: ["Valentina", "Maristella"],
  },
];