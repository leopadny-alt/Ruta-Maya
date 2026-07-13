import type { ReactNode } from "react";
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

  function getProgressLabel() {
    if (tripStatus === "before") {
      return "Preparazione";
    }

    if (tripStatus === "during") {
      return `Giorno ${currentDay.day}`;
    }

    return "Completato";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding:
          "calc(21px + env(safe-area-inset-top)) 18px calc(152px + env(safe-area-inset-bottom))",
        background: `
          radial-gradient(
            circle at 92% 4%,
            rgba(32, 206, 198, 0.18),
            transparent 27%
          ),
          radial-gradient(
            circle at 8% 43%,
            rgba(116, 215, 255, 0.07),
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
              fontSize: theme.typography.eyebrow,
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
              fontSize: theme.typography.display,
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
              fontSize: theme.typography.body,
              lineHeight: 1.4,
            }}
          >
            {traveler
              ? "Il tuo travel companion"
              : "Travel companion del gruppo"}
          </p>
        </div>

        <div
          style={{
            width: 56,
            height: 56,
            overflow: "hidden",
            flexShrink: 0,
            borderRadius: 18,
            border:
              `1px solid ${theme.colors.borderStrong}`,
            boxShadow: theme.shadows.card,
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
          marginTop: 22,
          padding: 20,
          borderRadius: theme.radius.xl,
          background:
            "linear-gradient(140deg, rgba(32,206,198,0.98) 0%, rgba(14,103,127,0.97) 50%, rgba(8,48,78,0.99) 100%)",
          border:
            "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 24px 52px rgba(0,0,0,0.29)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -56,
            right: -48,
            width: 170,
            height: 170,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.095)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 18,
            bottom: -84,
            width: 155,
            height: 155,
            borderRadius: "50%",
            border:
              "1px solid rgba(255,255,255,0.12)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <span
            style={{
              padding: "6px 9px",
              borderRadius: theme.radius.pill,
              background:
                "rgba(5,27,43,0.25)",
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
                "rgba(255,255,255,0.78)",
              fontSize: 11,
              fontWeight: 800,
              textAlign: "right",
            }}
          >
            {getStatusText()}
          </span>
        </div>

        <h2
          style={{
            position: "relative",
            maxWidth: 310,
            margin: "17px 0 0",
            fontSize: 29,
            lineHeight: 1.08,
            letterSpacing: -0.75,
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
              marginTop: 16,
            }}
          >
            <strong
              style={{
                fontSize: 44,
                lineHeight: 0.9,
                letterSpacing: -1.8,
              }}
            >
              {daysUntilDeparture}
            </strong>

            <span
              style={{
                paddingBottom: 2,
                color:
                  "rgba(255,255,255,0.78)",
                fontSize: 13,
                lineHeight: 1.25,
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
              "repeat(3, minmax(0, 1fr))",
            gap: 8,
            marginTop: 19,
          }}
        >
          <HeroStat
            value="5"
            label="amici"
            icon={<GroupIcon />}
          />

          <HeroStat
            value="10"
            label="giorni"
            icon={<CalendarSmallIcon />}
          />

          <HeroStat
            value="32"
            label="luoghi"
            icon={<PinIcon />}
          />
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 18,
            padding: 12,
            borderRadius: 16,
            background:
              "rgba(4,28,46,0.20)",
            border:
              "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 8,
              color:
                "rgba(255,255,255,0.75)",
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            <span>{getProgressLabel()}</span>
            <span>{progress}%</span>
          </div>

          <div
            style={{
              height: 8,
              overflow: "hidden",
              borderRadius: theme.radius.pill,
              background:
                "rgba(3,23,38,0.32)",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                minWidth:
                  progress > 0
                    ? 8
                    : 0,
                height: "100%",
                borderRadius:
                  theme.radius.pill,
                background:
                  "linear-gradient(90deg, #FFFFFF, #F6D990)",
                boxShadow:
                  progress > 0
                    ? "0 0 14px rgba(255,255,255,0.28)"
                    : "none",
                transition:
                  "width 450ms ease",
              }}
            />
          </div>
        </div>
      </section>

      <CurrentActionWidget />

      <UpcomingBooking />

      <section
        style={{
          marginTop: 24,
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
              theme.colors.cardSoft,
            border:
              `1px solid ${theme.colors.border}`,
            boxShadow:
              theme.shadows.soft,
          }}
        >
          <div
            style={{
              padding: "17px 17px 15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 7,
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
                gap: 10,
                marginTop: 16,
              }}
            >
              {currentDay.activities
                .slice(0, 3)
                .map((activity, index) => (
                  <div
                    key={activity}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "30px 1fr",
                      alignItems: "start",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 10,
                        background:
                          theme.colors.primarySoft,
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
                        fontSize: 14,
                        lineHeight: 1.48,
                      }}
                    >
                      {activity}
                    </span>
                  </div>
                ))}
            </div>

            {currentDay.activities.length >
              3 && (
              <p
                style={{
                  margin: "13px 0 0 40px",
                  color:
                    theme.colors.primary,
                  fontSize: 11,
                  fontWeight: 850,
                }}
              >
                +
                {currentDay.activities.length -
                  3}{" "}
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
              padding: 15,
              border: 0,
              borderTop:
                `1px solid ${theme.colors.border}`,
              background:
                theme.colors.primarySoft,
              color:
                theme.colors.primary,
              fontSize: 13,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Apri itinerario completo
          </button>
        </article>
      </section>

      {tripStatus === "during" &&
        (currentAccommodation ||
          suggestedRestaurant) && (
        <section
          style={{
            marginTop: 25,
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
                    "1px solid rgba(255,190,114,0.22)",
                }}
              >
                <span
                  style={{
                    ...featureIconStyle,
                    background:
                      "rgba(255,190,114,0.14)",
                  }}
                >
                  🏨
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: 14,
                    color:
                      theme.colors.warning,
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
                    color:
                      theme.colors.text,
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
                    fontSize: 12,
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
                    color:
                      theme.colors.warning,
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
                    "1px solid rgba(255,155,155,0.22)",
                }}
              >
                <span
                  style={{
                    ...featureIconStyle,
                    background:
                      "rgba(255,155,155,0.13)",
                  }}
                >
                  🍽️
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: 14,
                    color:
                      theme.colors.danger,
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
                    color:
                      theme.colors.text,
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
                    fontSize: 12,
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
                    color:
                      theme.colors.danger,
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

      {tripStatus === "after" && (
        <section
          style={{
            marginTop: 27,
            padding: 20,
            borderRadius: 24,
            background:
              theme.colors.cardSoft,
            border:
              `1px solid ${theme.colors.border}`,
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
      )}
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
  icon: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "10px 7px",
        borderRadius: 16,
        background:
          "rgba(5,28,45,0.23)",
        border:
          "1px solid rgba(255,255,255,0.055)",
        textAlign: "center",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          display: "grid",
          placeItems: "center",
          margin: "0 auto",
          color:
            "rgba(255,255,255,0.78)",
        }}
      >
        {icon}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 4,
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
            "rgba(255,255,255,0.66)",
          fontSize: 9,
          fontWeight: 800,
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
            color:
              theme.colors.primary,
            fontSize:
              theme.typography.eyebrow,
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
            fontSize:
              theme.typography.title,
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
            borderRadius:
              theme.radius.pill,
            background:
              theme.colors.primarySoft,
            color:
              theme.colors.primary,
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
        borderRadius:
          theme.radius.pill,
        background:
          "rgba(255,255,255,0.055)",
        color:
          theme.colors.textSoft,
        fontSize: 10,
        fontWeight: 750,
      }}
    >
      {text}
    </span>
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
          color:
            theme.colors.primary,
          fontSize: 20,
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
          fontSize: 9,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function IconBase({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function GroupIcon() {
  return (
    <IconBase>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  );
}

function CalendarSmallIcon() {
  return (
    <IconBase>
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
      />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
    </IconBase>
  );
}

function PinIcon() {
  return (
    <IconBase>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

const featureCardStyle = {
  minWidth: 0,
  padding: 17,
  borderRadius: 22,
  background:
    theme.colors.cardSoft,
  textDecoration: "none",
  boxShadow:
    theme.shadows.soft,
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