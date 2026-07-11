import { useEffect, useMemo, useState } from "react";
import { theme } from "../styles/theme";

type NoteCategory =
  | "Promemoria"
  | "Indirizzo"
  | "Acquisti"
  | "Attività"
  | "Altro";

type TripNote = {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  date: string;
  pinned: boolean;
  createdAt: string;
};

const STORAGE_KEY = "ruta-maya-trip-notes";

const categories: NoteCategory[] = [
  "Promemoria",
  "Indirizzo",
  "Acquisti",
  "Attività",
  "Altro",
];

const categoryIcons: Record<NoteCategory, string> = {
  Promemoria: "🔔",
  Indirizzo: "📍",
  Acquisti: "🛒",
  Attività: "🎟️",
  Altro: "📝",
};

function TripNotes() {
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    NoteCategory | "Tutte"
  >("Tutte");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] =
    useState<NoteCategory>("Promemoria");
  const [date, setDate] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (!savedNotes) {
      return;
    }

    try {
      setNotes(JSON.parse(savedNotes));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const visibleNotes = useMemo(() => {
    const filteredNotes =
      selectedCategory === "Tutte"
        ? notes
        : notes.filter(
            (note) => note.category === selectedCategory,
          );

    return [...filteredNotes].sort((firstNote, secondNote) => {
      if (firstNote.pinned !== secondNote.pinned) {
        return firstNote.pinned ? -1 : 1;
      }

      if (firstNote.date && secondNote.date) {
        return firstNote.date.localeCompare(secondNote.date);
      }

      return secondNote.createdAt.localeCompare(
        firstNote.createdAt,
      );
    });
  }, [notes, selectedCategory]);

  function addNote() {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle) {
      alert("Inserisci un titolo.");
      return;
    }

    const newNote: TripNote = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      content: cleanContent,
      category,
      date,
      pinned: false,
      createdAt: new Date().toISOString(),
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);

    setTitle("");
    setContent("");
    setCategory("Promemoria");
    setDate("");
    setShowForm(false);
  }

  function togglePinned(id: string) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
            }
          : note,
      ),
    );
  }

  function deleteNote(id: string) {
    const confirmed = window.confirm(
      "Vuoi eliminare questa nota?",
    );

    if (!confirmed) {
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id),
    );
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
        Organizzazione
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Note di viaggio
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Promemoria, indirizzi e informazioni salvati offline.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 23,
        }}
      >
        <article style={summaryCardStyle}>
          <span style={{ fontSize: 23 }}>📝</span>

          <strong
            style={{
              display: "block",
              marginTop: 11,
              fontSize: 28,
            }}
          >
            {notes.length}
          </strong>

          <span style={summaryLabelStyle}>
            note salvate
          </span>
        </article>

        <article style={summaryCardStyle}>
          <span style={{ fontSize: 23 }}>📌</span>

          <strong
            style={{
              display: "block",
              marginTop: 11,
              fontSize: 28,
            }}
          >
            {notes.filter((note) => note.pinned).length}
          </strong>

          <span style={summaryLabelStyle}>
            importanti
          </span>
        </article>
      </section>

      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        style={{
          width: "100%",
          marginTop: 17,
          padding: "15px 18px",
          border: 0,
          borderRadius: 18,
          background: theme.colors.primary,
          color: theme.colors.background,
          fontSize: 16,
          fontWeight: 850,
          cursor: "pointer",
        }}
      >
        {showForm ? "Chiudi" : "+ Nuova nota"}
      </button>

      {showForm && (
        <section
          style={{
            marginTop: 15,
            padding: 20,
            borderRadius: 24,
            background: theme.colors.card,
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <label style={labelStyle}>
            Titolo
            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Es. Comprare acqua"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Categoria
            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value as NoteCategory,
                )
              }
              style={inputStyle}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Data facoltativa
            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Testo
            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="Inserisci dettagli, indirizzi o informazioni..."
              rows={5}
              style={{
                ...inputStyle,
                resize: "vertical",
                lineHeight: 1.5,
              }}
            />
          </label>

          <button
            type="button"
            onClick={addNote}
            style={{
              width: "100%",
              marginTop: 20,
              padding: 14,
              border: 0,
              borderRadius: 16,
              background: theme.colors.secondary,
              color: theme.colors.background,
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            Salva nota
          </button>
        </section>
      )}

      <div
        style={{
          display: "flex",
          gap: 9,
          marginTop: 22,
          paddingBottom: 5,
          overflowX: "auto",
        }}
      >
        {(["Tutte", ...categories] as const).map(
          (item) => {
            const isActive = selectedCategory === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setSelectedCategory(item)
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
                {item === "Tutte"
                  ? "✨"
                  : categoryIcons[item]}{" "}
                {item}
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
        {visibleNotes.length === 0 ? (
          <div
            style={{
              padding: 21,
              borderRadius: 20,
              background: theme.colors.card,
              color: theme.colors.textSoft,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            Non ci sono ancora note in questa categoria.
          </div>
        ) : (
          visibleNotes.map((note) => (
            <article
              key={note.id}
              style={{
                padding: 18,
                borderRadius: 21,
                background: theme.colors.card,
                border: note.pinned
                  ? "1px solid rgba(244,213,141,0.35)"
                  : "1px solid rgba(255,255,255,0.08)",
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
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 15,
                    background: "rgba(17,197,191,0.15)",
                    fontSize: 22,
                  }}
                >
                  {categoryIcons[note.category]}
                </span>

                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      color: theme.colors.primary,
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {note.category}
                  </p>

                  <h2
                    style={{
                      margin: "5px 0 0",
                      fontSize: 19,
                    }}
                  >
                    {note.title}
                  </h2>

                  {note.date && (
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: theme.colors.secondary,
                        fontSize: 13,
                        fontWeight: 750,
                      }}
                    >
                      📅{" "}
                      {new Date(
                        `${note.date}T00:00:00`,
                      ).toLocaleDateString("it-IT")}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => togglePinned(note.id)}
                  style={{
                    padding: 4,
                    border: 0,
                    background: "transparent",
                    color: note.pinned
                      ? theme.colors.secondary
                      : theme.colors.textSoft,
                    fontSize: 24,
                    cursor: "pointer",
                  }}
                  aria-label={
                    note.pinned
                      ? "Rimuovi dalle note importanti"
                      : "Segna come importante"
                  }
                >
                  {note.pinned ? "★" : "☆"}
                </button>
              </div>

              {note.content && (
                <p
                  style={{
                    margin: "15px 0 0",
                    color: theme.colors.textSoft,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {note.content}
                </p>
              )}

              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                style={{
                  marginTop: 15,
                  padding: "8px 10px",
                  border:
                    "1px solid rgba(255,180,168,0.25)",
                  borderRadius: 12,
                  background: "transparent",
                  color: "#FFB4A8",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Elimina
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

const summaryCardStyle = {
  padding: 17,
  borderRadius: 20,
  background: theme.colors.card,
  border: "1px solid rgba(255,255,255,0.08)",
};

const summaryLabelStyle = {
  display: "block",
  marginTop: 3,
  color: theme.colors.textSoft,
  fontSize: 13,
};

const labelStyle = {
  display: "block",
  marginTop: 15,
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
  color: "#FFFFFF",
  fontSize: 16,
};

export default TripNotes;