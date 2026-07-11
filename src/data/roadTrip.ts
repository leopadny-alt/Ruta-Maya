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
    to: "Embarcadero Xcaret",
    distance: "Circa 25 km",
    duration: "Circa 30–45 min",
    transport: "Auto",
    notes:
      "Ritiro dell’auto alle 16:00 e trasferimento all’Embarcadero Isla Mujeres by Xcaret, km 4.5 della Zona Hotelera. Cercare un parcheggio vicino al terminal.",
    mapsQuery:
      "Cancun International Airport to Embarcadero Isla Mujeres by Xcaret km 4.5 Zona Hotelera",
  },
  {
    id: 2,
    day: "06 agosto",
    from: "Zona Hotelera di Cancún",
    to: "Isla Mujeres",
    distance: "Tragitto marittimo",
    duration: "20 min",
    transport: "Traghetto",
    notes:
      "Xcaret Ferry alle 19:00. Presentarsi entro le 18:30 e convertire il voucher Bookaway al botteghino.",
    mapsQuery:
      "Embarcadero Isla Mujeres by Xcaret Zona Hotelera Cancun",
  },
  {
    id: 3,
    day: "08 agosto",
    from: "Isla Mujeres",
    to: "Zona Hotelera di Cancún",
    distance: "Tragitto marittimo",
    duration: "20 min",
    transport: "Traghetto",
    notes:
      "Xcaret Ferry alle 11:00. Presentarsi entro le 10:30. Dopo l’arrivo, recuperare l’auto dal parcheggio.",
    mapsQuery:
      "Xcaret Xailing Ferry Isla Mujeres",
  },
  {
    id: 4,
    day: "08 agosto",
    from: "Zona Hotelera di Cancún",
    to: "Tulum",
    distance: "Circa 135 km",
    duration: "Circa 2 h 15",
    transport: "Auto",
    notes:
      "Partenza dopo aver recuperato l’auto. Sosta breve prevista a Puerto Morelos.",
    mapsQuery:
      "Embarcadero Isla Mujeres by Xcaret Cancun to Puerto Morelos to Tulum",
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
    duration: "20 min",
    transport: "Traghetto",
    notes:
      "Holbox Express alle 15:30. Presentarsi entro le 15:00 e portare il voucher stampato.",
    mapsQuery:
      "Chiquila ferry terminal to Holbox",
  },
  {
    id: 12,
    day: "14 agosto",
    from: "Isla Holbox",
    to: "Chiquilá",
    distance: "Tragitto marittimo",
    duration: "20 min",
    transport: "Traghetto",
    notes:
      "Holbox Express alle 18:30. Presentarsi entro le 18:00. Dopo lo sbarco, recuperare l’auto.",
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
      "Trasferimento serale verso l’alloggio dell’ultima notte a Cancún.",
    mapsQuery:
      "Chiquila to Cancun",
  },
  {
    id: 14,
    day: "15 agosto",
    from: "Cancún",
    to: "Aeroporto di Cancún",
    distance: "Da verificare in base all’alloggio",
    duration: "Da verificare",
    transport: "Auto",
    notes:
      "Arrivare a Localiza per la riconsegna fissata alle 08:00. Fare rifornimento prima e fotografare il veicolo alla restituzione.",
    mapsQuery:
      "Cancun to Localiza Cancun International Airport",
  },
];