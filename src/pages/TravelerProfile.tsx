import { useState } from "react";
import {
  clearTravelerProfile,
  getTravelerProfile,
  saveTravelerProfile,
  TRAVELERS,
  type TravelerName,
} from "../utils/travelerProfile";
import { theme } from "../styles/theme";

const travelerIcons: Record<TravelerName, string> = {
  Leonardo: "🎬",
  Eva: "🌺",
  Stefano: "🌴",
  Valentina: "☀️",
  Maristella: "🌊",
};

function TravelerProfile() {
  const [selectedTraveler, setSelectedTraveler] = useState<
    TravelerName | ""
  >(getTravelerProfile());

  const [saved, setSaved] = useState(false);

  function saveProfile() {
    if (!selectedTraveler) {
      alert("Seleziona prima il proprietario del telefono.");
      return;
    }

    saveTravelerProfile(selectedTraveler);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function removeProfile() {
    const confirmed = window.confirm(
      "Vuoi rimuovere il profilo da questo dispositivo?",
    );

    if (!confirmed) {
      return;
    }

    clearTravelerProfile();
    setSelectedTraveler("");
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
        Personalizzazione
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Il mio profilo
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Seleziona chi utilizza questo telefono per mostrare voli
        e informazioni personali corrette.
      </p>

      {selectedTraveler && (
        <section
          style={{
            marginTop: 23,
            padding: 22,
            borderRadius: 25,
            background:
              "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
            boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 45 }}>
            {travelerIcons[selectedTraveler]}
          </span>

          <strong
            style={{
              display: "block",
              marginTop: 11,
              fontSize: 26,
            }}
          >
            {selectedTraveler}
          </strong>

          <span
            style={{
              display: "block",
              marginTop: 6,
              fontSize: 13,
              opacity: 0.82,
            }}
          >
            Profilo selezionato su questo dispositivo
          </span>
        </section>
      )}

      <section
        style={{
          display: "grid",
          gap: 11,
          marginTop: 22,
        }}
      >
        {TRAVELERS.map((traveler) => {
          const isSelected = selectedTraveler === traveler;

          return (
            <button
              key={traveler}
              type="button"
              onClick={() => {
                setSelectedTraveler(traveler);
                setSaved(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 16,
                border: isSelected
                  ? "1px solid rgba(17,197,191,0.50)"
                  : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
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
                  width: 47,
                  height: 47,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  borderRadius: 16,
                  background: isSelected
                    ? theme.colors.primary
                    : "rgba(17,197,191,0.13)",
                  fontSize: 23,
                }}
              >
                {travelerIcons[traveler]}
              </span>

              <strong
                style={{
                  flex: 1,
                  fontSize: 17,
                }}
              >
                {traveler}
              </strong>

              <span
                style={{
                  color: isSelected
                    ? theme.colors.primary
                    : theme.colors.textSoft,
                  fontSize: 21,
                }}
              >
                {isSelected ? "✓" : "›"}
              </span>
            </button>
          );
        })}
      </section>

      <button
        type="button"
        onClick={saveProfile}
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
        {saved ? "✓ Profilo salvato" : "Salva profilo"}
      </button>

      <button
        type="button"
        onClick={removeProfile}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 14,
          border: "1px solid rgba(255,255,255,0.13)",
          borderRadius: 17,
          background: theme.colors.card,
          color: theme.colors.textSoft,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Rimuovi profilo
      </button>

      <section
        style={{
          marginTop: 23,
          padding: 19,
          borderRadius: 21,
          background: "rgba(244,213,141,0.08)",
          border: "1px solid rgba(244,213,141,0.18)",
        }}
      >
        <strong style={{ color: theme.colors.secondary }}>
          Come viene utilizzato
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          Le prenotazioni comuni restano visibili a tutti. Quando
          il gruppo si divide, la Home mostrerà soltanto il volo
          relativo al proprietario del telefono.
        </p>
      </section>
    </main>
  );
}

export default TravelerProfile;