import CurrentActionWidget from "../components/CurrentActionWidget";
import UpcomingBooking from "../components/UpcomingBooking";
import type { Tab } from "../components/BottomNavigation";
import { accommodations } from "../data/accommodations";
import { itinerary } from "../data/itinerary";
import { restaurants } from "../data/restaurants";
import { theme } from "../styles/theme";
import { getAppDate } from "../utils/travelClock";
import { getTravelerProfile } from "../utils/travelerProfile";

type HomeProps = {
  onNavigate: (tab: Tab) => void;
};

type TripStatus = "before" | "during" | "after";

const TRIP_START = new Date("2026-08-06T00:00:00");
const TRIP_END = new Date("2026-08-15T23:59:59");

function normalizeDate(date: Date) {
  const normalized = new Date(date);

  normalized.setHours(0, 0, 0, 0);

  return normalized;
}

function getDaysDifference(
  firstDate: Date,
  secondDate: Date,
) {
  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  return Math.floor(
    (normalizeDate(firstDate).getTime() -
      normalizeDate(secondDate).getTime()) /
      millisecondsPerDay,
  );
}

function getTripStatus(today: Date): TripStatus {
  if (today < TRIP_START) {
    return "before";
  }

  if (today > TRIP_END) {
    return "after";
  }

  return "during";
}

function getCurrentDayIndex(today: Date) {
  const difference = getDaysDifference(
    today,
    TRIP_START,
  );

  return Math.min(
    Math.max(difference, 0),
    itinerary.length - 1,
  );
}

function getAccommodationForDay(
  dayNumber: number,
) {
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

  const location =
    overnightLocations[dayNumber];

  return accommodations.find(
    (accommodation) =>
      accommodation.location === location,
  );
}

function getRestaurantsForLocation(
  location?: string,
) {
  if (!location) {
    return [];
  }

  const normalizedLocation = location
    .toLocaleLowerCase("it")
    .replace("isla ", "");

  return restaurants.filter((restaurant) => {
    const normalizedCity = restaurant.city
      .toLocaleLowerCase("it")
      .replace("isla ", "");

    return (
      normalizedCity.includes(
        normalizedLocation,
      ) ||
      normalizedLocation.includes(
        normalizedCity,
      )
    );
  });
}

function formatToday(date: Date) {
  return date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function Home({ onNavigate }: HomeProps) {
  const today = getAppDate();
  const traveler = getTravelerProfile();
  const tripStatus = getTripStatus(today);

  const currentDayIndex =
    tripStatus === "during"
      ? getCurrentDayIndex(today)
      : 0;

  const currentDay =
    itinerary[currentDayIndex];

  const daysUntilDeparture = Math.max(
    0,
    getDaysDifference(
      TRIP_START,
      today,
    ),
  );

  const currentAccommodation =
    getAccommodationForDay(currentDay.day);

  const suggestedRestaurant =
    getRestaurantsForLocation(
      currentDay.overnight,
    )[0];

  const progress =
    tripStatus === "before"
      ? 0
      : tripStatus === "after"
        ? 100
        : Math.round(
            ((currentDayIndex + 1) /
              itinerary.length) *
              100,
          );

  function getHeroEyebrow() {
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
      return "Dieci giorni attraverso lo Yucatán";
    }

    if (tripStatus === "during") {
      return currentDay.title;
    }

    return "Hasta luego, Yucatán";
  }

  function getStatusText() {
    if (tripStatus === "before") {
      return `${daysUntilDeparture} ${
        daysUntilDeparture === 1
          ? "giorno"
          : "giorni"
      } alla partenza`;
    }

    if (tripStatus === "during") {
      return formatToday(today);
    }

    return "06–15 agosto 2026";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding:
          "calc(22px + env(safe-area-inset-top)) 18px 116px",
        background: `
          radial-gradient(
            circle at 92% 4%,
            rgba(17, 197, 191, 0.21),
            transparent 27%
          ),
          radial-gradient(
            circle at 8% 42%,
            rgba(72, 184, 232, 0.07),
            transparent 28%
          ),
          linear-gradient(
            180deg,
            ${theme.colors.background} 0%,
            ${theme.colors.backgroundGradient} 100%
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
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1.7,
              textTransform: "uppercase",
            }}
          >
            Yucatán 2026
          </p>

          <h1
            style={{
              margin: "6px 0 0",
              fontSize: 33,
              lineHeight: 1,
              letterSpacing: -1.1,
            }}
          >
            {traveler
              ? `Ciao, ${traveler}`
              : "Ruta Maya"}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: theme.colors.textSoft,
              fontSize: 13,
            }}
          >
            {traveler
              ? "Il tuo travel companion"
              : "Travel companion del gruppo"}
          </p>
        </div>

        <div
          style={{
            width: 58,
            height: 58,
            overflow: "hidden",
            flexShrink: 0,
            borderRadius: 19,
            border:
              "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 15px 34px rgba(0,0,0,0.29)",
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}ruta-maya-icon-192.png`}
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </header>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: 25,
          padding: 23,
          borderRadius: 29,
          background:
            "linear-gradient(140deg, rgba(17,197,191,0.98) 0%, rgba(14,102,126,0.97) 48%, rgba(8,48,78,0.98) 100%)",
          border:
            "1px solid rgba(255,255,255,0.13)",
          boxShadow:
            "0 25px 54px rgba(0,0,0,0.30)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -54,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.10)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 25,
            bottom: -75,
            width: 155,
            height: 155,
            borderRadius: "50%",
            border:
              "1px solid rgba(255,255,255,0.13)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            style={{
              padding: "6px 9px",
              borderRadius: 999,
              background:
                "rgba(7,26,46,0.24)",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 0.7,
              textTransform: "uppercase",
            }}
          >
            {getHeroEyebrow()}
          </span>

          <span
            style={{
              color:
                "rgba(255,255,255,0.72)",
              fontSize: 11,
              fontWeight: 750,
            }}
          >
            {getStatusText()}
          </span>
        </div>

        <h2
          style={{
            position: "relative",
            maxWidth: 315,
            margin: "20px 0 0",
            fontSize: 31,
            lineHeight: 1.12,
            letterSpacing: -0.8,
          }}
        >
          {getHeroTitle()}
        </h2>

        {tripStatus === "before" && (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              marginTop: 22,
            }}
          >
            <strong
              style={{
                fontSize: 48,
                lineHeight: 0.9,
                letterSpacing: -1.8,
              }}
            >
              {daysUntilDeparture}
            </strong>

            <span
              style={{
                paddingBottom: 3,
                color:
                  "rgba(255,255,255,0.75)",
                fontSize: 13,
                lineHeight: 1.3,
              }}
            >
              giorni
              <br />
              alla partenza
            </span>
          </div>
        )}

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: 8,
            marginTop: 24,
          }}
        >
          <HeroStat
            value="5"
            label="amici"
            icon="👥"
          />

          <HeroStat
            value="10"
            label="giorni"
            icon="🗓️"
          />

          <HeroStat
            value="32"
            label="luoghi"
            icon="📍"
          />
        </div>

        <div
          style={{
            position: "relative",
            height: 6,
            marginTop: 20,
            overflow: "hidden",
            borderRadius: 999,
            background:
              "rgba(7,26,46,0.25)",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, #FFFFFF, #F4D58D)",
              transition:
                "width 450ms ease",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 8,
            color:
              "rgba(255,255,255,0.64)",
            fontSize: 10,
            fontWeight: 750,
          }}
        >
          <span>
            {tripStatus === "before"
              ? "Preparazione"
              : tripStatus === "during"
                ? `Giorno ${currentDay.day}`
                : "Completato"}
          </span>

          <span>{progress}%</span>
        </div>
      </section>

      <CurrentActionWidget />

      <UpcomingBooking />

      <section
        style={{
          marginTop: 25,
        }}
      >
        <SectionTitle
          eyebrow={
            tripStatus === "during"
              ? "Oggi"
              : "Prima tappa"
          }
          title={currentDay.title}
          trailing={`Giorno ${currentDay.day}`}
        />

        <article
          style={{
            marginTop: 13,
            overflow: "hidden",
            borderRadius: 24,
            background:
              "rgba(255,255,255,0.075)",
            border:
              "1px solid rgba(255,255,255,0.09)",
            boxShadow:
              "0 14px 32px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              padding: "18px 18px 15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <InfoPill
                text={`📅 ${currentDay.date}`}
              />

              {currentDay.overnight && (
                <InfoPill
                  text={`🛏️ ${currentDay.overnight}`}
                />
              )}

              <InfoPill
                text={`📋 ${currentDay.activities.length} attività`}
              />
            </div>

            <div
              style={{
                display: "grid",
                gap: 11,
                marginTop: 17,
              }}
            >
              {currentDay.activities
                .slice(0, 4)
                .map((activity, index) => (
                  <div
                    key={activity}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "28px 1fr",
                      alignItems: "start",
                      gap: 11,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 10,
                        background:
                          "rgba(17,197,191,0.14)",
                        color:
                          theme.colors.primary,
                        fontSize: 11,
                        fontWeight: 900,
                      }}
                    >
                      {index + 1}
                    </span>

                    <span
                      style={{
                        paddingTop: 4,
                        color:
                          theme.colors.textSoft,
                        fontSize: 13,
                        lineHeight: 1.48,
                      }}
                    >
                      {activity}
                    </span>
                  </div>
                ))}
            </div>

            {currentDay.activities.length >
              4 && (
              <p
                style={{
                  margin: "14px 0 0 39px",
                  color:
                    theme.colors.primary,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                +
                {currentDay.activities.length -
                  4}{" "}
                altre attività
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate("itinerary")
            }
            style={{
              width: "100%",
              padding: 14,
              border: 0,
              borderTop:
                "1px solid rgba(255,255,255,0.08)",
              background:
                "rgba(17,197,191,0.10)",
              color: theme.colors.primary,
              fontSize: 13,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Apri itinerario completo
          </button>
        </article>
      </section>

      {(currentAccommodation ||
        suggestedRestaurant) && (
        <section
          style={{
            marginTop: 26,
          }}
        >
          <SectionTitle
            eyebrow="Per la giornata"
            title="Dormi e mangia"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                currentAccommodation &&
                suggestedRestaurant
                  ? "1fr 1fr"
                  : "1fr",
              gap: 11,
              marginTop: 13,
            }}
          >
            {currentAccommodation && (
              <a
                href={
                  currentAccommodation.url
                }
                target="_blank"
                rel="noreferrer"
                style={{
                  ...featureCardStyle,
                  border:
                    "1px solid rgba(255,184,107,0.20)",
                }}
              >
                <span
                  style={{
                    ...featureIconStyle,
                    background:
                      "rgba(255,184,107,0.14)",
                  }}
                >
                  🏨
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: 14,
                    color: "#FFB86B",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 0.7,
                    textTransform: "uppercase",
                  }}
                >
                  Alloggio
                </span>

                <strong
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: theme.colors.text,
                    fontSize: 17,
                    lineHeight: 1.25,
                  }}
                >
                  {
                    currentAccommodation.location
                  }
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: 7,
                    color:
                      theme.colors.textSoft,
                    fontSize: 11,
                    lineHeight: 1.4,
                  }}
                >
                  {
                    currentAccommodation.nights
                  }
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: 14,
                    color: "#FFB86B",
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  Apri Airbnb →
                </span>
              </a>
            )}

            {suggestedRestaurant && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  suggestedRestaurant.mapsQuery,
                )}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  ...featureCardStyle,
                  border:
                    "1px solid rgba(255,142,142,0.20)",
                }}
              >
                <span
                  style={{
                    ...featureIconStyle,
                    background:
                      "rgba(255,142,142,0.13)",
                  }}
                >
                  🍽️
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: 14,
                    color: "#FF9D9D",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 0.7,
                    textTransform: "uppercase",
                  }}
                >
                  Ristorante
                </span>

                <strong
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: theme.colors.text,
                    fontSize: 17,
                    lineHeight: 1.25,
                  }}
                >
                  {
                    suggestedRestaurant.name
                  }
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: 7,
                    color:
                      theme.colors.textSoft,
                    fontSize: 11,
                    lineHeight: 1.4,
                  }}
                >
                  {
                    suggestedRestaurant.category
                  }{" "}
                  ·{" "}
                  {
                    suggestedRestaurant.price
                  }
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: 14,
                    color: "#FF9D9D",
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  Apri la mappa →
                </span>
              </a>
            )}
          </div>
        </section>
      )}

      <section
        style={{
          marginTop: 27,
        }}
      >
        <SectionTitle
          eyebrow="Navigazione"
          title="Accessi rapidi"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 11,
            marginTop: 13,
          }}
        >
          <QuickAction
            icon="🗺️"
            title="Smart Map"
            subtitle="32 luoghi salvati"
            accent="#6ED4FF"
            onClick={() =>
              onNavigate("map")
            }
          />

          <QuickAction
            icon="📅"
            title="Itinerario"
            subtitle="10 giornate"
            accent={theme.colors.primary}
            onClick={() =>
              onNavigate("itinerary")
            }
          />

          <QuickAction
            icon="💰"
            title="Budget"
            subtitle="Spese del gruppo"
            accent="#F4D58D"
            onClick={() =>
              onNavigate("budget")
            }
          />

          <QuickAction
            icon="✦"
            title="Tutti gli strumenti"
            subtitle="Agenda, SOS e altro"
            accent="#C3A8FF"
            onClick={() =>
              onNavigate("more")
            }
          />
        </div>
      </section>

      <section
        style={{
          marginTop: 27,
          padding: 20,
          borderRadius: 24,
          background:
            "rgba(255,255,255,0.055)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <SectionTitle
          eyebrow="Ruta Maya"
          title="Il viaggio in numeri"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 1fr)",
            gap: 6,
            marginTop: 17,
          }}
        >
          <CompactStat
            value={itinerary.length}
            label="giorni"
          />

          <CompactStat
            value={accommodations.length}
            label="alloggi"
          />

          <CompactStat
            value={restaurants.length}
            label="locali"
          />

          <CompactStat
            value={32}
            label="luoghi"
          />
        </div>
      </section>
    </main>
  );
}

function HeroStat({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string;
}) {
  return (
    <div
      style={{
        padding: "11px 8px",
        borderRadius: 16,
        background:
          "rgba(7,26,46,0.23)",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 16,
        }}
      >
        {icon}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 5,
          fontSize: 16,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 2,
          color:
            "rgba(255,255,255,0.64)",
          fontSize: 9,
          fontWeight: 750,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  trailing,
}: {
  eyebrow: string;
  title: string;
  trailing?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 15,
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: theme.colors.primary,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </p>

        <h2
          style={{
            margin: "5px 0 0",
            fontSize: 22,
            lineHeight: 1.2,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </h2>
      </div>

      {trailing && (
        <span
          style={{
            padding: "6px 9px",
            borderRadius: 999,
            background:
              "rgba(17,197,191,0.12)",
            color: theme.colors.primary,
            fontSize: 10,
            fontWeight: 850,
          }}
        >
          {trailing}
        </span>
      )}
    </div>
  );
}

function InfoPill({
  text,
}: {
  text: string;
}) {
  return (
    <span
      style={{
        padding: "7px 9px",
        borderRadius: 999,
        background:
          "rgba(255,255,255,0.055)",
        color: theme.colors.textSoft,
        fontSize: 10,
        fontWeight: 750,
      }}
    >
      {text}
    </span>
  );
}

type QuickActionProps = {
  icon: string;
  title: string;
  subtitle: string;
  accent: string;
  onClick: () => void;
};

function QuickAction({
  icon,
  title,
  subtitle,
  accent,
  onClick,
}: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 142,
        padding: 17,
        border: `1px solid ${accent}24`,
        borderRadius: 22,
        background:
          "rgba(255,255,255,0.065)",
        color: theme.colors.text,
        textAlign: "left",
        cursor: "pointer",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.12)",
      }}
    >
      <span
        style={{
          width: 43,
          height: 43,
          display: "grid",
          placeItems: "center",
          borderRadius: 14,
          background: `${accent}18`,
          fontSize: 21,
        }}
      >
        {icon}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 16,
          fontSize: 16,
          lineHeight: 1.25,
        }}
      >
        {title}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 5,
          color: theme.colors.textSoft,
          fontSize: 11,
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </span>
    </button>
  );
}

function CompactStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        padding: "12px 4px",
        borderRadius: 15,
        background:
          "rgba(255,255,255,0.045)",
        textAlign: "center",
      }}
    >
      <strong
        style={{
          display: "block",
          color: theme.colors.primary,
          fontSize: 20,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 4,
          color: theme.colors.textSoft,
          fontSize: 9,
        }}
      >
        {label}
      </span>
    </div>
  );
}

const featureCardStyle = {
  minWidth: 0,
  padding: 17,
  borderRadius: 22,
  background:
    "rgba(255,255,255,0.065)",
  textDecoration: "none",
  boxShadow:
    "0 11px 28px rgba(0,0,0,0.13)",
};

const featureIconStyle = {
  width: 43,
  height: 43,
  display: "grid",
  placeItems: "center",
  borderRadius: 14,
  fontSize: 21,
};

export default Home;