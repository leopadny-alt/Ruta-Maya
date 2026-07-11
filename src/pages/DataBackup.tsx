import { useRef, useState } from "react";
import { theme } from "../styles/theme";

const BACKUP_VERSION = 1;

const STORAGE_KEYS = [
  "ruta-maya-expenses",
  "ruta-maya-people",
  "ruta-maya-bookings",
  "ruta-maya-packing-checklist",
  "ruta-maya-exchange-rate",
  "ruta-maya-fuel-calculator",
  "ruta-maya-trip-notes",
  "ruta-maya-personal-contacts",
  "ruta-maya-map-favorites",
  "ruta-maya-private-travel-data",
];

type BackupFile = {
  app: "Ruta Maya";
  version: number;
  exportedAt: string;
  data: Record<string, string | null>;
};

function DataBackup() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  function showMessage(
    text: string,
    type: "success" | "error",
  ) {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3500);
  }

  function createBackup(): BackupFile {
    const data: Record<string, string | null> = {};

    STORAGE_KEYS.forEach((key) => {
      data[key] = localStorage.getItem(key);
    });

    return {
      app: "Ruta Maya",
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data,
    };
  }

  function getBackupFile() {
    const backup = createBackup();
    const json = JSON.stringify(backup, null, 2);

    const fileName = `ruta-maya-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    return {
      backup,
      json,
      fileName,
      file: new File([json], fileName, {
        type: "application/json",
      }),
    };
  }

  async function shareBackup() {
    const { file, fileName } = getBackupFile();

    try {
      if (
        navigator.share &&
        navigator.canShare?.({
          files: [file],
        })
      ) {
        await navigator.share({
          title: "Backup Ruta Maya",
          text: "Backup dei dati dell’app Ruta Maya.",
          files: [file],
        });

        showMessage(
          "Backup condiviso correttamente.",
          "success",
        );

        return;
      }

      downloadBackup();

      showMessage(
        `Condivisione diretta non disponibile. È stato scaricato ${fileName}.`,
        "success",
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      showMessage(
        "Non è stato possibile condividere il backup.",
        "error",
      );
    }
  }

  function downloadBackup() {
    const { json, fileName } = getBackupFile();

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showMessage(
      "Backup scaricato correttamente.",
      "success",
    );
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function importBackup(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    try {
      const fileContent = await selectedFile.text();
      const parsedBackup = JSON.parse(
        fileContent,
      ) as BackupFile;

      const isValidBackup =
        parsedBackup.app === "Ruta Maya" &&
        typeof parsedBackup.version === "number" &&
        parsedBackup.data &&
        typeof parsedBackup.data === "object";

      if (!isValidBackup) {
        throw new Error("Backup non valido");
      }

      const confirmed = window.confirm(
        "L’importazione sostituirà i dati attualmente salvati su questo dispositivo. Vuoi continuare?",
      );

      if (!confirmed) {
        return;
      }

      STORAGE_KEYS.forEach((key) => {
        const value = parsedBackup.data[key];

        if (typeof value === "string") {
          localStorage.setItem(key, value);
        } else {
          localStorage.removeItem(key);
        }
      });

      showMessage(
        "Backup importato. L’app verrà ricaricata.",
        "success",
      );

      window.setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch {
      showMessage(
        "Il file selezionato non è un backup valido di Ruta Maya.",
        "error",
      );
    }
  }

  function deleteLocalData() {
    const firstConfirmation = window.confirm(
      "Vuoi eliminare tutti i dati personali salvati nell’app su questo dispositivo?",
    );

    if (!firstConfirmation) {
      return;
    }

    const secondConfirmation = window.confirm(
      "Questa operazione non può essere annullata. Hai già creato un backup?",
    );

    if (!secondConfirmation) {
      return;
    }

    STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    showMessage(
      "Tutti i dati locali sono stati eliminati.",
      "success",
    );

    window.setTimeout(() => {
      window.location.reload();
    }, 1200);
  }

  const savedSections = STORAGE_KEYS.filter(
    (key) => localStorage.getItem(key) !== null,
  ).length;

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
        Sicurezza
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Backup dati
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Salva e trasferisci i dati personali di Ruta Maya.
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 22,
          borderRadius: 25,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            opacity: 0.85,
          }}
        >
          Sezioni con dati salvati
        </p>

        <strong
          style={{
            display: "block",
            marginTop: 7,
            fontSize: 42,
          }}
        >
          {savedSections}/{STORAGE_KEYS.length}
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            opacity: 0.84,
            lineHeight: 1.45,
          }}
        >
          Il backup include Budget, partecipanti, prenotazioni,
          checklist, cambio valuta, note, contatti e preferiti.
        </p>
      </section>

      {message && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 16,
            background:
              messageType === "success"
                ? "rgba(17,197,191,0.16)"
                : "rgba(255,104,104,0.16)",
            border:
              messageType === "success"
                ? "1px solid rgba(17,197,191,0.28)"
                : "1px solid rgba(255,104,104,0.28)",
            color:
              messageType === "success"
                ? theme.colors.primary
                : "#FFB4A8",
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
          display: "grid",
          gap: 13,
          marginTop: 22,
        }}
      >
        <ActionCard
          icon="📤"
          title="Condividi backup"
          description="Invia il file tramite AirDrop, WhatsApp, email o altre app disponibili."
          buttonLabel="Condividi"
          onClick={shareBackup}
          primary
        />

        <ActionCard
          icon="⬇️"
          title="Scarica backup"
          description="Salva una copia del file nella cartella Download o File del dispositivo."
          buttonLabel="Scarica file"
          onClick={downloadBackup}
        />

        <ActionCard
          icon="📥"
          title="Importa backup"
          description="Ripristina un backup o trasferisci i dati su un altro telefono."
          buttonLabel="Scegli file"
          onClick={openFilePicker}
        />
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={importBackup}
        style={{ display: "none" }}
      />

      <section
        style={{
          marginTop: 26,
          padding: 20,
          borderRadius: 22,
          background: theme.colors.card,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20 }}>
          Come trasferire i dati
        </h2>

        <div
          style={{
            marginTop: 15,
            display: "grid",
            gap: 13,
          }}
        >
          {[
            "Crea il backup sul telefono principale.",
            "Invia il file agli altri partecipanti.",
            "Apri Ruta Maya sul nuovo telefono.",
            "Vai su Altro → Backup dati → Importa backup.",
          ].map((step, index) => (
            <div
              key={step}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  borderRadius: 10,
                  background: "rgba(17,197,191,0.16)",
                  color: theme.colors.primary,
                  fontWeight: 850,
                }}
              >
                {index + 1}
              </span>

              <span
                style={{
                  color: theme.colors.textSoft,
                  lineHeight: 1.5,
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 22,
          background: "rgba(255,104,104,0.08)",
          border: "1px solid rgba(255,104,104,0.18)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#FFB4A8",
            fontSize: 20,
          }}
        >
          Elimina dati locali
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Cancella tutte le informazioni personali inserite su
          questo dispositivo. L’itinerario e i contenuti generali
          dell’app resteranno disponibili.
        </p>

        <button
          type="button"
          onClick={deleteLocalData}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 13,
            border: "1px solid rgba(255,104,104,0.35)",
            borderRadius: 15,
            background: "transparent",
            color: "#FFB4A8",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Elimina tutti i dati
        </button>
      </section>

      <p
        style={{
          margin: "22px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        Il file di backup contiene le informazioni personali
        inserite nell’app. Conservalo e condividilo soltanto con
        persone fidate.
      </p>
    </main>
  );
}

type ActionCardProps = {
  icon: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  primary?: boolean;
};

function ActionCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
  primary = false,
}: ActionCardProps) {
  return (
    <article
      style={{
        padding: 19,
        borderRadius: 22,
        background: theme.colors.card,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <span
          style={{
            width: 48,
            height: 48,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            borderRadius: 16,
            background: "rgba(17,197,191,0.15)",
            fontSize: 23,
          }}
        >
          {icon}
        </span>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 19,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color: theme.colors.textSoft,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        style={{
          width: "100%",
          marginTop: 16,
          padding: 13,
          border: primary
            ? 0
            : "1px solid rgba(255,255,255,0.13)",
          borderRadius: 15,
          background: primary
            ? theme.colors.primary
            : "rgba(255,255,255,0.07)",
          color: primary
            ? theme.colors.background
            : theme.colors.text,
          fontWeight: 850,
          cursor: "pointer",
        }}
      >
        {buttonLabel}
      </button>
    </article>
  );
}

export default DataBackup;