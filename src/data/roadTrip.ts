export type RoadTripLeg = {
  id: number;
  day: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  transport: "Auto" | "Traghetto" | "Auto + traghetto";
  notes: string;
  mapsQuery: string;
};

export const roadTrip: RoadTripLeg[] = [
  {
    id: 1,
    day: "06 agosto",
    from: "Aeroporto di Cancún",
    to: "Puerto Juárez",
    distance: "Circa 25 km",
    duration: "Circa 30–45 min",
    transport: "Auto",
    notes:
      "Ritiro dell’auto in aeroporto e trasferimento al parcheggio vicino al terminal dei traghetti.",
    mapsQuery:
      "Cancun International Airport to Puerto Juarez ferry terminal",
  },
  {
    id: 2,
    day: "06 agosto",
    from: "Puerto Juárez",
    to: "Isla Mujeres",
    distance: "Tragitto marittimo",
    duration: "Circa 20–30 min",
    transport: "Traghetto",
    notes:
      "L’auto resta parcheggiata a Puerto Juárez durante il soggiorno sull’isola.",
    mapsQuery:
      "Puerto Juarez ferry terminal Isla Mujeres",
  },
  {
    id: 3,
    day: "08 agosto",
    from: "Isla Mujeres",
    to: "Puerto Juárez",
    distance: "Tragitto marittimo",
    duration: "Circa 20–30 min",
    transport: "Traghetto",
    notes:
      "Dopo l’arrivo, recuperare l’auto dal parcheggio.",
    mapsQuery:
      "Isla Mujeres ferry terminal to Puerto Juarez",
  },
  {
    id: 4,
    day: "08 agosto",
    from: "Puerto Juárez",
    to: "Tulum",
    distance: "Circa 140 km",
    duration: "Circa 2 h 15",
    transport: "Auto",
    notes:
      "Sosta breve prevista a Puerto Morelos lungo il percorso.",
    mapsQuery:
      "Puerto Juarez to Tulum via Puerto Morelos",
  },
  {
    id: 5,
    day: "09 agosto",
    from: "Tulum",
    to: "Valladolid",
    distance: "Circa 105 km",
    duration: "Circa 1 h 30",
    transport: "Auto",
    notes:
      "Partenza dopo la visita alle rovine e al cenote scelto.",
    mapsQuery:
      "Tulum to Valladolid Yucatan",
  },
  {
    id: 6,
    day: "10 agosto",
    from: "Valladolid",
    to: "Ek’ Balam",
    distance: "Circa 30 km per tratta",
    duration: "Circa 35 min per tratta",
    transport: "Auto",
    notes:
      "Escursione di andata e ritorno con rientro a Valladolid.",
    mapsQuery:
      "Valladolid to Ek Balam archaeological zone",
  },
  {
    id: 7,
    day: "11 agosto",
    from: "Valladolid",
    to: "Chichén Itzá",
    distance: "Circa 45 km",
    duration: "Circa 45 min",
    transport: "Auto",
    notes:
      "Partenza presto per arrivare vicino all’orario di apertura.",
    mapsQuery:
      "Valladolid to Chichen Itza",
  },
  {
    id: 8,
    day: "11 agosto",
    from: "Chichén Itzá",
    to: "Mérida",
    distance: "Circa 125 km",
    duration: "Circa 1 h 45",
    transport: "Auto",
    notes:
      "Sosta prevista al Cenote Yokdzonot prima di proseguire verso Mérida.",
    mapsQuery:
      "Chichen Itza to Cenote Yokdzonot to Merida",
  },
  {
    id: 9,
    day: "12 agosto",
    from: "Mérida",
    to: "Uxmal e Kabah",
    distance: "Circa 190 km complessivi",
    duration: "Circa 3 h complessive",
    transport: "Auto",
    notes:
      "Escursione giornaliera lungo la Ruta Puuc con rientro a Mérida.",
    mapsQuery:
      "Merida to Uxmal to Kabah to Merida",
  },
  {
    id: 10,
    day: "13 agosto",
    from: "Mérida",
    to: "Chiquilá",
    distance: "Circa 300 km",
    duration: "Circa 4 h",
    transport: "Auto",
    notes:
      "Partenza presto e parcheggio dell’auto vicino al terminal di Chiquilá.",
    mapsQuery:
      "Merida to Chiquila ferry terminal",
  },
  {
    id: 11,
    day: "13 agosto",
    from: "Chiquilá",
    to: "Isla Holbox",
    distance: "Tragitto marittimo",
    duration: "Circa 25 min",
    transport: "Traghetto",
    notes:
      "Controllare gli orari e acquistare il biglietto prima dell’imbarco.",
    mapsQuery:
      "Chiquila ferry terminal to Holbox",
  },
  {
    id: 12,
    day: "14 agosto",
    from: "Isla Holbox",
    to: "Chiquilá",
    distance: "Tragitto marittimo",
    duration: "Circa 25 min",
    transport: "Traghetto",
    notes:
      "Dopo lo sbarco, recuperare l’auto dal parcheggio.",
    mapsQuery:
      "Holbox ferry terminal to Chiquila",
  },
  {
    id: 13,
    day: "14 agosto",
    from: "Chiquilá",
    to: "Cancún",
    distance: "Circa 140 km",
    duration: "Circa 2 h 15",
    transport: "Auto",
    notes:
      "Trasferimento verso l’alloggio dell’ultima notte a Cancún.",
    mapsQuery:
      "Chiquila to Cancun",
  },
  {
    id: 14,
    day: "15 agosto",
    from: "Cancún",
    to: "Aeroporto di Cancún",
    distance: "Da definire in base all’alloggio",
    duration: "Da verificare",
    transport: "Auto",
    notes:
      "Prevedere il tempo necessario per rifornimento, riconsegna dell’auto e trasferimento al terminal.",
    mapsQuery:
      "Cancun to Cancun International Airport",
  },
];