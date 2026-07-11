export type ChecklistCategory =
  | "Documenti"
  | "Tecnologia"
  | "Bagaglio"
  | "Auto"
  | "Prenotazioni";

export type ChecklistItem = {
  id: string;
  category: ChecklistCategory;
  title: string;
  note?: string;
  important?: boolean;
};

export const travelChecklist: ChecklistItem[] = [
  {
    id: "passport",
    category: "Documenti",
    title: "Passaporto",
    note: "Controllare di averlo nel bagaglio a mano.",
    important: true,
  },
  {
    id: "esta",
    category: "Documenti",
    title: "ESTA per gli Stati Uniti",
    note: "Necessario per il transito o ingresso negli USA.",
    important: true,
  },
  {
    id: "travel-insurance",
    category: "Documenti",
    title: "Assicurazione di viaggio",
    note: "Salvare anche una copia offline dei documenti.",
  },
  {
    id: "documents-vault",
    category: "Documenti",
    title: "Documenti nella Cassaforte",
    note: "Controllare che i documenti personali siano disponibili offline.",
  },

  {
    id: "esim",
    category: "Tecnologia",
    title: "eSIM o roaming per il Messico",
    note: "Installarla prima della partenza.",
  },
  {
    id: "offline-maps",
    category: "Tecnologia",
    title: "Scaricare le mappe offline",
    note: "Cancún, Quintana Roo e Yucatán.",
    important: true,
  },
  {
    id: "powerbank",
    category: "Tecnologia",
    title: "Power bank carica",
  },
  {
    id: "charger",
    category: "Tecnologia",
    title: "Caricabatterie e cavi",
  },
  {
    id: "adapter",
    category: "Tecnologia",
    title: "Adattatore prese USA/Messico",
  },
  {
    id: "ruta-maya-installed",
    category: "Tecnologia",
    title: "Ruta Maya installata",
    note: "Aprire l'app e verificare la modalità offline.",
    important: true,
  },

  {
    id: "medicines",
    category: "Bagaglio",
    title: "Farmaci personali",
  },
  {
    id: "sunscreen",
    category: "Bagaglio",
    title: "Protezione solare",
  },
  {
    id: "mosquito",
    category: "Bagaglio",
    title: "Repellente per zanzare",
  },
  {
    id: "swimsuit",
    category: "Bagaglio",
    title: "Costume nel bagaglio a mano",
    note: "Utile in caso di ritardo del bagaglio.",
  },
  {
    id: "water-shoes",
    category: "Bagaglio",
    title: "Scarpe da acqua",
    note: "Utili per cenote e alcune escursioni.",
  },

  {
    id: "driving-license",
    category: "Auto",
    title: "Patente del guidatore",
    important: true,
  },
  {
    id: "credit-card-driver",
    category: "Auto",
    title: "Carta di credito del guidatore",
    note: "Controllare intestatario e disponibilità del plafond.",
    important: true,
  },
  {
    id: "car-booking",
    category: "Auto",
    title: "Prenotazione Localiza disponibile offline",
    important: true,
  },
  {
    id: "car-insurance",
    category: "Auto",
    title: "Documenti assicurazione auto",
  },
  {
    id: "car-photos",
    category: "Auto",
    title: "Ricordarsi foto e video dell'auto al ritiro",
    note: "Carrozzeria, vetri, cerchi e livello carburante.",
  },

  {
    id: "xcaret-voucher",
    category: "Prenotazioni",
    title: "Voucher Xcaret disponibili",
    note: "Da convertire al botteghino.",
    important: true,
  },
  {
    id: "holbox-print",
    category: "Prenotazioni",
    title: "Voucher Holbox stampato",
    note: "Portare una copia cartacea.",
    important: true,
  },
  {
    id: "airbnb-offline",
    category: "Prenotazioni",
    title: "Indirizzi degli alloggi salvati",
    note: "Controllare soprattutto le istruzioni di check-in.",
  },
  {
    id: "flight-documents",
    category: "Prenotazioni",
    title: "Biglietti aerei disponibili offline",
    important: true,
  },
];