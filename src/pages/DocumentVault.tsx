import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  clearStoredDocuments,
  deleteStoredDocument,
  getStoredDocuments,
  saveDocument,
  type DocumentCategory,
  type StoredDocument,
} from "../utils/documentVault";
import { theme } from "../styles/theme";

const categories: DocumentCategory[] = [
  "Voli",
  "Traghetti",
  "Auto",
  "Assicurazione",
  "Documenti",
  "Altro",
];

const categoryIcons: Record<DocumentCategory, string> = {
  Voli: "✈️",
  Traghetti: "⛴️",
  Auto: "🚗",
  Assicurazione: "🛡️",
  Documenti: "🪪",
  Altro: "📄",
};

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentVault() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<
    StoredDocument[]
  >([]);

  const [selectedCategory, setSelectedCategory] =
    useState<DocumentCategory>("Voli");

  const [filterCategory, setFilterCategory] = useState<
    DocumentCategory | "Tutti"
  >("Tutti");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setLoading(true);

    try {
      const storedDocuments =
        await getStoredDocuments();

      setDocuments(storedDocuments);
    } catch {
      setMessage(
        "Non è stato possibile leggere i documenti salvati.",
      );
    } finally {
      setLoading(false);
    }
  }

  const visibleDocuments = useMemo(() => {
    if (filterCategory === "Tutti") {
      return documents;
    }

    return documents.filter(
      (document) =>
        document.category === filterCategory,
    );
  }, [documents, filterCategory]);

  const totalSize = documents.reduce(
    (total, document) => total + document.size,
    0,
  );

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? [],
    );

    event.target.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE,
    );

    if (oversizedFiles.length > 0) {
      alert(
        "Ogni file deve avere una dimensione inferiore a 20 MB.",
      );
      return;
    }

    try {
      for (const file of selectedFiles) {
        await saveDocument(file, selectedCategory);
      }

      setMessage(
        selectedFiles.length === 1
          ? "Documento salvato sul dispositivo."
          : `${selectedFiles.length} documenti salvati sul dispositivo.`,
      );

      await loadDocuments();

      window.setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch {
      setMessage(
        "Non è stato possibile salvare uno o più documenti.",
      );
    }
  }

  function openDocument(document: StoredDocument) {
    const url = URL.createObjectURL(document.data);

    const openedWindow = window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );

    if (!openedWindow) {
      const link = window.document.createElement("a");

      link.href = url;
      link.download = document.name;

      window.document.body.appendChild(link);
      link.click();
      link.remove();
    }

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  }

  function downloadDocument(document: StoredDocument) {
    const url = URL.createObjectURL(document.data);
    const link = window.document.createElement("a");

    link.href = url;
    link.download = document.name;

    window.document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  async function removeDocument(document: StoredDocument) {
    const confirmed = window.confirm(
      `Vuoi eliminare “${document.name}” dal dispositivo?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStoredDocument(document.id);

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (currentDocument) =>
            currentDocument.id !== document.id,
        ),
      );
    } catch {
      alert(
        "Non è stato possibile eliminare il documento.",
      );
    }
  }

  async function removeAllDocuments() {
    if (documents.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Vuoi eliminare tutti i documenti salvati nella cassaforte?",
    );

    if (!confirmed) {
      return;
    }

    const secondConfirmation = window.confirm(
      "I documenti non sono inclusi nel backup JSON. Confermi l’eliminazione?",
    );

    if (!secondConfirmation) {
      return;
    }

    try {
      await clearStoredDocuments();
      setDocuments([]);
    } catch {
      alert(
        "Non è stato possibile eliminare i documenti.",
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "28px 20px 112px",
        background: `linear-gradient(180deg, ${theme.colors.background}, ${theme.colors.backgroundGradient})`,
        color: theme.colors.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <p
        style={{
          margin: 0,
          color: theme.colors.primary,
          fontSize: 13,
          fontWeight: 850,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        Archivio offline
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Cassaforte documenti
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Conserva voucher, biglietti e documenti direttamente sul
        dispositivo.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 11,
          marginTop: 23,
        }}
      >
        <SummaryCard
          icon="📄"
          value={documents.length.toString()}
          label="documenti"
        />

        <SummaryCard
          icon="💾"
          value={formatFileSize(totalSize)}
          label="spazio utilizzato"
        />
      </section>

      {message && (
        <div
          style={{
            marginTop: 15,
            padding: 14,
            borderRadius: 16,
            background: "rgba(17,197,191,0.16)",
            border:
              "1px solid rgba(17,197,191,0.28)",
            color: theme.colors.primary,
            textAlign: "center",
            fontWeight: 750,
            lineHeight: 1.45,
          }}
        >
          {message}
        </div>
      )}

      <section
        style={{
          marginTop: 20,
          padding: 19,
          borderRadius: 22,
          background: theme.colors.card,
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: 750,
          }}
        >
          Categoria del documento

          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value as DocumentCategory,
              )
            }
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginTop: 9,
              padding: "13px 14px",
              border:
                "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              outline: "none",
              background: "rgba(7,26,46,0.72)",
              color: theme.colors.text,
              fontSize: 16,
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryIcons[category]} {category}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={openFilePicker}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 15,
            border: 0,
            borderRadius: 17,
            background: theme.colors.primary,
            color: theme.colors.background,
            fontWeight: 850,
            cursor: "pointer",
          }}
        >
          + Aggiungi PDF o immagine
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf,image/*"
          multiple
          onChange={handleFileSelection}
          style={{ display: "none" }}
        />
      </section>

      <div
        style={{
          display: "flex",
          gap: 9,
          marginTop: 20,
          paddingBottom: 5,
          overflowX: "auto",
        }}
      >
        {(["Tutti", ...categories] as const).map(
          (category) => {
            const isActive =
              filterCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setFilterCategory(category)
                }
                style={{
                  flexShrink: 0,
                  padding: "10px 14px",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 999,
                  background: isActive
                    ? theme.colors.primary
                    : theme.colors.card,
                  color: isActive
                    ? theme.colors.background
                    : theme.colors.text,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {category === "Tutti"
                  ? "✨"
                  : categoryIcons[category]}{" "}
                {category}
              </button>
            );
          },
        )}
      </div>

      <section
        style={{
          display: "grid",
          gap: 12,
          marginTop: 18,
        }}
      >
        {loading ? (
          <EmptyCard text="Caricamento dei documenti…" />
        ) : visibleDocuments.length === 0 ? (
          <EmptyCard text="Non ci sono documenti in questa categoria." />
        ) : (
          visibleDocuments.map((document) => (
            <article
              key={document.id}
              style={{
                padding: 17,
                borderRadius: 21,
                background: theme.colors.card,
                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 13,
                }}
              >
                <span
                  style={{
                    width: 47,
                    height: 47,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 15,
                    background:
                      "rgba(17,197,191,0.14)",
                    fontSize: 22,
                  }}
                >
                  {categoryIcons[document.category]}
                </span>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: 15,
                    }}
                  >
                    {document.name}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 5,
                      color: theme.colors.textSoft,
                      fontSize: 12,
                    }}
                  >
                    {document.category} ·{" "}
                    {formatFileSize(document.size)}
                  </span>

                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      color: theme.colors.textSoft,
                      fontSize: 11,
                    }}
                  >
                    Salvato il{" "}
                    {new Date(
                      document.createdAt,
                    ).toLocaleDateString("it-IT")}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 9,
                  marginTop: 15,
                }}
              >
                <button
                  type="button"
                  onClick={() => openDocument(document)}
                  style={{
                    padding: 12,
                    border: 0,
                    borderRadius: 14,
                    background: theme.colors.primary,
                    color: theme.colors.background,
                    fontWeight: 850,
                    cursor: "pointer",
                  }}
                >
                  Apri
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadDocument(document)
                  }
                  style={{
                    padding: 12,
                    border:
                      "1px solid rgba(255,255,255,0.13)",
                    borderRadius: 14,
                    background:
                      "rgba(255,255,255,0.06)",
                    color: theme.colors.text,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Esporta
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeDocument(document)}
                style={{
                  width: "100%",
                  marginTop: 9,
                  padding: 10,
                  border:
                    "1px solid rgba(255,142,142,0.22)",
                  borderRadius: 13,
                  background:
                    "rgba(255,142,142,0.06)",
                  color: "#FFB4A8",
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Elimina dal dispositivo
              </button>
            </article>
          ))
        )}
      </section>

      {documents.length > 0 && (
        <button
          type="button"
          onClick={removeAllDocuments}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 13,
            border:
              "1px solid rgba(255,142,142,0.25)",
            borderRadius: 16,
            background: "transparent",
            color: "#FFB4A8",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Elimina tutti i documenti
        </button>
      )}

      <section
        style={{
          marginTop: 22,
          padding: 19,
          borderRadius: 21,
          background:
            "rgba(244,213,141,0.08)",
          border:
            "1px solid rgba(244,213,141,0.18)",
        }}
      >
        <strong
          style={{
            color: theme.colors.secondary,
          }}
        >
          🔒 Solo su questo dispositivo
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          I documenti non vengono pubblicati su GitHub e non sono
          inclusi nel backup JSON. Dovranno essere aggiunti
          separatamente su ciascun telefono.
        </p>
      </section>
    </main>
  );
}

function SummaryCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <article
      style={{
        padding: 17,
        borderRadius: 20,
        background: theme.colors.card,
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>

      <strong
        style={{
          display: "block",
          marginTop: 10,
          fontSize: 23,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 4,
          color: theme.colors.textSoft,
          fontSize: 12,
        }}
      >
        {label}
      </span>
    </article>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 20,
        background: theme.colors.card,
        color: theme.colors.textSoft,
        textAlign: "center",
        lineHeight: 1.5,
      }}
    >
      {text}
    </div>
  );
}

export default DocumentVault;