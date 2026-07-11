export const TRAVELERS = [
  "Leonardo",
  "Eva",
  "Stefano",
  "Valentina",
  "Maristella",
] as const;

export type TravelerName = (typeof TRAVELERS)[number];

const STORAGE_KEY = "ruta-maya-traveler-profile";

export function getTravelerProfile(): TravelerName | "" {
  const savedTraveler = localStorage.getItem(STORAGE_KEY);

  if (
    savedTraveler &&
    TRAVELERS.includes(savedTraveler as TravelerName)
  ) {
    return savedTraveler as TravelerName;
  }

  return "";
}

export function saveTravelerProfile(
  traveler: TravelerName,
) {
  localStorage.setItem(STORAGE_KEY, traveler);
}

export function clearTravelerProfile() {
  localStorage.removeItem(STORAGE_KEY);
}