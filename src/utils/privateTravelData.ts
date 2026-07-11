export type PrivateTravelData = {
  bookingReferences: Record<number, string>;
};

const STORAGE_KEY = "ruta-maya-private-travel-data";

const emptyPrivateData: PrivateTravelData = {
  bookingReferences: {},
};

export function getPrivateTravelData(): PrivateTravelData {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return emptyPrivateData;
    }

    const parsedData = JSON.parse(
      savedData,
    ) as Partial<PrivateTravelData>;

    return {
      bookingReferences:
        parsedData.bookingReferences ?? {},
    };
  } catch {
    return emptyPrivateData;
  }
}

export function savePrivateTravelData(
  data: PrivateTravelData,
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data),
  );
}

export function getPrivateBookingReference(
  bookingId: number,
) {
  return (
    getPrivateTravelData().bookingReferences[
      bookingId
    ] ?? ""
  );
}

export function setPrivateBookingReference(
  bookingId: number,
  reference: string,
) {
  const currentData = getPrivateTravelData();

  savePrivateTravelData({
    ...currentData,
    bookingReferences: {
      ...currentData.bookingReferences,
      [bookingId]: reference.trim(),
    },
  });
}

export function clearPrivateBookingReference(
  bookingId: number,
) {
  const currentData = getPrivateTravelData();

  const updatedReferences = {
    ...currentData.bookingReferences,
  };

  delete updatedReferences[bookingId];

  savePrivateTravelData({
    ...currentData,
    bookingReferences: updatedReferences,
  });
}