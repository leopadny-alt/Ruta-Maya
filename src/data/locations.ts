export type MapLocationType =
  | "city"
  | "beach"
  | "ruins"
  | "cenote"
  | "ferry"
  | "accommodation"
  | "restaurant";

export type MapLocation = {
  id: number;
  name: string;
  type: MapLocationType;
  latitude: number;
  longitude: number;
  description: string;
  externalUrl?: string;
  details?: string;
};

export const locations: MapLocation[] = [
  {
    id: 1,
    name: "Cancún",
    type: "city",
    latitude: 21.1619,
    longitude: -86.8515,
    description: "Arrivo, ritiro auto e ultima notte.",
    details: "Giorni 1, 3, 9 e 10",
  },
  {
    id: 2,
    name: "Isla Mujeres",
    type: "beach",
    latitude: 21.2322,
    longitude: -86.734,
    description: "Playa Norte, MUSA, Punta Sur e mare.",
    details: "Giorni 1 e 2",
  },
  {
    id: 3,
    name: "Puerto Morelos",
    type: "city",
    latitude: 20.8475,
    longitude: -86.8756,
    description: "Sosta durante il trasferimento verso Tulum.",
    details: "Giorno 3",
  },
  {
    id: 4,
    name: "Tulum",
    type: "ruins",
    latitude: 20.2114,
    longitude: -87.4654,
    description: "Rovine sul mare e centro di Tulum.",
    details: "Giorni 3 e 4",
  },
  {
    id: 5,
    name: "Gran Cenote",
    type: "cenote",
    latitude: 20.2461,
    longitude: -87.4649,
    description: "Una delle possibili soste dopo le rovine di Tulum.",
    details: "Giorno 4",
  },
  {
    id: 6,
    name: "Valladolid",
    type: "city",
    latitude: 20.6896,
    longitude: -88.2012,
    description: "Centro storico e Calzada de los Frailes.",
    details: "Giorni 4, 5 e 6",
  },
  {
    id: 7,
    name: "Ek’ Balam",
    type: "ruins",
    latitude: 20.8927,
    longitude: -88.1358,
    description: "Sito archeologico con piramide visitabile.",
    details: "Giorno 5",
  },
  {
    id: 8,
    name: "Chichén Itzá",
    type: "ruins",
    latitude: 20.6843,
    longitude: -88.5678,
    description: "Visita prevista all’apertura.",
    details: "Giorno 6",
  },
  {
    id: 9,
    name: "Cenote Yokdzonot",
    type: "cenote",
    latitude: 20.709,
    longitude: -88.728,
    description: "Bagno dopo la visita a Chichén Itzá.",
    details: "Giorno 6",
  },
  {
    id: 10,
    name: "Mérida",
    type: "city",
    latitude: 20.9674,
    longitude: -89.5926,
    description: "Base per visitare Mérida, Uxmal e Kabah.",
    details: "Giorni 6, 7 e 8",
  },
  {
    id: 11,
    name: "Uxmal",
    type: "ruins",
    latitude: 20.3596,
    longitude: -89.771,
    description: "Principale sito archeologico della Ruta Puuc.",
    details: "Giorno 7",
  },
  {
    id: 12,
    name: "Kabah",
    type: "ruins",
    latitude: 20.2488,
    longitude: -89.6472,
    description: "Seconda tappa archeologica della Ruta Puuc.",
    details: "Giorno 7",
  },
  {
    id: 13,
    name: "Chiquilá",
    type: "ferry",
    latitude: 21.4325,
    longitude: -87.3359,
    description: "Terminal dei traghetti per Isla Holbox.",
    details: "Giorni 8 e 9",
  },
  {
    id: 14,
    name: "Isla Holbox",
    type: "beach",
    latitude: 21.521,
    longitude: -87.377,
    description: "Mare, kayak, Punta Mosquito e bioluminescenza.",
    details: "Giorni 8 e 9",
  },
];