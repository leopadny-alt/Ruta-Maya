export type BookingCategory =
  | "flight"
  | "ferry"
  | "car"
  | "insurance";

export type Booking = {
  id: number;
  category: BookingCategory;
  title: string;
  date: string;
  travelers: string[];
  details: string[];
  alert?: string;
};

export const bookings: Booking[] = [
  {
    id: 1,
    category: "flight",
    title: "New York → Cancún",
    date: "06 agosto 2026",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
    details: [
      "JetBlue Airways",
      "JFK 09:59 → CUN 13:05",
      "Volo diretto · durata 5 h 06 min",
      "Bagaglio piccolo e trolley inclusi",
      "Bagaglio da stiva non incluso",
      "Check-in disponibile dal 05 agosto",
    ],
    alert:
      "La compagnia ha già modificato l’orario. Controllarlo nuovamente prima della partenza.",
  },
  {
    id: 2,
    category: "ferry",
    title: "Cancún → Isla Mujeres",
    date: "06 agosto 2026",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
    details: [
      "Xcaret Ferry",
      "19:00 → 19:20",
      "Partenza dalla Zona Hotelera, km 4.5",
      "5 passeggeri",
      "Presentarsi almeno 30 minuti prima",
    ],
    alert:
      "Convertire il voucher Bookaway nel biglietto dell’operatore al botteghino.",
  },
  {
    id: 3,
    category: "ferry",
    title: "Isla Mujeres → Cancún",
    date: "08 agosto 2026",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
    details: [
      "Xcaret Ferry",
      "11:00 → 11:20",
      "5 passeggeri",
      "Presentarsi almeno 30 minuti prima",
      "Biglietto open: in caso di ritardo è possibile prendere la partenza successiva disponibile",
    ],
  },
  {
    id: 4,
    category: "car",
    title: "Noleggio auto",
    date: "06–15 agosto 2026",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
    details: [
      "Localiza",
      "Dodge Journey o SUV simile",
      "Automatico · 5 posti",
      "Ritiro: 06 agosto ore 16:00 – Aeroporto di Cancún",
      "Restituzione: 15 agosto ore 08:00 – Aeroporto di Cancún",
      "Chilometraggio illimitato",
      "Carburante pieno → pieno",
      "Deposito: 11.700 MXN, circa 575 €",
      "Conducente principale: Maristella Nava",
      "Numeri Localiza: +52 800 077 0800 · +52 55 8880 8064",
    ],
    alert:
      "Serve una carta di credito fisica intestata a Maristella. Carte di debito, virtuali e carte di banche solo online non sono accettate.",
  },
  {
    id: 5,
    category: "insurance",
    title: "Assicurazione auto",
    date: "06–15 agosto 2026",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
    details: [
      "Sincera Full Coverage",
      "Validità: 06 agosto ore 16:00 → 15 agosto ore 08:00",
      "Copertura combinata fino a 3.000 €",
      "Carrozzeria, tetto e sottoscocca",
      "Vetri, specchietti, lampade e pneumatici",
      "Chiavi, traino, taxi e rifornimento errato",
      "Conducenti aggiuntivi coperti se registrati nel contratto",
    ],
    alert:
      "Fare foto e video completi al ritiro e alla restituzione. Conservare contratto, report delle condizioni, ricevute e prove dei pagamenti.",
  },
  {
    id: 6,
    category: "ferry",
    title: "Chiquilá → Isla Holbox",
    date: "13 agosto 2026",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
    details: [
      "Holbox Express",
      "15:30 → 15:50",
      "5 passeggeri",
      "Presentarsi almeno 30 minuti prima",
    ],
    alert:
      "Stampare il voucher Bookaway. È prevista una tassa ecologica di 20 MXN a persona.",
  },
  {
    id: 7,
    category: "ferry",
    title: "Isla Holbox → Chiquilá",
    date: "14 agosto 2026",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
      "Valentina",
      "Maristella",
    ],
    details: [
      "Holbox Express",
      "18:30 → 18:50",
      "5 passeggeri",
      "Presentarsi almeno 30 minuti prima",
    ],
    alert:
      "Stampare il voucher Bookaway prima del viaggio.",
  },
  {
    id: 8,
    category: "flight",
    title: "Cancún → Miami → Milano",
    date: "15–16 agosto 2026",
    travelers: [
      "Leonardo",
      "Eva",
      "Stefano",
    ],
    details: [
      "CUN 14:07 → MIA 17:02",
      "BA1793 · operato da American Airlines",
      "Scalo a Miami: 2 h 58 min",
      "MIA 20:00 → MXP 11:30 +1",
      "BA1614 · operato da American Airlines",
      "Bagaglio piccolo e trolley inclusi",
      "Bagaglio da stiva non incluso",
      "Check-in disponibile dal 14 agosto",
    ],
  },
  {
    id: 9,
    category: "flight",
    title:
      "Cancún → Miami → Londra → Milano",
    date: "15–16 agosto 2026",
    travelers: [
      "Valentina",
      "Maristella",
    ],
    details: [
      "CUN 16:30 → MIA 19:29",
      "BA1837 · operato da American Airlines",
      "Scalo a Miami: 3 h 11 min",
      "MIA 22:40 → LHR 12:35 +1",
      "BA0208 · British Airways",
      "Scalo a Londra: 1 h 30 min",
      "LHR 14:05 → MXP 17:15 +1",
      "BA0586 · British Airways",
    ],
    alert:
      "A Londra lo scalo dura 1 h 30 min: verificare immediatamente il gate del volo per Milano.",
  },
];