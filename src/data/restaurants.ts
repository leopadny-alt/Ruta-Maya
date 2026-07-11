export type Restaurant = {
  id: number;
  city: string;
  name: string;
  category: string;
  price: "€" | "€€" | "€€€";
  description: string;
  recommendedFor: string;
  mapsQuery: string;
  latitude: number;
  longitude: number;
};

export const restaurants: Restaurant[] = [
  {
    id: 1,
    city: "Isla Mujeres",
    name: "Mango Café",
    category: "Colazione e brunch",
    price: "€€",
    description:
      "Locale informale per colazioni abbondanti e piatti messicani.",
    recommendedFor: "Colazione prima del mare",
    mapsQuery: "Mango Cafe Isla Mujeres Mexico",
    latitude: 21.2246,
    longitude: -86.7355,
  },
  {
    id: 2,
    city: "Isla Mujeres",
    name: "Fish & Gin",
    category: "Pesce e cocktail",
    price: "€€",
    description: "Pesce, ceviche e cocktail in centro.",
    recommendedFor: "Cena easy",
    mapsQuery: "Fish and Gin Isla Mujeres Mexico",
    latitude: 21.258,
    longitude: -86.746,
  },
  {
    id: 3,
    city: "Tulum",
    name: "Taquería Honorio",
    category: "Tacos tradizionali",
    price: "€",
    description:
      "Tacos, cochinita e lechón in un ambiente semplice.",
    recommendedFor: "Pranzo economico",
    mapsQuery: "Taqueria Honorio Tulum Mexico",
    latitude: 20.2134,
    longitude: -87.4659,
  },
  {
    id: 4,
    city: "Tulum",
    name: "Arca",
    category: "Cucina contemporanea",
    price: "€€€",
    description:
      "Cucina contemporanea con ingredienti locali.",
    recommendedFor: "Cena speciale",
    mapsQuery: "Arca Tulum Mexico",
    latitude: 20.1579,
    longitude: -87.4551,
  },
  {
    id: 5,
    city: "Valladolid",
    name: "El Atrio del Mayab",
    category: "Cucina yucateca",
    price: "€€",
    description:
      "Piatti regionali in un cortile vicino alla piazza.",
    recommendedFor: "Cena tipica",
    mapsQuery: "El Atrio del Mayab Valladolid Yucatan",
    latitude: 20.6897,
    longitude: -88.202,
  },
  {
    id: 6,
    city: "Valladolid",
    name: "El Mesón del Marqués",
    category: "Cucina messicana",
    price: "€€",
    description:
      "Piatti tradizionali in un’atmosfera coloniale.",
    recommendedFor: "Cena comoda in centro",
    mapsQuery: "El Meson del Marques Valladolid Yucatan",
    latitude: 20.6901,
    longitude: -88.2022,
  },
  {
    id: 7,
    city: "Mérida",
    name: "Manjar Blanco",
    category: "Cucina tradizionale",
    price: "€€",
    description:
      "Specialità yucateche, tra cui cochinita pibil.",
    recommendedFor: "Pranzo tipico",
    mapsQuery: "Manjar Blanco Merida Yucatan",
    latitude: 20.9766,
    longitude: -89.6192,
  },
  {
    id: 8,
    city: "Mérida",
    name: "Huniik",
    category: "Fine dining yucateco",
    price: "€€€",
    description:
      "Percorso gastronomico contemporaneo dedicato allo Yucatán.",
    recommendedFor: "Esperienza speciale",
    mapsQuery: "Huniik Merida Yucatan",
    latitude: 20.988,
    longitude: -89.618,
  },
  {
    id: 9,
    city: "Isla Holbox",
    name: "Luuma",
    category: "Tapas e cocktail",
    price: "€€",
    description: "Piccoli piatti, pesce e cocktail.",
    recommendedFor: "Cena e drink",
    mapsQuery: "Luuma Holbox Mexico",
    latitude: 21.5225,
    longitude: -87.3774,
  },
  {
    id: 10,
    city: "Isla Holbox",
    name: "Mandarina Beach Club",
    category: "Beach club",
    price: "€€",
    description:
      "Locale fronte mare adatto a pranzo e tramonto.",
    recommendedFor: "Pranzo sulla spiaggia",
    mapsQuery: "Mandarina Beach Club Holbox Mexico",
    latitude: 21.523,
    longitude: -87.381,
  },
  {
    id: 11,
    city: "Cancún",
    name: "El Fish Fritanga",
    category: "Pesce messicano",
    price: "€€",
    description:
      "Pesce, tacos e piatti di mare in ambiente informale.",
    recommendedFor: "Ultima cena casual",
    mapsQuery: "El Fish Fritanga Cancun Mexico",
    latitude: 21.1263,
    longitude: -86.7594,
  },
  {
    id: 12,
    city: "Cancún",
    name: "Puerto Santo",
    category: "Pesce e frutti di mare",
    price: "€€",
    description:
      "Ristorante di pesce dall’atmosfera rilassata.",
    recommendedFor: "Cena di gruppo",
    mapsQuery: "Puerto Santo Cancun Mexico",
    latitude: 21.1875,
    longitude: -86.808,
  },
];