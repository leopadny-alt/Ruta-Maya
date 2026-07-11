export type Accommodation = {
  id: number;
  location: string;
  nights: string;
  dates: string;
  url: string;
  icon: string;
  latitude: number;
  longitude: number;
  description: string;
};

export const accommodations: Accommodation[] = [
  {
    id: 1,
    location: "Isla Mujeres",
    dates: "06–08 agosto",
    nights: "2 notti",
    icon: "🏝️",
    latitude: 21.2322,
    longitude: -86.734,
    description:
      "Airbnb a Isla Mujeres. Posizione provvisoria nel centro dell'isola.",
    url: "https://www.airbnb.it/rooms/1066828255591889536?unique_share_id=8ff27e5d-8744-404a-87e2-d6a0fe767ea4&viralityEntryPoint=1&s=76",
  },

  {
    id: 2,
    location: "Tulum",
    dates: "08–09 agosto",
    nights: "1 notte",
    icon: "🌴",
    latitude: 20.2114,
    longitude: -87.4654,
    description:
      "Airbnb a Tulum. Posizione provvisoria nel centro della città.",
    url: "https://www.airbnb.it/rooms/1465397279291789700?unique_share_id=3ccb2fa8-4f89-429d-8c36-bbd450366d3d&viralityEntryPoint=1&s=76",
  },

  {
    id: 3,
    location: "Valladolid",
    dates: "09–11 agosto",
    nights: "2 notti",
    icon: "🏛️",
    latitude: 20.6896,
    longitude: -88.2012,
    description:
      "Airbnb a Valladolid. Posizione provvisoria nel centro storico.",
    url: "https://www.airbnb.it/rooms/596664512433499981?unique_share_id=cdfa5b30-5c36-41e1-95e1-6f74f91aa812&viralityEntryPoint=1&s=76",
  },

  {
    id: 4,
    location: "Mérida",
    dates: "11–13 agosto",
    nights: "2 notti",
    icon: "🌇",
    latitude: 20.9674,
    longitude: -89.5926,
    description:
      "Airbnb a Mérida. Posizione provvisoria nel centro città.",
    url: "https://www.airbnb.it/rooms/25109712?unique_share_id=88a007fc-7bc0-4d18-a379-0615ab6f6631&viralityEntryPoint=1&s=76",
  },

  {
    id: 5,
    location: "Isla Holbox",
    dates: "13–14 agosto",
    nights: "1 notte",
    icon: "🌊",
    latitude: 21.521,
    longitude: -87.377,
    description:
      "Airbnb a Holbox. Posizione provvisoria nel centro dell'isola.",
    url: "https://www.airbnb.it/rooms/1000660547373743231?unique_share_id=23f4ad70-1894-4725-ad75-856819217f5e&viralityEntryPoint=1&s=76",
  },

  {
    id: 6,
    location: "Cancún",
    dates: "14–15 agosto",
    nights: "1 notte",
    icon: "🌃",
    latitude: 21.1619,
    longitude: -86.8515,
    description:
      "Airbnb a Cancún. Posizione provvisoria nel centro città.",
    url: "https://www.airbnb.it/rooms/548497231669834995?unique_share_id=40e4e33e-c231-46ee-a76e-98125e491caf&viralityEntryPoint=1&s=76",
  },
];