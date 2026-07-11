import { useEffect, useState } from "react";
import { theme } from "../styles/theme";

type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "updated"
  | "error";

function isStandaloneMode() {
  const standaloneMedia = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  const iosStandalone =
    "standalone" in window.navigator &&
    Boolean(
      (
        window.navigator as Navigator & {
          standalone?: boolean;
        }
      ).standalone,
    );

  return standaloneMedia || iosStandalone;
}

function AppSettings() {
  const [status, setStatus] =
    useState<UpdateStatus>("idle");

  const [isInstalled, setIsInstalled] = useState(
    isStandaloneMode(),
  );

  const [hasServiceWorker, setHasServiceWorker] =
    useState(false);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
          setHasServiceWorker(Boolean(registration));
        })
        .catch(() => {
          setHasServiceWorker(false);
        });
    }
  }, []);

  async function checkForUpdates() {
    if (!("serviceWorker" in navigator)) {
      setStatus("error");
      return;
    }

    setStatus("checking");

    try {
      const registration =
        await navigator.serviceWorker.getRegistration();

      if (!registration) {
        setStatus("error");
        return;
      }

      await registration.update();

      if (registration.waiting) {
        setStatus("available");
        return;
      }

      window.setTimeout(() => {
        setStatus("updated");
      }, 900);
    } catch {
      setStatus("error");
    }
  }

  function installAvailableUpdate() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .getRegistration()
      .then((registration) => {
        if (!registration?.waiting) {
          window.location.reload();
          return;
        }

        registration.waiting.postMessage({
          type: "SKIP_WAITING",
        });

        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => {
            window.location.reload();
          },
          {
            once: true,
          },
        );
      })
      .catch(() => {
        window.location.reload();
      });
  }

  function hardReload() {
    const confirmed = window.confirm(
      "Vuoi ricaricare Ruta Maya? I dati salvati non verranno eliminati.",
    );

    if (!confirmed) {
      return;
    }

    window.location.reload();
  }

  async function clearAppCache() {
    const confirmed = window.confirm(
      "Vuoi eliminare soltanto i file temporanei dell’app? Budget, note, checklist e altri dati personali resteranno salvati.",
    );

    if (!confirmed) {
      return;
    }

    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();

        await Promise.all(
          cacheNames.map((cacheName) =>
            caches.delete(cacheName),
          ),
        );
      }

      if ("serviceWorker" in navigator) {
        const registration =
          await navigator.serviceWorker.getRegistration();

        await registration?.update();
      }

      alert(
        "Cache eliminata. Ruta Maya verrà ricaricata.",
      );

      window.location.reload();
    } catch {
      alert(
        "Non è stato possibile eliminare la cache automaticamente.",
      );
    }
  }

  function getStatusMessage() {
    if (status === "checking") {
      return {
        text: "Controllo degli aggiornamenti in corso…",
        color: theme.colors.secondary,
      };
    }

    if (status === "available") {
      return {
        text: "È disponibile una nuova versione di Ruta Maya.",
        color: theme.colors.primary,
      };
    }

    if (status === "updated") {
      return {
        text: "Stai già utilizzando la versione più recente.",
        color: theme.colors.primary,
      };
    }

    if (status === "error") {
      return {
        text: "Non è stato possibile controllare gli aggiornamenti. Verifica la connessione.",
        color: "#FFB4A8",
      };
    }

    return null;
  }

  const statusMessage = getStatusMessage();

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
        Sistema
      </p>

      <h1
        style={{
          margin: "8px 0 6px",
          fontSize: 34,
        }}
      >
        Aggiornamenti app
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Controlla la versione installata e risolvi eventuali
        problemi di cache.
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 22,
          borderRadius: 25,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow:
            "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            opacity: 0.86,
          }}
        >
          Stato installazione
        </p>

        <strong
          style={{
            display: "block",
            marginTop: 9,
            fontSize: 26,
          }}
        >
          {isInstalled
            ? "App installata"
            : "Aperta nel browser"}
        </strong>

        <p
          style={{
            margin: "9px 0 0",
            fontSize: 13,
            lineHeight: 1.5,
            opacity: 0.85,
          }}
        >
          {isInstalled
            ? "Ruta Maya è stata aggiunta alla schermata Home."
            : "Puoi installarla dalla funzione “Aggiungi alla schermata Home” del browser."}
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 11,
          marginTop: 17,
        }}
      >
        <StatusCard
          icon="⚙️"
          label="Service worker"
          value={hasServiceWorker ? "Attivo" : "Non rilevato"}
        />

        <StatusCard
          icon={navigator.onLine ? "📶" : "📴"}
          label="Connessione"
          value={navigator.onLine ? "Online" : "Offline"}
        />
      </section>

      {statusMessage && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 16,
            background: `${statusMessage.color}18`,
            border: `1px solid ${statusMessage.color}38`,
            color: statusMessage.color,
            textAlign: "center",
            fontWeight: 750,
            lineHeight: 1.5,
          }}
        >
          {statusMessage.text}
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
          icon="🔄"
          title="Controlla aggiornamenti"
          description="Verifica se GitHub Pages ha pubblicato una nuova versione dell’app."
          buttonLabel={
            status === "checking"
              ? "Controllo in corso…"
              : "Controlla ora"
          }
          onClick={checkForUpdates}
          disabled={status === "checking"}
          primary
        />

        {status === "available" && (
          <ActionCard
            icon="⬇️"
            title="Installa aggiornamento"
            description="Applica immediatamente la nuova versione e ricarica Ruta Maya."
            buttonLabel="Aggiorna adesso"
            onClick={installAvailableUpdate}
            primary
          />
        )}

        <ActionCard
          icon="↻"
          title="Ricarica l’app"
          description="Riapre Ruta Maya senza eliminare note, budget, checklist o prenotazioni."
          buttonLabel="Ricarica"
          onClick={hardReload}
        />

        <ActionCard
          icon="🧹"
          title="Pulisci file temporanei"
          description="Elimina la cache dell’interfaccia quando continui a vedere una versione precedente."
          buttonLabel="Pulisci cache"
          onClick={clearAppCache}
          warning
        />
      </section>

      <section
        style={{
          marginTop: 25,
          padding: 20,
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
          Aggiornamenti automatici
        </h2>

        <p
          style={{
            margin: "9px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          Ogni volta che esegui un push su GitHub, il workflow
          pubblica automaticamente Ruta Maya. Il telefono può
          impiegare qualche minuto prima di sostituire i file
          memorizzati.
        </p>

        <div
          style={{
            display: "grid",
            gap: 12,
            marginTop: 17,
          }}
        >
          {[
            "Esegui il push su GitHub.",
            "Aspetta la spunta verde nella sezione Actions.",
            "Apri Aggiornamenti app.",
            "Premi Controlla aggiornamenti.",
          ].map((step, index) => (
            <div
              key={step}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 11,
              }}
            >
              <span
                style={{
                  width: 29,
                  height: 29,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  borderRadius: 10,
                  background:
                    "rgba(17,197,191,0.15)",
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
                  fontSize: 13,
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
          marginTop: 20,
          padding: 19,
          borderRadius: 21,
          background:
            "rgba(244,213,141,0.08)",
          border:
            "1px solid rgba(244,213,141,0.18)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: theme.colors.secondary,
            fontSize: 18,
          }}
        >
          Installazione su iPhone
        </h2>

        <p style={instructionStyle}>
          Safari → Condividi → Aggiungi alla schermata Home.
        </p>

        <h2
          style={{
            margin: "18px 0 0",
            color: theme.colors.secondary,
            fontSize: 18,
          }}
        >
          Installazione su Android
        </h2>

        <p style={instructionStyle}>
          Chrome → menu ⋮ → Installa app oppure Aggiungi a
          schermata Home.
        </p>
      </section>

      <p
        style={{
          margin: "22px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        La pulizia della cache non cancella i dati conservati nel
        localStorage. Per maggiore sicurezza, crea comunque un
        backup prima di interventi importanti.
      </p>
    </main>
  );
}

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <article
      style={{
        padding: 16,
        borderRadius: 19,
        background: theme.colors.card,
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>

      <span
        style={{
          display: "block",
          marginTop: 10,
          color: theme.colors.textSoft,
          fontSize: 11,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 4,
          fontSize: 15,
        }}
      >
        {value}
      </strong>
    </article>
  );
}

type ActionCardProps = {
  icon: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  warning?: boolean;
};

function ActionCard({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
  disabled = false,
  primary = false,
  warning = false,
}: ActionCardProps) {
  const buttonColor = warning
    ? "#FFB4A8"
    : theme.colors.primary;

  return (
    <article
      style={{
        padding: 19,
        borderRadius: 22,
        background: theme.colors.card,
        border:
          "1px solid rgba(255,255,255,0.08)",
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
            width: 47,
            height: 47,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            borderRadius: 16,
            background: warning
              ? "rgba(255,180,168,0.14)"
              : "rgba(17,197,191,0.15)",
            fontSize: 22,
          }}
        >
          {icon}
        </span>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
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
        disabled={disabled}
        onClick={onClick}
        style={{
          width: "100%",
          marginTop: 16,
          padding: 13,
          border: primary
            ? 0
            : `1px solid ${buttonColor}45`,
          borderRadius: 15,
          background: primary
            ? buttonColor
            : `${buttonColor}12`,
          color: primary
            ? theme.colors.background
            : buttonColor,
          fontWeight: 850,
          cursor: disabled
            ? "not-allowed"
            : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {buttonLabel}
      </button>
    </article>
  );
}

const instructionStyle = {
  margin: "8px 0 0",
  color: theme.colors.textSoft,
  fontSize: 13,
  lineHeight: 1.5,
};

export default AppSettings;