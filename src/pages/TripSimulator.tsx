import { useState } from "react";
import {
  clearTestDate,
  getTestDate,
  setTestDate,
} from "../utils/travelClock";
import { theme } from "../styles/theme";

const tripDates = [
  {
    value: "2026-08-06",
    label: "6 agosto",
    description: "Arrivo e Isla Mujeres",
  },
  {
    value: "2026-08-07",
    label: "7 agosto",
    description: "Isla Mujeres",
  },
  {
    value: "2026-08-08",
    label: "8 agosto",
    description: "Puerto Morelos e Tulum",
  },
  {
    value: "2026-08-09",
    label: "9 agosto",
    description: "Tulum e Valladolid",
  },
  {
    value: "2026-08-10",
    label: "10 agosto",
    description: "Ek’ Balam e Valladolid",
  },
  {
    value: "2026-08-11",
    label: "11 agosto",
    description: "Chichén Itzá e Mérida",
  },
  {
    value: "2026-08-12",
    label: "12 agosto",
    description: "Uxmal e Kabah",
  },
  {
    value: "2026-08-13",
    label: "13 agosto",
    description: "Mérida, Chiquilá e Holbox",
  },
  {
    value: "2026-08-14",
    label: "14 agosto",
    description: "Holbox e Cancún",
  },
  {
    value: "2026-08-15",
    label: "15 agosto",
    description: "Ultimo giorno e partenza",
  },
];

function TripSimulator() {
  const [selectedDate, setSelectedDate] =
    useState(getTestDate());

  const [message, setMessage] = useState("");

  function activateTestMode() {
    if (!selectedDate) {
      alert("Seleziona prima una data.");
      return;
    }

    setTestDate(selectedDate);
    setMessage(
      "Modalità test attivata. Apri la Home per vedere la giornata simulata.",
    );
  }

  function disableTestMode() {
    clearTestDate();
    setSelectedDate("");
    setMessage(
      "Modalità test disattivata. L’app usa nuovamente la data reale.",
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
        Collaudo
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Simula il viaggio
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Controlla in anticipo come cambierà la Home durante ogni
        giornata in Messico.
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 21,
          borderRadius: 24,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 850,
            letterSpacing: 1,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Stato attuale
        </p>

        <strong
          style={{
            display: "block",
            marginTop: 9,
            fontSize: 25,
          }}
        >
          {getTestDate()
            ? "Modalità test attiva"
            : "Data reale attiva"}
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            opacity: 0.85,
            lineHeight: 1.45,
          }}
        >
          {getTestDate()
            ? `Data simulata: ${new Date(
                `${getTestDate()}T12:00:00`,
              ).toLocaleDateString("it-IT")}`
            : "La Home utilizza la data del telefono."}
        </p>
      </section>

      {message && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 16,
            background: "rgba(17,197,191,0.16)",
            border: "1px solid rgba(17,197,191,0.28)",
            color: theme.colors.primary,
            textAlign: "center",
            fontWeight: 750,
            lineHeight: 1.45,
          }}
        >
          {message}
        </div>
      )}

      <section style={{ marginTop: 23 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 21 }}>
          Scegli una giornata
        </h2>

        <div style={{ display: "grid", gap: 10 }}>
          {tripDates.map((tripDate, index) => {
            const isSelected =
              selectedDate === tripDate.value;

            return (
              <button
                key={tripDate.value}
                type="button"
                onClick={() => {
                  setSelectedDate(tripDate.value);
                  setMessage("");
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  padding: 15,
                  border: isSelected
                    ? "1px solid rgba(17,197,191,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 19,
                  background: isSelected
                    ? "rgba(17,197,191,0.15)"
                    : theme.colors.card,
                  color: theme.colors.text,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 43,
                    height: 43,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 14,
                    background: isSelected
                      ? theme.colors.primary
                      : "rgba(17,197,191,0.13)",
                    color: isSelected
                      ? theme.colors.background
                      : theme.colors.primary,
                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </span>

                <span style={{ flex: 1 }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 16,
                    }}
                  >
                    {tripDate.label}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      color: theme.colors.textSoft,
                      fontSize: 13,
                    }}
                  >
                    {tripDate.description}
                  </span>
                </span>

                <span
                  style={{
                    color: isSelected
                      ? theme.colors.primary
                      : theme.colors.textSoft,
                    fontSize: 20,
                  }}
                >
                  {isSelected ? "✓" : "›"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        onClick={activateTestMode}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 15,
          border: 0,
          borderRadius: 17,
          background: theme.colors.primary,
          color: theme.colors.background,
          fontSize: 15,
          fontWeight: 850,
          cursor: "pointer",
        }}
      >
        Attiva data simulata
      </button>

      <button
        type="button"
        onClick={disableTestMode}
        style={{
          width: "100%",
          marginTop: 11,
          padding: 14,
          border: "1px solid rgba(255,255,255,0.13)",
          borderRadius: 17,
          background: theme.colors.card,
          color: theme.colors.text,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Torna alla data reale
      </button>

      <section
        style={{
          marginTop: 24,
          padding: 19,
          borderRadius: 21,
          background: "rgba(244,213,141,0.08)",
          border: "1px solid rgba(244,213,141,0.18)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: theme.colors.secondary,
            fontSize: 18,
          }}
        >
          Importante prima della partenza
        </h2>

        <p
          style={{
            margin: "9px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          Dopo aver concluso i test, premi “Torna alla data reale”.
          In caso contrario, la Home continuerà a mostrare la
          giornata simulata.
        </p>
      </section>
    </main>
  );
}

export default TripSimulator;