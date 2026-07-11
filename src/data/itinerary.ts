export type TripDay = {
  day: number;
  date: string;
  title: string;
  overnight?: string;
  activities: string[];
};

export const itinerary: TripDay[] = [
  {
    day: 1,
    date: "06 agosto",
    title: "Arrivo e Isla Mujeres",
    overnight: "Isla Mujeres",
    activities: [
      "Arrivo all’aeroporto internazionale di Cancún",
      "Ritiro dell’auto a noleggio in aeroporto",
      "Trasferimento in auto al terminal di Puerto Juárez",
      "Parcheggio dell’auto vicino al terminal",
      "Traghetto Puerto Juárez → Isla Mujeres",
      "Check-in nell’alloggio e relax in spiaggia",
      "Cena informale sul mare",
    ],
  },
  {
    day: 2,
    date: "07 agosto",
    title: "Isla Mujeres",
    overnight: "Isla Mujeres",
    activities: [
      "MUSA – Museo Subacqueo e snorkeling",
      "Relax a Playa Norte",
      "Garrafón de Castilla oppure Punta Sur",
      "Cocktail e serata tranquilla",
    ],
  },
  {
    day: 3,
    date: "08 agosto",
    title: "Isla Mujeres → Tulum",
    overnight: "Tulum",
    activities: [
      "Check-out dall’alloggio di Isla Mujeres",
      "Traghetto Isla Mujeres → Puerto Juárez",
      "Recupero dell’auto dal parcheggio",
      "Sosta breve a Puerto Morelos",
      "Proseguimento in auto verso Tulum",
      "Arrivo e check-in nel pomeriggio",
      "Cena nel centro di Tulum",
    ],
  },
  {
    day: 4,
    date: "09 agosto",
    title: "Tulum → Valladolid",
    overnight: "Valladolid",
    activities: [
      "Visita alle rovine di Tulum al mattino presto",
      "Gran Cenote oppure Cenote Calavera",
      "Pranzo leggero",
      "Trasferimento in auto verso Valladolid",
      "Check-in e cena tipica yucateca",
    ],
  },
  {
    day: 5,
    date: "10 agosto",
    title: "Valladolid ed Ek’ Balam",
    overnight: "Valladolid",
    activities: [
      "Passeggiata nel centro storico di Valladolid",
      "Calzada de los Frailes",
      "Partenza in auto da Valladolid per Ek’ Balam",
      "Visita al sito archeologico di Ek’ Balam",
      "Rientro in auto a Valladolid",
      "Serata tranquilla in città",
    ],
  },
  {
    day: 6,
    date: "11 agosto",
    title: "Chichén Itzá → Mérida",
    overnight: "Mérida",
    activities: [
      "Check-out e partenza presto da Valladolid",
      "Visita a Chichén Itzá all’apertura",
      "Bagno al Cenote Yokdzonot",
      "Trasferimento in auto verso Mérida",
      "Check-in e passeggiata serale oppure piscina",
    ],
  },
  {
    day: 7,
    date: "12 agosto",
    title: "Uxmal e Kabah",
    overnight: "Mérida",
    activities: [
      "Partenza da Mérida verso Uxmal",
      "Visita al sito archeologico di Uxmal",
      "Sosta a Kabah lungo la Ruta Puuc",
      "Rientro in auto a Mérida",
      "Serata libera in città",
    ],
  },
  {
    day: 8,
    date: "13 agosto",
    title: "Mérida → Isla Holbox",
    overnight: "Isla Holbox",
    activities: [
      "Check-out e partenza presto da Mérida",
      "Arrivo a Chiquilá in auto",
      "Parcheggio dell’auto vicino al terminal",
      "Traghetto Chiquilá → Isla Holbox",
      "Check-in e relax al mare",
      "Kayak oppure passeggiata sull’isola",
      "Possibile escursione per la bioluminescenza",
    ],
  },
  {
    day: 9,
    date: "14 agosto",
    title: "Isla Holbox → Cancún",
    overnight: "Cancún",
    activities: [
      "Mattinata in spiaggia oppure Punta Mosquito",
      "Check-out dall’alloggio di Isla Holbox",
      "Traghetto Isla Holbox → Chiquilá",
      "Recupero dell’auto dal parcheggio",
      "Trasferimento in auto verso Cancún",
      "Arrivo e check-in nell’alloggio",
      "Ultima cena del viaggio",
    ],
  },
  {
    day: 10,
    date: "15 agosto",
    title: "Rientro",
    activities: [
      "Check-out dall’alloggio di Cancún",
      "Trasferimento in auto verso l’aeroporto",
      "Riconsegna dell’auto a noleggio in aeroporto",
      "Trasferimento al terminal partenze",
      "Volo di ritorno",
    ],
  },
];