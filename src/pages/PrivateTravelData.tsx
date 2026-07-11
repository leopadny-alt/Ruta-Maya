import { useState } from "react";
import { bookings } from "../data/bookings";
import {
  getPrivateTravelData,
  savePrivateTravelData,
} from "../utils/privateTravelData";
import { theme } from "../styles/theme";

function PrivateTravelData() {
  const initialData = getPrivateTravelData();

  const [references, setReferences] = useState<
    Record<number, string>
  >(initialData.bookingReferences);

  const [saved, setSaved] = useState(false);

  function updateReference(
    bookingId: number,
    value: string,
  ) {
    setReferences((currentReferences) => ({
      ...currentReferences,
      [bookingId]: value,
    }));

    setSaved(false);
  }

  function saveReferences() {
    savePrivateTravelData({
      bookingReferences: Object.fromEntries(
        Object.entries(references)
          .map(([id, value]) => [
            Number(id),
            value.trim(),
          ])
          .filter(([, value]) => Boolean(value)),
      ),
    });

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function clearReferences() {
    const confirmed = window.confirm(
      "Vuoi cancellare tutti i codici salvati soltanto su questo dispositivo?",
    );

    if (!confirmed) {
      return;
    }

    setReferences({});
    savePrivateTravelData({
      bookingReferences: {},
    });

    setSaved(false);
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
        Dati locali
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Codici privati
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Questi dati vengono salvati esclusivamente sul dispositivo
        e non vengono pubblicati su GitHub.
      </p>

      <section
        style={{
          marginTop: 22,
          padding: 18,
          borderRadius: 21,
          background: "rgba(244,213,141,0.09)",
          border:
            "1px solid rgba(244,213,141,0.20)",
        }}
      >
        <strong
          style={{
            color: theme.colors.secondary,
          }}
        >
          🔒 Informazioni private
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Dopo aver inserito i codici, crea un backup dell’app.
          I dati non vengono sincronizzati automaticamente sugli
          altri telefoni.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gap: 13,
          marginTop: 21,
        }}
      >
        {bookings.map((booking) => (
          <label
            key={booking.id}
            style={{
              display: "block",
              padding: 17,
              borderRadius: 20,
              background: theme.colors.card,
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 15,
              }}
            >
              {booking.title}
            </strong>

            <span
              style={{
                display: "block",
                marginTop: 4,
                color: theme.colors.textSoft,
                fontSize: 12,
              }}
            >
              {booking.date}
            </span>

            <input
              type="text"
              value={references[booking.id] ?? ""}
              onChange={(event) =>
                updateReference(
                  booking.id,
                  event.target.value,
                )
              }
              placeholder="Codice prenotazione o polizza"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginTop: 13,
                padding: "13px 14px",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                borderRadius: 14,
                outline: "none",
                background: "rgba(7,26,46,0.72)",
                color: theme.colors.text,
                fontSize: 16,
                textTransform: "uppercase",
              }}
            />
          </label>
        ))}
      </section>

      <button
        type="button"
        onClick={saveReferences}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 15,
          border: 0,
          borderRadius: 17,
          background: saved
            ? theme.colors.secondary
            : theme.colors.primary,
          color: theme.colors.background,
          fontWeight: 850,
          cursor: "pointer",
        }}
      >
        {saved
          ? "✓ Codici salvati"
          : "Salva sul dispositivo"}
      </button>

      <button
        type="button"
        onClick={clearReferences}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 14,
          border:
            "1px solid rgba(255,142,142,0.25)",
          borderRadius: 17,
          background: "rgba(255,142,142,0.08)",
          color: "#FFB4A8",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Cancella codici locali
      </button>
    </main>
  );
}

export default PrivateTravelData;