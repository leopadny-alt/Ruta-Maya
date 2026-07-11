import { useMemo, useState } from "react";
import { getTravelerProfile } from "../utils/travelerProfile";
import { theme } from "../styles/theme";

type FeedbackType =
  | "Problema"
  | "Miglioramento"
  | "Funzione mancante"
  | "Nota positiva";

type FeedbackPriority =
  | "Bassa"
  | "Media"
  | "Alta"
  | "Critica";

type FeedbackEntry = {
  id: string;
  type: FeedbackType;
  priority: FeedbackPriority;
  section: string;
  description: string;
  traveler: string;
  createdAt: string;
};

const STORAGE_KEY = "ruta-maya-beta-feedback";

const feedbackTypes: FeedbackType[] = [
  "Problema",
  "Miglioramento",
  "Funzione mancante",
  "Nota positiva",
];

const priorities: FeedbackPriority[] = [
  "Bassa",
  "Media",
  "Alta",
  "Critica",
];

const sections = [
  "Home",
  "Mappa",
  "Itinerario",
  "Agenda del giorno",
  "Cosa faccio adesso?",
  "Prenotazioni",
  "Alloggi",
  "Ristoranti",
  "Road Trip",
  "Budget",
  "Checklist",
  "Cassaforte documenti",
  "SOS e posizione",
  "Backup",
  "Altro",
];

const typeIcons: Record<FeedbackType, string> = {
  Problema: "🐞",
  Miglioramento: "✨",
  "Funzione mancante": "➕",
  "Nota positiva": "💚",
};

const priorityColors: Record<FeedbackPriority, string> = {
  Bassa: "#6ED4FF",
  Media: "#F4D58D",
  Alta: "#FFB86B",
  Critica: "#FF8E8E",
};

function getSavedFeedback(): FeedbackEntry[] {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);

    if (!savedValue) {
      return [];
    }

    const parsedValue = JSON.parse(savedValue);

    return Array.isArray(parsedValue)
      ? (parsedValue as FeedbackEntry[])
      : [];
  } catch {
    return [];
  }
}

function saveFeedback(entries: FeedbackEntry[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries),
  );
}

function BetaFeedback() {
  const traveler = getTravelerProfile();

  const [entries, setEntries] =
    useState<FeedbackEntry[]>(getSavedFeedback());

  const [type, setType] =
    useState<FeedbackType>("Problema");

  const [priority, setPriority] =
    useState<FeedbackPriority>("Media");

  const [section, setSection] =
    useState("Home");

  const [description, setDescription] =
    useState("");

  const [filter, setFilter] =
    useState<FeedbackType | "Tutti">("Tutti");

  const [message, setMessage] =
    useState("");

  const visibleEntries = useMemo(() => {
    const filteredEntries =
      filter === "Tutti"
        ? entries
        : entries.filter(
            (entry) => entry.type === filter,
          );

    return [...filteredEntries].sort(
      (firstEntry, secondEntry) =>
        secondEntry.createdAt.localeCompare(
          firstEntry.createdAt,
        ),
    );
  }, [entries, filter]);

  const openIssues = entries.filter(
    (entry) =>
      entry.type === "Problema" ||
      entry.type === "Funzione mancante",
  ).length;

  const criticalIssues = entries.filter(
    (entry) => entry.priority === "Critica",
  ).length;

  function addFeedback() {
    const cleanDescription = description.trim();

    if (!cleanDescription) {
      alert("Scrivi prima una breve descrizione.");
      return;
    }

    const newEntry: FeedbackEntry = {
      id: crypto.randomUUID(),
      type,
      priority,
      section,
      description: cleanDescription,
      traveler: traveler || "Profilo non selezionato",
      createdAt: new Date().toISOString(),
    };

    const updatedEntries = [
      newEntry,
      ...entries,
    ];

    setEntries(updatedEntries);
    saveFeedback(updatedEntries);
    setDescription("");

    setMessage("Osservazione salvata.");

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function deleteEntry(entry: FeedbackEntry) {
    const confirmed = window.confirm(
      "Vuoi eliminare questa osservazione?",
    );

    if (!confirmed) {
      return;
    }

    const updatedEntries = entries.filter(
      (currentEntry) =>
        currentEntry.id !== entry.id,
    );

    setEntries(updatedEntries);
    saveFeedback(updatedEntries);
  }

  function clearAllEntries() {
    if (entries.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Vuoi eliminare tutte le osservazioni del test?",
    );

    if (!confirmed) {
      return;
    }

    const secondConfirmation = window.confirm(
      "Hai già esportato il rapporto?",
    );

    if (!secondConfirmation) {
      return;
    }

    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  function createReport() {
    return [
      "Ruta Maya – Rapporto beta test",
      "",
      `Osservazioni totali: ${entries.length}`,
      `Problemi o funzioni mancanti: ${openIssues}`,
      `Priorità critica: ${criticalIssues}`,
      "",
      ...visibleEntries.map((entry, index) =>
        [
          `${index + 1}. ${typeIcons[entry.type]} ${entry.type}`,
          `Priorità: ${entry.priority}`,
          `Sezione: ${entry.section}`,
          `Autore: ${entry.traveler}`,
          `Data: ${new Date(
            entry.createdAt,
          ).toLocaleString("it-IT")}`,
          `Nota: ${entry.description}`,
          "",
        ].join("\n"),
      ),
    ].join("\n");
  }

  async function shareReport() {
    if (entries.length === 0) {
      alert(
        "Non ci sono ancora osservazioni da condividere.",
      );
      return;
    }

    const report = createReport();

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Ruta Maya – Rapporto beta",
          text: report,
        });

        return;
      }

      await navigator.clipboard.writeText(report);

      alert("Rapporto copiato.");
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      window.prompt(
        "Copia il rapporto:",
        report,
      );
    }
  }

  function downloadReport() {
    if (entries.length === 0) {
      alert(
        "Non ci sono ancora osservazioni da esportare.",
      );
      return;
    }

    const report = createReport();

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      "ruta-maya-rapporto-beta.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
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
        Test sul campo
      </p>

      <h1
        style={{
          margin: "8px 0 6px",
          fontSize: 34,
        }}
      >
        Diario beta
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Registra problemi, idee e osservazioni durante
        il viaggio.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 9,
          marginTop: 22,
        }}
      >
        <SummaryCard
          value={entries.length}
          label="totali"
          color={theme.colors.primary}
        />

        <SummaryCard
          value={openIssues}
          label="da valutare"
          color={theme.colors.secondary}
        />

        <SummaryCard
          value={criticalIssues}
          label="critiche"
          color="#FF8E8E"
        />
      </section>

      {message && (
        <div
          style={{
            marginTop: 15,
            padding: 14,
            borderRadius: 16,
            background:
              "rgba(17,197,191,0.16)",
            border:
              "1px solid rgba(17,197,191,0.28)",
            color: theme.colors.primary,
            textAlign: "center",
            fontWeight: 750,
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
        <h2
          style={{
            margin: 0,
            fontSize: 20,
          }}
        >
          Nuova osservazione
        </h2>

        <label style={labelStyle}>
          Tipo

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as FeedbackType,
              )
            }
            style={inputStyle}
          >
            {feedbackTypes.map((feedbackType) => (
              <option
                key={feedbackType}
                value={feedbackType}
              >
                {typeIcons[feedbackType]}{" "}
                {feedbackType}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Priorità

          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value as FeedbackPriority,
              )
            }
            style={inputStyle}
          >
            {priorities.map((priorityValue) => (
              <option
                key={priorityValue}
                value={priorityValue}
              >
                {priorityValue}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Sezione dell’app

          <select
            value={section}
            onChange={(event) =>
              setSection(event.target.value)
            }
            style={inputStyle}
          >
            {sections.map((sectionName) => (
              <option
                key={sectionName}
                value={sectionName}
              >
                {sectionName}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Descrizione

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Esempio: il pulsante della mappa non si apre senza connessione…"
            rows={4}
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.5,
            }}
          />
        </label>

        <button
          type="button"
          onClick={addFeedback}
          style={{
            width: "100%",
            marginTop: 17,
            padding: 14,
            border: 0,
            borderRadius: 16,
            background: theme.colors.primary,
            color: theme.colors.background,
            fontWeight: 850,
            cursor: "pointer",
          }}
        >
          Salva osservazione
        </button>
      </section>

      <div
        style={{
          display: "flex",
          gap: 9,
          marginTop: 22,
          paddingBottom: 5,
          overflowX: "auto",
        }}
      >
        {(["Tutti", ...feedbackTypes] as const).map(
          (filterValue) => {
            const isActive =
              filter === filterValue;

            return (
              <button
                key={filterValue}
                type="button"
                onClick={() =>
                  setFilter(filterValue)
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
                {filterValue === "Tutti"
                  ? "✨ Tutti"
                  : `${typeIcons[filterValue]} ${filterValue}`}
              </button>
            );
          },
        )}
      </div>

      <section
        style={{
          display: "grid",
          gap: 12,
          marginTop: 17,
        }}
      >
        {visibleEntries.length === 0 ? (
          <div
            style={{
              padding: 23,
              borderRadius: 21,
              background: theme.colors.card,
              color: theme.colors.textSoft,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Nessuna osservazione registrata.
          </div>
        ) : (
          visibleEntries.map((entry) => {
            const priorityColor =
              priorityColors[entry.priority];

            return (
              <article
                key={entry.id}
                style={{
                  padding: 17,
                  borderRadius: 21,
                  background: theme.colors.card,
                  border: `1px solid ${priorityColor}35`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 8px",
                        borderRadius: 999,
                        background: `${priorityColor}17`,
                        color: priorityColor,
                        fontSize: 10,
                        fontWeight: 850,
                        textTransform: "uppercase",
                      }}
                    >
                      {typeIcons[entry.type]}{" "}
                      {entry.type}
                    </span>

                    <strong
                      style={{
                        display: "block",
                        marginTop: 10,
                        fontSize: 17,
                      }}
                    >
                      {entry.section}
                    </strong>
                  </div>

                  <span
                    style={{
                      padding: "5px 8px",
                      borderRadius: 999,
                      background: `${priorityColor}17`,
                      color: priorityColor,
                      fontSize: 10,
                      fontWeight: 850,
                    }}
                  >
                    {entry.priority}
                  </span>
                </div>

                <p
                  style={{
                    margin: "12px 0 0",
                    color: theme.colors.textSoft,
                    fontSize: 14,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {entry.description}
                </p>

                <p
                  style={{
                    margin: "13px 0 0",
                    color: theme.colors.textSoft,
                    fontSize: 11,
                    lineHeight: 1.45,
                  }}
                >
                  👤 {entry.traveler} ·{" "}
                  {new Date(
                    entry.createdAt,
                  ).toLocaleString("it-IT")}
                </p>

                <button
                  type="button"
                  onClick={() => deleteEntry(entry)}
                  style={{
                    width: "100%",
                    marginTop: 13,
                    padding: 10,
                    border:
                      "1px solid rgba(255,142,142,0.20)",
                    borderRadius: 13,
                    background:
                      "rgba(255,142,142,0.06)",
                    color: "#FFB4A8",
                    fontWeight: 750,
                    cursor: "pointer",
                  }}
                >
                  Elimina osservazione
                </button>
              </article>
            );
          })
        )}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
          marginTop: 22,
        }}
      >
        <button
          type="button"
          onClick={shareReport}
          style={secondaryButtonStyle}
        >
          Condividi
        </button>

        <button
          type="button"
          onClick={downloadReport}
          style={{
            ...secondaryButtonStyle,
            background: theme.colors.primary,
            color: theme.colors.background,
            border: 0,
          }}
        >
          Esporta TXT
        </button>
      </section>

      {entries.length > 0 && (
        <button
          type="button"
          onClick={clearAllEntries}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 12,
            border:
              "1px solid rgba(255,142,142,0.22)",
            borderRadius: 15,
            background: "transparent",
            color: "#FFB4A8",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Elimina tutto il diario
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
          Consiglio per il test
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          Registra subito l’osservazione quando emerge:
          dopo qualche ora sarà più difficile ricordare il
          contesto preciso.
        </p>
      </section>
    </main>
  );
}

function SummaryCard({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <article
      style={{
        padding: "15px 7px",
        borderRadius: 18,
        background: theme.colors.card,
        border:
          "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}
    >
      <strong
        style={{
          display: "block",
          color,
          fontSize: 24,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 5,
          color: theme.colors.textSoft,
          fontSize: 10,
        }}
      >
        {label}
      </span>
    </article>
  );
}

const labelStyle = {
  display: "block",
  marginTop: 15,
  color: theme.colors.textSoft,
  fontSize: 13,
  fontWeight: 750,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: "13px 14px",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 14,
  outline: "none",
  background: "rgba(7,26,46,0.72)",
  color: theme.colors.text,
  fontSize: 15,
};

const secondaryButtonStyle = {
  padding: 13,
  border: "1px solid rgba(255,255,255,0.13)",
  borderRadius: 15,
  background: theme.colors.card,
  color: theme.colors.text,
  fontWeight: 850,
  cursor: "pointer",
};

export default BetaFeedback;