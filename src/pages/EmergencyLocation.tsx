import { useEffect, useMemo, useState } from "react";
import { getTravelerProfile } from "../utils/travelerProfile";
import { theme } from "../styles/theme";

type SavedPosition = {
  latitude: number;
  longitude: number;
  accuracy: number;
  savedAt: string;
};

type PositionStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

const POSITION_STORAGE_KEY =
  "ruta-maya-last-known-position";

function getSavedPosition(): SavedPosition | null {
  try {
    const savedValue = localStorage.getItem(
      POSITION_STORAGE_KEY,
    );

    if (!savedValue) {
      return null;
    }

    const parsedValue = JSON.parse(
      savedValue,
    ) as SavedPosition;

    const isValid =
      Number.isFinite(parsedValue.latitude) &&
      Number.isFinite(parsedValue.longitude) &&
      Number.isFinite(parsedValue.accuracy) &&
      Boolean(parsedValue.savedAt);

    if (!isValid) {
      localStorage.removeItem(
        POSITION_STORAGE_KEY,
      );

      return null;
    }

    return parsedValue;
  } catch {
    localStorage.removeItem(
      POSITION_STORAGE_KEY,
    );

    return null;
  }
}

function savePosition(position: SavedPosition) {
  localStorage.setItem(
    POSITION_STORAGE_KEY,
    JSON.stringify(position),
  );
}

function getMapsUrl(position: SavedPosition) {
  return `https://www.google.com/maps/search/?api=1&query=${position.latitude},${position.longitude}`;
}

function getCoordinatesText(position: SavedPosition) {
  return `${position.latitude.toFixed(
    6,
  )}, ${position.longitude.toFixed(6)}`;
}

function EmergencyLocation() {
  const traveler = getTravelerProfile();

  const [position, setPosition] =
    useState<SavedPosition | null>(
      getSavedPosition(),
    );

  const [status, setStatus] =
    useState<PositionStatus>("idle");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [copied, setCopied] = useState(false);

  const emergencyMessage = useMemo(() => {
    const travelerText = traveler
      ? `Me llamo ${traveler}.`
      : "";

    const locationText = position
      ? `Mi ubicación es ${getCoordinatesText(
          position,
        )}.`
      : "No puedo indicar mi ubicación exacta.";

    return [
      "Necesito ayuda.",
      travelerText,
      locationText,
      "Por favor, envíen asistencia.",
    ]
      .filter(Boolean)
      .join(" ");
  }, [position, traveler]);

  useEffect(() => {
    if (!position) {
      return;
    }

    savePosition(position);
  }, [position]);

  function detectPosition() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setErrorMessage(
        "La geolocalizzazione non è supportata da questo dispositivo.",
      );

      return;
    }

    setStatus("loading");
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const newPosition: SavedPosition = {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
          accuracy: result.coords.accuracy,
          savedAt: new Date().toISOString(),
        };

        setPosition(newPosition);
        setStatus("success");
      },
      (error) => {
        setStatus("error");

        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage(
            "Permesso GPS negato. Abilita la posizione nelle impostazioni del browser o dell’app.",
          );

          return;
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMessage(
            "Posizione non disponibile. Spostati in un luogo aperto e riprova.",
          );

          return;
        }

        if (error.code === error.TIMEOUT) {
          setErrorMessage(
            "Il rilevamento ha impiegato troppo tempo. Riprova.",
          );

          return;
        }

        setErrorMessage(
          "Non è stato possibile rilevare la posizione.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      },
    );
  }

  async function copyPosition() {
    if (!position) {
      return;
    }

    const text = [
      traveler
        ? `Posizione di ${traveler}`
        : "La mia posizione",
      getCoordinatesText(position),
      getMapsUrl(position),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      window.prompt(
        "Copia la posizione:",
        text,
      );
    }
  }

  async function sharePosition() {
    if (!position) {
      return;
    }

    const text = [
      traveler
        ? `Posizione di ${traveler}:`
        : "La mia posizione:",
      getMapsUrl(position),
      `Coordinate: ${getCoordinatesText(
        position,
      )}`,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Posizione Ruta Maya",
          text,
        });

        return;
      }

      await navigator.clipboard.writeText(text);
      alert("Posizione copiata.");
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      window.prompt(
        "Copia la posizione:",
        text,
      );
    }
  }

  async function copyEmergencyMessage() {
    try {
      await navigator.clipboard.writeText(
        emergencyMessage,
      );

      alert(
        "Messaggio d’emergenza copiato.",
      );
    } catch {
      window.prompt(
        "Copia il messaggio:",
        emergencyMessage,
      );
    }
  }

  function clearPosition() {
    const confirmed = window.confirm(
      "Vuoi cancellare l’ultima posizione salvata?",
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      POSITION_STORAGE_KEY,
    );

    setPosition(null);
    setStatus("idle");
    setErrorMessage("");
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
          color: "#FF8E8E",
          fontSize: 13,
          fontWeight: 850,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        Sicurezza
      </p>

      <h1
        style={{
          margin: "8px 0 6px",
          fontSize: 34,
        }}
      >
        SOS e posizione
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Chiama i soccorsi e condividi rapidamente
        la tua posizione.
      </p>

      <a
        href="tel:911"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 11,
          marginTop: 24,
          padding: 18,
          borderRadius: 21,
          background:
            "linear-gradient(135deg, #E55F6F, #9C3146)",
          color: "#FFFFFF",
          textDecoration: "none",
          fontSize: 19,
          fontWeight: 900,
          boxShadow:
            "0 18px 42px rgba(120,20,40,0.32)",
        }}
      >
        <span style={{ fontSize: 27 }}>📞</span>
        Chiama il 911
      </a>

      <p
        style={{
          margin: "9px 3px 0",
          color: theme.colors.textSoft,
          fontSize: 11,
          lineHeight: 1.45,
          textAlign: "center",
        }}
      >
        Utilizzare soltanto in caso di reale
        emergenza.
      </p>

      <section
        style={{
          marginTop: 21,
          padding: 20,
          borderRadius: 23,
          background: theme.colors.card,
          border:
            "1px solid rgba(110,212,255,0.20)",
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
              width: 50,
              height: 50,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 17,
              background:
                "rgba(72,184,232,0.14)",
              fontSize: 24,
            }}
          >
            📍
          </span>

          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
              }}
            >
              Posizione GPS
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: theme.colors.textSoft,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Rileva le coordinate e salvale sul
              dispositivo.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={detectPosition}
          disabled={status === "loading"}
          style={{
            width: "100%",
            marginTop: 17,
            padding: 14,
            border: 0,
            borderRadius: 16,
            background: theme.colors.primary,
            color: theme.colors.background,
            fontWeight: 850,
            cursor:
              status === "loading"
                ? "not-allowed"
                : "pointer",
            opacity:
              status === "loading" ? 0.65 : 1,
          }}
        >
          {status === "loading"
            ? "Rilevamento in corso…"
            : position
              ? "Aggiorna posizione"
              : "Rileva posizione"}
        </button>
      </section>

      {errorMessage && (
        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 16,
            background:
              "rgba(255,142,142,0.10)",
            border:
              "1px solid rgba(255,142,142,0.22)",
            color: "#FFB4A8",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {errorMessage}
        </div>
      )}

      {position && (
        <section
          style={{
            marginTop: 17,
            padding: 20,
            borderRadius: 23,
            background: theme.colors.card,
            border:
              "1px solid rgba(17,197,191,0.24)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: theme.colors.primary,
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Ultima posizione salvata
          </p>

          <strong
            style={{
              display: "block",
              marginTop: 10,
              fontSize: 19,
              lineHeight: 1.4,
            }}
          >
            {getCoordinatesText(position)}
          </strong>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
              marginTop: 15,
            }}
          >
            <InfoCard
              label="Precisione"
              value={`± ${Math.round(
                position.accuracy,
              )} m`}
            />

            <InfoCard
              label="Aggiornata"
              value={new Date(
                position.savedAt,
              ).toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>

          <a
            href={getMapsUrl(position)}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              marginTop: 14,
              padding: 13,
              borderRadius: 15,
              background:
                "rgba(72,184,232,0.16)",
              color: "#6ED4FF",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 850,
            }}
          >
            Apri in Google Maps
          </a>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
              marginTop: 9,
            }}
          >
            <button
              type="button"
              onClick={copyPosition}
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
              {copied ? "✓ Copiata" : "Copia"}
            </button>

            <button
              type="button"
              onClick={sharePosition}
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
              Condividi
            </button>
          </div>

          <button
            type="button"
            onClick={clearPosition}
            style={{
              width: "100%",
              marginTop: 9,
              padding: 11,
              border:
                "1px solid rgba(255,142,142,0.20)",
              borderRadius: 14,
              background:
                "rgba(255,142,142,0.06)",
              color: "#FFB4A8",
              fontWeight: 750,
              cursor: "pointer",
            }}
          >
            Cancella posizione salvata
          </button>
        </section>
      )}

      <section
        style={{
          marginTop: 21,
          padding: 20,
          borderRadius: 23,
          background: theme.colors.card,
          border:
            "1px solid rgba(244,213,141,0.20)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: theme.colors.secondary,
            fontSize: 12,
            fontWeight: 850,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          💬 Messaggio in spagnolo
        </p>

        <p
          style={{
            margin: "12px 0 0",
            color: theme.colors.text,
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.55,
          }}
        >
          {emergencyMessage}
        </p>

        <p
          style={{
            margin: "11px 0 0",
            color: theme.colors.textSoft,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          “Ho bisogno di aiuto. Per favore,
          mandate assistenza.”
        </p>

        <button
          type="button"
          onClick={copyEmergencyMessage}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 13,
            border:
              "1px solid rgba(244,213,141,0.28)",
            borderRadius: 15,
            background:
              "rgba(244,213,141,0.10)",
            color: theme.colors.secondary,
            fontWeight: 850,
            cursor: "pointer",
          }}
        >
          Copia messaggio
        </button>
      </section>

      <section
        style={{
          marginTop: 21,
          padding: 19,
          borderRadius: 21,
          background:
            "rgba(255,255,255,0.055)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <strong
          style={{
            color: theme.colors.primary,
          }}
        >
          Prima di chiedere aiuto
        </strong>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 13,
          }}
        >
          {[
            "Raggiungi un luogo sicuro, se possibile.",
            "Comunica il tipo di emergenza.",
            "Condividi la posizione o un punto di riferimento.",
            "Non interrompere la chiamata finché non viene richiesto.",
          ].map((item, index) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  borderRadius: 9,
                  background:
                    "rgba(17,197,191,0.14)",
                  color: theme.colors.primary,
                  fontSize: 11,
                  fontWeight: 900,
                }}
              >
                {index + 1}
              </span>

              <span
                style={{
                  color: theme.colors.textSoft,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      <p
        style={{
          margin: "22px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 11,
          lineHeight: 1.5,
        }}
      >
        Il GPS può essere meno preciso negli edifici,
        in auto o in zone con scarsa copertura. Verifica
        sempre anche l’indirizzo o un punto di riferimento.
      </p>
    </main>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 15,
        background:
          "rgba(255,255,255,0.055)",
      }}
    >
      <span
        style={{
          display: "block",
          color: theme.colors.textSoft,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 6,
          fontSize: 14,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

export default EmergencyLocation;