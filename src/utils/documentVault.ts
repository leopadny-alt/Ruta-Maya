export type DocumentCategory =
  | "Voli"
  | "Traghetti"
  | "Auto"
  | "Assicurazione"
  | "Documenti"
  | "Altro";

export type StoredDocument = {
  id: string;
  name: string;
  type: string;
  size: number;
  category: DocumentCategory;
  createdAt: string;
  data: Blob;
};

const DATABASE_NAME = "ruta-maya-document-vault";
const DATABASE_VERSION = 1;
const STORE_NAME = "documents";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DATABASE_NAME,
      DATABASE_VERSION,
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getStoredDocuments(): Promise<
  StoredDocument[]
> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      "readonly",
    );

    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const documents = request.result as StoredDocument[];

      resolve(
        documents.sort((firstDocument, secondDocument) =>
          secondDocument.createdAt.localeCompare(
            firstDocument.createdAt,
          ),
        ),
      );
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      database.close();
    };
  });
}

export async function saveDocument(
  file: File,
  category: DocumentCategory,
): Promise<StoredDocument> {
  const database = await openDatabase();

  const document: StoredDocument = {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    category,
    createdAt: new Date().toISOString(),
    data: file,
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      "readwrite",
    );

    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(document);

    request.onsuccess = () => {
      resolve(document);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      database.close();
    };
  });
}

export async function deleteStoredDocument(
  id: string,
): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      "readwrite",
    );

    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      database.close();
    };
  });
}

export async function clearStoredDocuments(): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      "readwrite",
    );

    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      database.close();
    };
  });
}