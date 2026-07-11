import type { Tab } from "../components/BottomNavigation";
import { accommodations } from "../data/accommodations";
import { itinerary } from "../data/itinerary";
import { restaurants } from "../data/restaurants";
import { theme } from "../styles/theme";
import { getAppDate } from "../utils/travelClock";

type HomeProps = {
  onNavigate: (tab: Tab) => void;
};

const TRIP_START = new Date("2026-08-06T00:00:00");
const TRIP_END = new Date("2026-08-15T23:59:59");

function normalizeDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function getDaysDifference(firstDate: Date, secondDate: Date) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.floor(
    (normalizeDate(firstDate).getTime() -
      normalizeDate(secondDate).getTime()) /
      millisecondsPerDay,
  );
}

function getTripStatus(today: Date) {
  if (today < TRIP_START) {
    return "before";
  }

  if (today > TRIP_END) {
    return "after";
  }

  return "during";
}

function getCurrentDayIndex(today: Date) {
  const difference = getDaysDifference(today, TRIP_START);

  return Math.min(
    Math.max(difference, 0),
    itinerary.length - 1,
  );
}

function getAccommodationForDay(dayNumber: number) {
  const overnightLocations: Record<
    number,
    string | undefined
  > = {
    1: "Isla Mujeres",
    2: "Isla Mujeres",
    3: "Tulum",
    4: "Valladolid",
    5: "Valladolid",
    6: "Mérida",
    7: "Mérida",
    8: "Isla Holbox",
    9: "Cancún",
    10: undefined,
  };

  const location = overnightLocations[dayNumber];

  return accommodations.find(
    (accommodation) => accommodation.location === location,
  );
}

function getRestaurantsForLocation(location?: string) {
  if (!location) {
    return [];
  }

  return restaurants.filter((restaurant) => {
    const normalizedCity = restaurant.city
      .toLocaleLowerCase("it")
      .replace("isla ", "");

    const normalizedLocation = location
      .toLocaleLowerCase("it")
      .replace("isla ", "");

    return (
      normalizedCity.includes(normalizedLocation) ||
      normalizedLocation.includes(normalizedCity)
    );
  });
}

function Home({ onNavigate }: HomeProps) {
  const today = getAppDate();
  const tripStatus = getTripStatus(today);

  const currentDayIndex =
    tripStatus === "during"
      ? getCurrentDayIndex(today)
      : 0;

  const currentDay = itinerary[currentDayIndex];

  const daysUntilDeparture = Math.max(
    0,
    getDaysDifference(TRIP_START, today),
  );

  const currentAccommodation = getAccommodationForDay(
    currentDay.day,
  );

  const suggestedRestaurant = getRestaurantsForLocation(
    currentDay.overnight,
  )[0];

  const progress =
    tripStatus === "before"
      ? 0
      : tripStatus === "after"
        ? 100
        : Math.round(
            ((currentDayIndex + 1) / itinerary.length) * 100,
          );

  function getHeroLabel() {
    if (tripStatus === "before") {
      return "La vostra avventura si avvicina";
    }

    if (tripStatus === "during") {
      return `Giorno ${currentDay.day} di ${itinerary.length}`;
    }

    return "Viaggio completato";
  }

  function getHeroTitle() {
    if (tripStatus === "before") {
      return "10 giorni attraverso lo Yucatán";
    }

    if (tripStatus === "during") {
      return currentDay.title;
    }

    return "Hasta luego, Yucatán";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "24px 20px 112px",
        background: `
          radial-gradient(
            circle at top right,
            rgba(17,197,191,0.24),
            transparent 34%
          ),
          linear-gradient(
            180deg,
            ${theme.colors.background},
            ${theme.colors.backgroundGradient}
          )
        `,
        color: theme.colors.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: theme.colors.primary,
              fontSize: 13,
              fontWeight: 850,
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
          >
            Travel companion
          </p>

          <h1
            style={{
              margin: "6px 0 0",
              fontSize: 36,
              lineHeight: 1,
            }}
          >
            Ruta Maya
          </h1>
        </div>

        <div
          style={{
            width: 54,
            height: 54,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            borderRadius: 18,
            background: theme.colors.primary,
            color: theme.colors.background,
            fontSize: 27,
            boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
          }}
        >
          🏛️
        </div>
      </header>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: 28,
          padding: 24,
          borderRadius: 28,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow: "0 22px 50px rgba(0,0,0,0.28)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            right: -55,
            bottom: -75,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
          }}
        />

        <p
          style={{
            position: "relative",
            margin: 0,
            fontSize: 14,
            fontWeight: 750,
            opacity: 0.88,
          }}
        >
          {getHeroLabel()}
        </p>

        <h2
          style={{
            position: "relative",
            margin: "10px 0 0",
            maxWidth: 310,
            fontSize: 29,
            lineHeight: 1.15,
          }}
        >
          {getHeroTitle()}
        </h2>

        {tripStatus === "before" && (
          <div
            style={{
              position: "relative",
              marginTop: 22,
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 42,
                lineHeight: 1,
              }}
            >
              {daysUntilDeparture}
            </strong>

            <span
              style={{
                display: "block",
                marginTop: 6,
                fontSize: 14,
                opacity: 0.86,
              }}
            >
              giorni alla partenza
            </span>
          </div>
        )}

        <div
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            gap: 9,
            marginTop: 22,
          }}
        >
          {["👥 5 amici", "🚗 Road trip", "🇲🇽 Messico"].map(
            (item) => (
              <span
                key={item}
                style={{
                  padding: "9px 12px",
                  borderRadius: 999,
                  background: "rgba(7,26,46,0.27)",
                  fontSize: 13,
                  fontWeight: 750,
                }}
              >
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 19,
          borderRadius: 22,
          background: theme.colors.card,
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: theme.colors.textSoft,
                fontSize: 13,
              }}
            >
              Avanzamento del viaggio
            </p>

            <strong
              style={{
                display: "block",
                marginTop: 5,
                fontSize: 18,
              }}
            >
              {progress}%
            </strong>
          </div>

          <span
            style={{
              color: theme.colors.primary,
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {tripStatus === "before"
              ? "In preparazione"
              : tripStatus === "during"
                ? `Giorno ${currentDay.day}`
                : "Completato"}
          </span>
        </div>

        <div
          style={{
            height: 8,
            marginTop: 15,
            overflow: "hidden",
            borderRadius: 999,
            background: "rgba(255,255,255,0.10)",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 999,
              background: theme.colors.primary,
              transition: "width 500ms ease",
            }}
          />
        </div>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 21,
          borderRadius: 24,
          background: theme.colors.card,
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: theme.colors.secondary,
            fontSize: 13,
            fontWeight: 850,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {tripStatus === "during"
            ? "Programma di oggi"
            : "Prima giornata"}
        </p>

        <h2
          style={{
            margin: "10px 0 5px",
            fontSize: 23,
          }}
        >
          {currentDay.title}
        </h2>

        <p
          style={{
            margin: 0,
            color: theme.colors.textSoft,
          }}
        >
          {currentDay.date}
          {currentDay.overnight
            ? ` · Notte a ${currentDay.overnight}`
            : ""}
        </p>

        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {currentDay.activities.map((activity) => (
            <p
              key={activity}
              style={{
                display: "flex",
                gap: 10,
                margin: "10px 0",
                color: theme.colors.textSoft,
                lineHeight: 1.45,
              }}
            >
              <span style={{ color: theme.colors.primary }}>
                ●
              </span>

              <span>{activity}</span>
            </p>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onNavigate("itinerary")}
          style={fullWidthButtonStyle}
        >
          Apri itinerario completo
        </button>
      </section>

      {currentAccommodation && (
        <section
          style={{
            marginTop: 18,
            padding: 20,
            borderRadius: 23,
            background: theme.colors.card,
            border: "1px solid rgba(255,184,107,0.25)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#FFB86B",
              fontSize: 13,
              fontWeight: 850,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            🏨 Dove dormite
          </p>

          <h2
            style={{
              margin: "10px 0 5px",
              fontSize: 21,
            }}
          >
            {currentAccommodation.location}
          </h2>

          <p
            style={{
              margin: 0,
              color: theme.colors.textSoft,
            }}
          >
            {currentAccommodation.dates} ·{" "}
            {currentAccommodation.nights}
          </p>

          <a
            href={currentAccommodation.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              marginTop: 16,
              padding: "13px 15px",
              borderRadius: 15,
              background: "#FFB86B",
              color: theme.colors.background,
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 850,
            }}
          >
            Apri Airbnb
          </a>
        </section>
      )}

      {suggestedRestaurant && (
        <section
          style={{
            marginTop: 18,
            padding: 20,
            borderRadius: 23,
            background: theme.colors.card,
            border: "1px solid rgba(255,142,142,0.25)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#FF8E8E",
              fontSize: 13,
              fontWeight: 850,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            🍽️ Suggerimento food
          </p>

          <h2
            style={{
              margin: "10px 0 5px",
              fontSize: 21,
            }}
          >
            {suggestedRestaurant.name}
          </h2>

          <p
            style={{
              margin: 0,
              color: theme.colors.textSoft,
            }}
          >
            {suggestedRestaurant.category} ·{" "}
            {suggestedRestaurant.price}
          </p>

          <p
            style={{
              margin: "11px 0 0",
              color: theme.colors.textSoft,
              lineHeight: 1.5,
            }}
          >
            {suggestedRestaurant.description}
          </p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              suggestedRestaurant.mapsQuery,
            )}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              marginTop: 16,
              padding: "13px 15px",
              borderRadius: 15,
              background: "#FF8E8E",
              color: theme.colors.background,
              textAlign: "center",
              textDecoration: "none",
              fontWeight: 850,
            }}
          >
            Apri in Google Maps
          </a>
        </section>
      )}

      <section style={{ marginTop: 25 }}>
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: 21,
          }}
        >
          Accessi rapidi
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <QuickAction
            icon="🗺️"
            title="Smart Map"
            subtitle="32 luoghi"
            onClick={() => onNavigate("map")}
          />

          <QuickAction
            icon="📅"
            title="Itinerario"
            subtitle="10 giornate"
            onClick={() => onNavigate("itinerary")}
          />

          <QuickAction
            icon="💰"
            title="Budget"
            subtitle="Spese del gruppo"
            onClick={() => onNavigate("budget")}
          />

          <QuickAction
            icon="☰"
            title="Tutti gli strumenti"
            subtitle="Meteo, note e altro"
            onClick={() => onNavigate("more")}
          />
        </div>
      </section>

      <section style={{ marginTop: 25 }}>
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: 21,
          }}
        >
          Il viaggio in numeri
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {[
            ["🗓️", itinerary.length, "giorni"],
            ["🏨", accommodations.length, "alloggi"],
            ["🍽️", restaurants.length, "ristoranti"],
            ["📍", 32, "luoghi in mappa"],
          ].map(([icon, value, label]) => (
            <article
              key={String(label)}
              style={{
                padding: 17,
                borderRadius: 20,
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontSize: 23 }}>{icon}</span>

              <strong
                style={{
                  display: "block",
                  marginTop: 12,
                  fontSize: 25,
                }}
              >
                {value}
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 3,
                  color: theme.colors.textSoft,
                  fontSize: 13,
                }}
              >
                {label}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

type QuickActionProps = {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
};

function QuickAction({
  icon,
  title,
  subtitle,
  onClick,
}: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: 17,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        background: "rgba(255,255,255,0.09)",
        color: theme.colors.text,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>

      <strong
        style={{
          display: "block",
          marginTop: 12,
          fontSize: 16,
        }}
      >
        {title}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 4,
          color: theme.colors.textSoft,
          fontSize: 12,
        }}
      >
        {subtitle}
      </span>
    </button>
  );
}

const fullWidthButtonStyle = {
  width: "100%",
  marginTop: 17,
  padding: "13px 15px",
  border: "1px solid rgba(17,197,191,0.25)",
  borderRadius: 15,
  background: "rgba(17,197,191,0.14)",
  color: theme.colors.primary,
  fontWeight: 850,
  cursor: "pointer",
};

export default Home;