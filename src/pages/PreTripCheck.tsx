import { useEffect, useMemo, useState } from "react";
import { accommodations } from "../data/accommodations";
import { bookings } from "../data/bookings";
import { itinerary } from "../data/itinerary";
import { locations } from "../data/locations";
import { restaurants } from "../data/restaurants";
import { roadTrip } from "../data/roadTrip";
import { getPrivateTravelData } from "../utils/privateTravelData";
import { getTestDate } from "../utils/travelClock";
import { theme } from "../styles/theme";

type CheckStatus =
  | "success"
  | "warning"
  | "error"
  | "loading";

type AppCheck = {
  id: string;
  title: string;
  description: string;
  status: CheckStatus;
  detail: string;
};

const BACKUP_DATE_KEY = "ruta-maya-last-backup-date";

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

async function checkImage(path: string) {
  try {
    const response = await fetch(path, {
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

function getDaysSince(date: string) {
  const savedDate = new Date(date);

  if (Number.isNaN(savedDate.getTime())) {
    return null;
  }

  const difference =
    Date.now() - savedDate.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24),
  );
}

function PreTripCheck() {
  const [serviceWorkerActive, setServiceWorkerActive] =
    useState<boolean | null>(null);

  const [iconAvailable, setIconAvailable] =
    useState<boolean | null>(null);

  const [appleIconAvailable, setAppleIconAvailable] =
    useState<boolean | null>(null);

  const [lastCheck, setLastCheck] = useState(
    new Date().toISOString(),
  );

  const [isChecking, setIsChecking] =
    useState(false);

  async function runChecks() {
    setIsChecking(true);

    if ("serviceWorker" in navigator) {
      try {
        const registration =
          await navigator.serviceWorker.getRegistration();

        setServiceWorkerActive(
          Boolean(registration),
        );
      } catch {
        setServiceWorkerActive(false);
      }
    } else {
      setServiceWorkerActive(false);
    }

    const appIcon = await checkImage(
      `${import.meta.env.BASE_URL}ruta-maya-icon-512.png`,
    );

    const appleIcon = await checkImage(
      `${import.meta.env.BASE_URL}apple-touch-icon-v2.png`,
    );

    setIconAvailable(appIcon);
    setAppleIconAvailable(appleIcon);

    setLastCheck(new Date().toISOString());
    setIsChecking(false);
  }

  useEffect(() => {
    runChecks();
  }, []);

  const checks = useMemo<AppCheck[]>(() => {
    const localStorageAvailable = (() => {
      try {
        const testKey =
          "ruta-maya-storage-test";

        localStorage.setItem(testKey, "ok");
        localStorage.removeItem(testKey);

        return true;
      } catch {
        return false;
      }
    })();

    const invalidAccommodationUrls =
      accommodations.filter(
        (accommodation) =>
          !accommodation.url.startsWith(
            "https://",
          ),
      );

    const itineraryComplete =
      itinerary.length === 10 &&
      itinerary.every(
        (day) =>
          day.title &&
          day.date &&
          day.activities.length > 0,
      );

    const invalidLocations = locations.filter(
      (location) =>
        !Number.isFinite(location.latitude) ||
        !Number.isFinite(location.longitude),
    );

    const totalMapPlaces =
      locations.length +
      accommodations.length +
      restaurants.length;

    const activeTestDate = getTestDate();

    const privateData =
      getPrivateTravelData();

    const savedReferenceCount =
      bookings.filter((booking) =>
        Boolean(
          privateData.bookingReferences[
            booking.id
          ]?.trim(),
        ),
      ).length;

    const missingReferenceCount =
      bookings.length - savedReferenceCount;

    const lastBackupDate =
      localStorage.getItem(BACKUP_DATE_KEY);

    const backupAge = lastBackupDate
      ? getDaysSince(lastBackupDate)
      : null;

    const hasPersonalData = [
      "ruta-maya-expenses",
      "ruta-maya-people",
      "ruta-maya-packing-checklist",
      "ruta-maya-trip-notes",
      "ruta-maya-personal-contacts",
      "ruta-maya-private-travel-data",
    ].some(
      (key) =>
        localStorage.getItem(key) !== null,
    );

    return [
      {
        id: "installation",
        title: "Installazione dell’app",
        description:
          "Controlla se Ruta Maya è stata aggiunta alla schermata Home.",
        status: isStandaloneMode()
          ? "success"
          : "warning",
        detail: isStandaloneMode()
          ? "Ruta Maya è installata come app."
          : "L’app è aperta nel browser. Installala prima della partenza.",
      },
      {
        id: "service-worker",
        title: "Modalità offline",
        description:
          "Verifica la presenza del service worker della PWA.",
        status:
          serviceWorkerActive === null
            ? "loading"
            : serviceWorkerActive
              ? "success"
              : "error",
        detail:
          serviceWorkerActive === null
            ? "Controllo in corso…"
            : serviceWorkerActive
              ? "Service worker attivo."
              : "Service worker non rilevato.",
      },
      {
        id: "connection",
        title: "Connessione",
        description:
          "Verifica lo stato corrente della rete.",
        status: navigator.onLine
          ? "success"
          : "warning",
        detail: navigator.onLine
          ? "Il dispositivo è online."
          : "Il dispositivo è offline: utile per testare i dati salvati.",
      },
      {
        id: "storage",
        title: "Salvataggio locale",
        description:
          "Controlla se note, budget e codici possono essere salvati.",
        status: localStorageAvailable
          ? "success"
          : "error",
        detail: localStorageAvailable
          ? "LocalStorage funzionante."
          : "Il browser impedisce il salvataggio locale.",
      },
      {
        id: "gps",
        title: "Supporto GPS",
        description:
          "Controlla se il dispositivo supporta la geolocalizzazione.",
        status:
          "geolocation" in navigator
            ? "success"
            : "warning",
        detail:
          "geolocation" in navigator
            ? "GPS supportato dal dispositivo."
            : "Geolocalizzazione non disponibile.",
      },
      {
        id: "itinerary",
        title: "Itinerario",
        description:
          "Controlla che tutte le dieci giornate abbiano attività.",
        status: itineraryComplete
          ? "success"
          : "error",
        detail: itineraryComplete
          ? `${itinerary.length} giornate complete.`
          : "Una o più giornate risultano incomplete.",
      },
      {
        id: "accommodations",
        title: "Alloggi",
        description:
          "Controlla prenotazioni e collegamenti Airbnb.",
        status:
          accommodations.length === 6 &&
          invalidAccommodationUrls.length ===
            0
            ? "success"
            : "warning",
        detail:
          invalidAccommodationUrls.length ===
          0
            ? `${accommodations.length} alloggi con collegamento valido.`
            : `${invalidAccommodationUrls.length} collegamenti da controllare.`,
      },
      {
        id: "restaurants",
        title: "Ristoranti",
        description:
          "Controlla il numero di locali salvati.",
        status:
          restaurants.length >= 12
            ? "success"
            : "warning",
        detail: `${restaurants.length} ristoranti disponibili.`,
      },
      {
        id: "map",
        title: "Smart Map",
        description:
          "Controlla tappe, alloggi e ristoranti presenti nella mappa.",
        status:
          invalidLocations.length === 0 &&
          totalMapPlaces >= 32
            ? "success"
            : "warning",
        detail:
          invalidLocations.length === 0
            ? `${locations.length} tappe + ${accommodations.length} alloggi + ${restaurants.length} ristoranti = ${totalMapPlaces} luoghi.`
            : `${invalidLocations.length} tappe hanno coordinate non valide.`,
      },
      {
        id: "roadtrip",
        title: "Road Trip",
        description:
          "Controlla tutti gli spostamenti del viaggio.",
        status:
          roadTrip.length >= 14
            ? "success"
            : "warning",
        detail: `${roadTrip.length} tratte disponibili.`,
      },
      {
        id: "bookings",
        title: "Prenotazioni",
        description:
          "Controlla voli, traghetti, auto e assicurazione.",
        status:
          bookings.length === 9
            ? "success"
            : "warning",
        detail: `${bookings.length} prenotazioni disponibili offline.`,
      },
      {
        id: "private-references",
        title: "Codici privati",
        description:
          "Verifica che tutti i PNR e riferimenti siano salvati sul telefono.",
        status:
          missingReferenceCount === 0
            ? "success"
            : "warning",
        detail:
          missingReferenceCount === 0
            ? `Tutti i ${savedReferenceCount} codici sono salvati localmente.`
            : `${savedReferenceCount}/${bookings.length} codici salvati. Ne mancano ${missingReferenceCount}.`,
      },
      {
        id: "icon",
        title: "Icona principale",
        description:
          "Controlla il file grafico usato dalla PWA.",
        status:
          iconAvailable === null
            ? "loading"
            : iconAvailable
              ? "success"
              : "error",
        detail:
          iconAvailable === null
            ? "Controllo in corso…"
            : iconAvailable
              ? "Icona 512×512 disponibile."
              : "Icona principale non trovata.",
      },
      {
        id: "apple-icon",
        title: "Icona iPhone",
        description:
          "Controlla la Apple Touch Icon.",
        status:
          appleIconAvailable === null
            ? "loading"
            : appleIconAvailable
              ? "success"
              : "warning",
        detail:
          appleIconAvailable === null
            ? "Controllo in corso…"
            : appleIconAvailable
              ? "Apple Touch Icon disponibile."
              : "File Apple Touch Icon non trovato.",
      },
      {
        id: "personal-data",
        title: "Dati personali",
        description:
          "Controlla se sono presenti informazioni locali da proteggere.",
        status: hasPersonalData
          ? "success"
          : "warning",
        detail: hasPersonalData
          ? "Sono presenti dati personali salvati sul dispositivo."
          : "Non risultano ancora dati personali inseriti.",
      },
      {
        id: "backup",
        title: "Backup recente",
        description:
          "Controlla se è stata creata una copia dei dati locali.",
        status:
          backupAge === null
            ? "warning"
            : backupAge <= 7
              ? "success"
              : "warning",
        detail:
          backupAge === null
            ? "Non risulta ancora registrato alcun backup."
            : backupAge === 0
              ? "Backup creato oggi."
              : `Ultimo backup creato ${backupAge} giorni fa.`,
      },
      {
        id: "test-mode",
        title: "Modalità simulazione",
        description:
          "Controlla che la Home utilizzi la data reale.",
        status: activeTestDate
          ? "warning"
          : "success",
        detail: activeTestDate
          ? `Modalità test ancora attiva: ${new Date(
              `${activeTestDate}T12:00:00`,
            ).toLocaleDateString("it-IT")}.`
          : "La Home utilizza la data reale.",
      },
    ];
  }, [
    appleIconAvailable,
    iconAvailable,
    serviceWorkerActive,
    lastCheck,
  ]);

  const completedChecks = checks.filter(
    (check) =>
      check.status === "success",
  ).length;

  const warningChecks = checks.filter(
    (check) =>
      check.status === "warning",
  ).length;

  const errorChecks = checks.filter(
    (check) =>
      check.status === "error",
  ).length;

  const readiness = Math.round(
    (completedChecks / checks.length) * 100,
  );

  function getReadinessLabel() {
    if (errorChecks > 0) {
      return "Intervento necessario";
    }

    if (warningChecks > 0) {
      return "Quasi pronta";
    }

    return "Pronta per il viaggio";
  }

  async function shareReport() {
    const report = [
      "Ruta Maya – Controllo pre-partenza",
      "",
      `Prontezza: ${readiness}%`,
      `Controlli superati: ${completedChecks}`,
      `Avvisi: ${warningChecks}`,
      `Errori: ${errorChecks}`,
      "",
      ...checks.map(
        (check) =>
          `${getStatusSymbol(check.status)} ${check.title}: ${check.detail}`,
      ),
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Controllo Ruta Maya",
          text: report,
        });

        return;
      }

      await navigator.clipboard.writeText(
        report,
      );

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
        Collaudo finale
      </p>

      <h1
        style={{
          margin: "8px 0 6px",
          fontSize: 34,
        }}
      >
        Controllo pre-partenza
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Verifica che Ruta Maya sia pronta per essere usata in
        Messico.
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 23,
          borderRadius: 27,
          background:
            errorChecks > 0
              ? "linear-gradient(135deg, #AD3C52, #5A1F35)"
              : "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow:
            "0 20px 45px rgba(0,0,0,0.26)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 850,
            letterSpacing: 1,
            textTransform: "uppercase",
            opacity: 0.86,
          }}
        >
          Stato generale
        </p>

        <strong
          style={{
            display: "block",
            marginTop: 9,
            fontSize: 29,
          }}
        >
          {getReadinessLabel()}
        </strong>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent:
              "space-between",
            gap: 20,
            marginTop: 18,
          }}
        >
          <div>
            <strong
              style={{
                display: "block",
                fontSize: 48,
                lineHeight: 1,
              }}
            >
              {readiness}%
            </strong>

            <span
              style={{
                display: "block",
                marginTop: 6,
                fontSize: 13,
                opacity: 0.82,
              }}
            >
              livello di preparazione
            </span>
          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <strong>{completedChecks}</strong>

            <span
              style={{
                display: "block",
                marginTop: 4,
                fontSize: 12,
                opacity: 0.8,
              }}
            >
              su {checks.length} superati
            </span>
          </div>
        </div>

        <div
          style={{
            height: 9,
            marginTop: 19,
            overflow: "hidden",
            borderRadius: 999,
            background:
              "rgba(7,26,46,0.28)",
          }}
        >
          <div
            style={{
              width: `${readiness}%`,
              height: "100%",
              borderRadius: 999,
              background:
                theme.colors.secondary,
              transition:
                "width 350ms ease",
            }}
          />
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: 9,
          marginTop: 14,
        }}
      >
        <SummaryCard
          value={completedChecks}
          label="superati"
          color={theme.colors.primary}
        />

        <SummaryCard
          value={warningChecks}
          label="avvisi"
          color={theme.colors.secondary}
        />

        <SummaryCard
          value={errorChecks}
          label="errori"
          color="#FF8E8E"
        />
      </div>

      <section
        style={{
          display: "grid",
          gap: 11,
          marginTop: 23,
        }}
      >
        {checks.map((check) => (
          <article
            key={check.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 13,
              padding: 16,
              borderRadius: 20,
              background:
                theme.colors.card,
              border: `1px solid ${getStatusColor(
                check.status,
              )}35`,
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
                background: `${getStatusColor(
                  check.status,
                )}18`,
                color: getStatusColor(
                  check.status,
                ),
                fontSize: 19,
                fontWeight: 900,
              }}
            >
              {getStatusSymbol(
                check.status,
              )}
            </span>

            <div style={{ flex: 1 }}>
              <strong
                style={{
                  display: "block",
                  fontSize: 16,
                }}
              >
                {check.title}
              </strong>

              <p
                style={{
                  margin: "5px 0 0",
                  color:
                    theme.colors.textSoft,
                  fontSize: 12,
                  lineHeight: 1.45,
                }}
              >
                {check.description}
              </p>

              <p
                style={{
                  margin: "8px 0 0",
                  color: getStatusColor(
                    check.status,
                  ),
                  fontSize: 13,
                  fontWeight: 750,
                  lineHeight: 1.45,
                }}
              >
                {check.detail}
              </p>
            </div>
          </article>
        ))}
      </section>

      <button
        type="button"
        disabled={isChecking}
        onClick={runChecks}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 14,
          border: 0,
          borderRadius: 17,
          background:
            theme.colors.primary,
          color:
            theme.colors.background,
          fontWeight: 850,
          cursor: isChecking
            ? "not-allowed"
            : "pointer",
          opacity: isChecking
            ? 0.65
            : 1,
        }}
      >
        {isChecking
          ? "Controllo in corso…"
          : "Ripeti controllo"}
      </button>

      <button
        type="button"
        onClick={shareReport}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 14,
          border:
            "1px solid rgba(255,255,255,0.13)",
          borderRadius: 17,
          background:
            theme.colors.card,
          color: theme.colors.text,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Condividi rapporto
      </button>

      <p
        style={{
          margin: "15px 4px 0",
          color:
            theme.colors.textSoft,
          fontSize: 12,
          textAlign: "center",
        }}
      >
        Ultimo controllo:{" "}
        {new Date(
          lastCheck,
        ).toLocaleString("it-IT")}
      </p>
    </main>
  );
}

function getStatusColor(
  status: CheckStatus,
) {
  if (status === "success") {
    return theme.colors.primary;
  }

  if (status === "warning") {
    return theme.colors.secondary;
  }

  if (status === "error") {
    return "#FF8E8E";
  }

  return theme.colors.textSoft;
}

function getStatusSymbol(
  status: CheckStatus,
) {
  if (status === "success") {
    return "✓";
  }

  if (status === "warning") {
    return "!";
  }

  if (status === "error") {
    return "×";
  }

  return "…";
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
        padding: "14px 7px",
        borderRadius: 17,
        background:
          theme.colors.card,
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
          marginTop: 4,
          color:
            theme.colors.textSoft,
          fontSize: 10,
        }}
      >
        {label}
      </span>
    </article>
  );
}

export default PreTripCheck;