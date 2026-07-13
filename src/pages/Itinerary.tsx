import {
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { accommodations } from "../data/accommodations";
import { itinerary } from "../data/itinerary";
import { roadTrip } from "../data/roadTrip";
import { theme } from "../styles/theme";
import { getAppDate } from "../utils/travelClock";

function getAccommodation(location?: string) {
  if (!location) {
    return undefined;
  }

  return accommodations.find(
    (accommodation) =>
      accommodation.location
        .toLocaleLowerCase("it")
        .replace("isla ", "") ===
      location
        .toLocaleLowerCase("it")
        .replace("isla ", ""),
  );
}

function getRoadTripLegs(date: string) {
  return roadTrip.filter(
    (leg) => leg.day === date,
  );
}

function getGoogleMapsSearchUrl(
  query: string,
) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

function getCurrentTripDay() {
  const today = getAppDate();
  const start =
    new Date("2026-08-06T00:00:00");
  const end =
    new Date("2026-08-15T23:59:59");

  if (today < start || today > end) {
    return undefined;
  }

  const normalizedToday =
    new Date(today);
  const normalizedStart =
    new Date(start);

  normalizedToday.setHours(0, 0, 0, 0);
  normalizedStart.setHours(0, 0, 0, 0);

  const difference = Math.floor(
    (normalizedToday.getTime() -
      normalizedStart.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return difference + 1;
}

function Itinerary() {
  const currentTripDay =
    getCurrentTripDay();

  const [expandedDay, setExpandedDay] =
    useState<number | null>(
      currentTripDay ?? 1,
    );

  const [
    expandedRoadLegs,
    setExpandedRoadLegs,
  ] = useState<number[]>([]);

  function toggleDay(day: number) {
    setExpandedDay((currentDay) =>
      currentDay === day
        ? null
        : day,
    );
  }

  function toggleRoadLeg(id: number) {
    setExpandedRoadLegs(
      (currentIds) =>
        currentIds.includes(id)
          ? currentIds.filter(
              (currentId) =>
                currentId !== id,
            )
          : [...currentIds, id],
    );
  }

  function openNextDay(index: number) {
    const nextDay =
      itinerary[index + 1];

    if (!nextDay) {
      return;
    }

    setExpandedDay(nextDay.day);

    window.setTimeout(() => {
      document
        .getElementById(
          `trip-day-${nextDay.day}`,
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 80);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding:
          "calc(21px + env(safe-area-inset-top)) 18px calc(160px + env(safe-area-inset-bottom))",
        background: `
          radial-gradient(
            circle at 94% 4%,
            rgba(246,217,144,0.11),
            transparent 27%
          ),
          radial-gradient(
            circle at 5% 42%,
            rgba(32,206,198,0.08),
            transparent 26%
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
      <header>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent:
              "space-between",
            gap: 16,
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
                letterSpacing: 1.6,
                textTransform:
                  "uppercase",
              }}
            >
              06–15 agosto 2026
            </p>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize:
                  theme.typography.display,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              Itinerario
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                maxWidth: 300,
                color:
                  theme.colors.textSoft,
                fontSize:
                  theme.typography.body,
                lineHeight: 1.5,
              }}
            >
              Dieci giornate attraverso lo Yucatán.
            </p>
          </div>

          <div
            aria-hidden="true"
            style={{
              width: 54,
              height: 54,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(246,217,144,0.20), rgba(32,206,198,0.14))",
              border:
                `1px solid ${theme.colors.borderStrong}`,
              boxShadow:
                theme.shadows.card,
              color:
                theme.colors.secondary,
            }}
          >
            <CalendarIcon size={26} />
          </div>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: 8,
            marginTop: 20,
          }}
        >
          <SummaryCard
            value="10"
            label="giorni"
          />
          <SummaryCard
            value="14"
            label="tratte"
          />
          <SummaryCard
            value="6"
            label="alloggi"
          />
        </section>
      </header>

      <section
        style={{
          position: "relative",
          display: "grid",
          gap: 11,
          marginTop: 24,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            zIndex: 0,
            top: 27,
            bottom: 27,
            left: 42,
            width: 2,
            borderRadius: 999,
            background:
              "linear-gradient(180deg, rgba(32,206,198,0.46), rgba(32,206,198,0.10))",
            transform:
              "translateX(-50%)",
          }}
        />

        {itinerary.map(
          (tripDay, index) => {
            const isExpanded =
              expandedDay ===
              tripDay.day;

            const isCurrent =
              currentTripDay ===
              tripDay.day;

            const accommodation =
              getAccommodation(
                tripDay.overnight,
              );

            const dailyRoadTrip =
              getRoadTripLegs(
                tripDay.date,
              );

            return (
              <article
                id={`trip-day-${tripDay.day}`}
                key={tripDay.day}
                style={{
                  position: "relative",
                  zIndex: 1,
                  overflow: "hidden",
                  borderRadius: 23,
                  background: isCurrent
                    ? "linear-gradient(145deg, rgba(32,206,198,0.12), rgba(255,255,255,0.04)), #0A2238"
                    : "linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)), #0A2238",
                  border: isCurrent
                    ? "1px solid rgba(32,206,198,0.32)"
                    : isExpanded
                      ? `1px solid ${theme.colors.borderStrong}`
                      : `1px solid ${theme.colors.border}`,
                  boxShadow: isCurrent
                    ? theme.shadows.card
                    : theme.shadows.soft,
                  scrollMarginTop: 20,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleDay(
                      tripDay.day,
                    )
                  }
                  aria-expanded={
                    isExpanded
                  }
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns:
                      "54px 1fr auto",
                    alignItems: "center",
                    gap: 13,
                    padding: 15,
                    border: 0,
                    background:
                      "transparent",
                    color:
                      theme.colors.text,
                    textAlign: "left",
                    cursor: "pointer",
                    WebkitTapHighlightColor:
                      "transparent",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: 54,
                      height: 54,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 17,
                      background:
                        isExpanded ||
                        isCurrent
                          ? theme.colors
                              .primary
                          : theme.colors
                              .backgroundElevated,
                      border:
                        isExpanded ||
                        isCurrent
                          ? "1px solid rgba(255,255,255,0.14)"
                          : "2px solid rgba(32,206,198,0.34)",
                      color:
                        isExpanded ||
                        isCurrent
                          ? theme.colors
                              .background
                          : theme.colors
                              .primary,
                      boxShadow:
                        isExpanded ||
                        isCurrent
                          ? "0 10px 24px rgba(32,206,198,0.18)"
                          : "none",
                      fontSize: 19,
                      fontWeight: 950,
                    }}
                  >
                    {tripDay.day}
                  </span>

                  <span
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        flexWrap: "wrap",
                        gap: 7,
                      }}
                    >
                      <span
                        style={{
                          color:
                            theme.colors
                              .secondary,
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: 0.8,
                          textTransform:
                            "uppercase",
                        }}
                      >
                        {tripDay.date}
                      </span>

                      {isCurrent && (
                        <span
                          style={{
                            padding:
                              "4px 6px",
                            borderRadius:
                              theme.radius
                                .pill,
                            background:
                              theme.colors
                                .primarySoft,
                            color:
                              theme.colors
                                .primary,
                            fontSize: 8,
                            fontWeight: 950,
                            textTransform:
                              "uppercase",
                          }}
                        >
                          Oggi
                        </span>
                      )}
                    </span>

                    <strong
                      style={{
                        display: "block",
                        marginTop: 5,
                        fontSize: 17,
                        lineHeight: 1.3,
                      }}
                    >
                      {tripDay.title}
                    </strong>

                    <span
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        flexWrap: "wrap",
                        gap: 7,
                        marginTop: 6,
                        color:
                          theme.colors
                            .textSoft,
                        fontSize: 11,
                      }}
                    >
                      {tripDay.overnight ? (
                        <>
                          <BedIcon
                            size={14}
                          />
                          {
                            tripDay.overnight
                          }
                        </>
                      ) : (
                        <>
                          <PlaneIcon
                            size={14}
                          />
                          Rientro
                        </>
                      )}

                      <span
                        aria-hidden="true"
                        style={{
                          width: 3,
                          height: 3,
                          borderRadius:
                            "50%",
                          background:
                            theme.colors
                              .textMuted,
                        }}
                      />

                      {
                        tripDay.activities
                          .length
                      }{" "}
                      attività
                    </span>
                  </span>

                  <span
                    style={{
                      display: "grid",
                      placeItems: "center",
                      color:
                        theme.colors
                          .primary,
                      transform:
                        isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition:
                        "transform 180ms ease",
                    }}
                  >
                    <ChevronDownIcon />
                  </span>
                </button>

                {isExpanded && (
                  <div
                    style={{
                      padding:
                        "0 15px 17px",
                    }}
                  >
                    <div
                      style={{
                        paddingTop: 16,
                        borderTop:
                          `1px solid ${theme.colors.border}`,
                      }}
                    >
                      <SectionTitle
                        eyebrow="Programma"
                        title="La giornata"
                      />

                      <div
                        style={{
                          display: "grid",
                          gap: 0,
                          marginTop: 15,
                        }}
                      >
                        {tripDay.activities.map(
                          (
                            activity,
                            activityIndex,
                          ) => (
                            <div
                              key={activity}
                              style={{
                                position:
                                  "relative",
                                display:
                                  "grid",
                                gridTemplateColumns:
                                  "31px 1fr",
                                gap: 10,
                                paddingBottom:
                                  activityIndex ===
                                  tripDay
                                    .activities
                                    .length -
                                    1
                                    ? 0
                                    : 15,
                              }}
                            >
                              {activityIndex <
                                tripDay
                                  .activities
                                  .length -
                                  1 && (
                                <span
                                  aria-hidden="true"
                                  style={{
                                    position:
                                      "absolute",
                                    top: 27,
                                    bottom: 0,
                                    left: 15,
                                    width: 1,
                                    background:
                                      "rgba(32,206,198,0.20)",
                                  }}
                                />
                              )}

                              <span
                                style={{
                                  position:
                                    "relative",
                                  zIndex: 1,
                                  width: 31,
                                  height: 31,
                                  display:
                                    "grid",
                                  placeItems:
                                    "center",
                                  borderRadius: 10,
                                  background:
                                    theme.colors
                                      .primarySoft,
                                  color:
                                    theme.colors
                                      .primary,
                                  fontSize: 10,
                                  fontWeight: 950,
                                }}
                              >
                                {activityIndex +
                                  1}
                              </span>

                              <span
                                style={{
                                  paddingTop: 5,
                                  color:
                                    theme.colors
                                      .textSoft,
                                  fontSize: 14,
                                  lineHeight: 1.48,
                                }}
                              >
                                {activity}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {dailyRoadTrip.length >
                      0 && (
                      <div
                        style={{
                          marginTop: 23,
                        }}
                      >
                        <SectionTitle
                          eyebrow="On the road"
                          title="Spostamenti"
                        />

                        <div
                          style={{
                            display:
                              "grid",
                            gap: 10,
                            marginTop: 13,
                          }}
                        >
                          {dailyRoadTrip.map(
                            (leg) => {
                              const isRoadLegExpanded =
                                expandedRoadLegs.includes(
                                  leg.id,
                                );

                              return (
                                <div
                                  key={leg.id}
                                  style={{
                                    padding: 14,
                                    borderRadius: 18,
                                    background:
                                      "rgba(116,215,255,0.065)",
                                    border:
                                      "1px solid rgba(116,215,255,0.15)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display:
                                        "grid",
                                      gridTemplateColumns:
                                        "38px 1fr",
                                      alignItems:
                                        "center",
                                      gap: 10,
                                    }}
                                  >
                                    <span
                                      aria-hidden="true"
                                      style={{
                                        width: 38,
                                        height: 38,
                                        display:
                                          "grid",
                                        placeItems:
                                          "center",
                                        borderRadius: 12,
                                        background:
                                          "rgba(116,215,255,0.12)",
                                        color:
                                          theme.colors
                                            .info,
                                      }}
                                    >
                                      <TransportIcon
                                        transport={
                                          leg.transport
                                        }
                                      />
                                    </span>

                                    <strong
                                      style={{
                                        fontSize: 14,
                                        lineHeight: 1.35,
                                      }}
                                    >
                                      {leg.from} →{" "}
                                      {leg.to}
                                    </strong>
                                  </div>

                                  <div
                                    style={{
                                      display:
                                        "flex",
                                      flexWrap:
                                        "wrap",
                                      gap: 6,
                                      marginTop: 11,
                                    }}
                                  >
                                    <DetailPill
                                      icon={
                                        <ClockIcon />
                                      }
                                      text={
                                        leg.duration
                                      }
                                    />
                                    <DetailPill
                                      icon={
                                        <RouteIcon />
                                      }
                                      text={
                                        leg.distance
                                      }
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleRoadLeg(
                                        leg.id,
                                      )
                                    }
                                    aria-expanded={
                                      isRoadLegExpanded
                                    }
                                    style={{
                                      width: "100%",
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      justifyContent:
                                        "center",
                                      gap: 7,
                                      marginTop: 10,
                                      padding:
                                        "9px 10px",
                                      border:
                                        `1px solid ${theme.colors.border}`,
                                      borderRadius: 12,
                                      background:
                                        "rgba(255,255,255,0.035)",
                                      color:
                                        theme.colors
                                          .textSoft,
                                      fontSize: 10,
                                      fontWeight: 850,
                                      cursor:
                                        "pointer",
                                    }}
                                  >
                                    {
                                      isRoadLegExpanded
                                        ? "Nascondi info"
                                        : "Info percorso"
                                    }
                                    <span
                                      style={{
                                        display:
                                          "grid",
                                        placeItems:
                                          "center",
                                        transform:
                                          isRoadLegExpanded
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                        transition:
                                          "transform 180ms ease",
                                      }}
                                    >
                                      <ChevronDownIcon
                                        size={14}
                                      />
                                    </span>
                                  </button>

                                  {isRoadLegExpanded && (
                                    <p
                                      style={{
                                        margin:
                                          "11px 0 0",
                                        color:
                                          theme.colors
                                            .textSoft,
                                        fontSize: 12,
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      {leg.notes}
                                    </p>
                                  )}

                                  <a
                                    href={getGoogleMapsSearchUrl(
                                      leg.mapsQuery,
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      minHeight: 43,
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      justifyContent:
                                        "center",
                                      gap: 8,
                                      marginTop: 12,
                                      padding:
                                        "10px 12px",
                                      boxSizing:
                                        "border-box",
                                      borderRadius: 13,
                                      background:
                                        "rgba(116,215,255,0.13)",
                                      border:
                                        "1px solid rgba(116,215,255,0.20)",
                                      color:
                                        theme.colors
                                          .info,
                                      textAlign:
                                        "center",
                                      textDecoration:
                                        "none",
                                      fontSize: 12,
                                      fontWeight: 900,
                                    }}
                                  >
                                    <NavigationIcon />
                                    Apri percorso
                                  </a>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}

                    {accommodation && (
                      <div
                        style={{
                          marginTop: 23,
                        }}
                      >
                        <SectionTitle
                          eyebrow="Questa notte"
                          title="Alloggio"
                        />

                        <div
                          style={{
                            marginTop: 13,
                            padding: 15,
                            borderRadius: 18,
                            background:
                              "rgba(255,190,114,0.065)",
                            border:
                              "1px solid rgba(255,190,114,0.16)",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 8,
                              color:
                                theme.colors
                                  .warning,
                              fontSize: 10,
                              fontWeight: 900,
                              letterSpacing: 0.7,
                              textTransform:
                                "uppercase",
                            }}
                          >
                            <BedIcon />
                            Pernottamento
                          </div>

                          <strong
                            style={{
                              display: "block",
                              marginTop: 8,
                              fontSize: 17,
                            }}
                          >
                            {
                              accommodation.location
                            }
                          </strong>

                          <p
                            style={{
                              margin:
                                "7px 0 0",
                              color:
                                theme.colors
                                  .textSoft,
                              fontSize: 12,
                              lineHeight: 1.45,
                            }}
                          >
                            {
                              accommodation.dates
                            }{" "}
                            ·{" "}
                            {
                              accommodation.nights
                            }
                          </p>

                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "1fr 1fr",
                              gap: 8,
                              marginTop: 13,
                            }}
                          >
                            <a
                              href={
                                accommodation.url
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                ...smallLinkStyle,
                                background:
                                  theme.colors
                                    .warning,
                              }}
                            >
                              <ExternalLinkIcon />
                              Airbnb
                            </a>

                            <a
                              href={getGoogleMapsSearchUrl(
                                accommodation.location,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                ...smallLinkStyle,
                                background:
                                  theme.colors
                                    .primary,
                              }}
                            >
                              <NavigationIcon />
                              Maps
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          index <
                          itinerary.length -
                            1
                            ? "1fr 1fr"
                            : "1fr",
                        gap: 8,
                        marginTop: 20,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDay(
                            null,
                          )
                        }
                        style={secondaryButtonStyle}
                      >
                        <ChevronUpIcon />
                        Chiudi
                      </button>

                      {index <
                        itinerary.length -
                          1 && (
                        <button
                          type="button"
                          onClick={() =>
                            openNextDay(
                              index,
                            )
                          }
                          style={secondaryButtonStyle}
                        >
                          Giorno successivo
                          <ArrowDownIcon />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          },
        )}
      </section>
    </main>
  );
}

function SummaryCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      style={{
        padding: "11px 7px",
        borderRadius: 16,
        background:
          theme.colors.cardSoft,
        border:
          `1px solid ${theme.colors.border}`,
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
          marginTop: 3,
          color:
            theme.colors.textSoft,
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
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          color:
            theme.colors.primary,
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </p>

      <h3
        style={{
          margin: "5px 0 0",
          fontSize: 17,
          lineHeight: 1.25,
        }}
      >
        {title}
      </h3>
    </div>
  );
}

function DetailPill({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 8px",
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
      {icon}
      {text}
    </span>
  );
}

function TransportIcon({
  transport,
}: {
  transport: string;
}) {
  if (
    transport === "Traghetto"
  ) {
    return <ShipIcon />;
  }

  if (
    transport ===
    "Auto + traghetto"
  ) {
    return <CompassIcon />;
  }

  return <CarIcon />;
}

type IconProps = {
  size?: number;
};

function IconBase({
  children,
  size = 18,
}: IconProps & {
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
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

function CalendarIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
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

function BedIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="M3 19v-8" />
      <path d="M21 19v-6a3 3 0 0 0-3-3H7a4 4 0 0 0-4 4" />
      <path d="M3 16h18" />
      <path d="M7 10V7h5a3 3 0 0 1 3 3" />
    </IconBase>
  );
}

function PlaneIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="M22 2 9.5 14.5" />
      <path d="m22 2-7 20-4-8-8-4Z" />
    </IconBase>
  );
}

function ShipIcon() {
  return (
    <IconBase size={20}>
      <path d="M4 13 12 5l8 8" />
      <path d="M6 13h12l-2 6H8Z" />
      <path d="M3 21c2-1 4-1 6 0 2-1 4-1 6 0 2-1 4-1 6 0" />
    </IconBase>
  );
}

function CompassIcon() {
  return (
    <IconBase size={20}>
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8Z" />
    </IconBase>
  );
}

function CarIcon() {
  return (
    <IconBase size={20}>
      <path d="m5 17-1-5 2-5h12l2 5-1 5" />
      <path d="M3 14h18" />
      <circle
        cx="7"
        cy="17"
        r="2"
      />
      <circle
        cx="17"
        cy="17"
        r="2"
      />
    </IconBase>
  );
}

function ClockIcon() {
  return (
    <IconBase size={14}>
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

function RouteIcon() {
  return (
    <IconBase size={14}>
      <circle
        cx="6"
        cy="17"
        r="2"
      />
      <circle
        cx="18"
        cy="7"
        r="2"
      />
      <path d="M8 17c5 0 3-10 8-10" />
    </IconBase>
  );
}

function NavigationIcon() {
  return (
    <IconBase size={15}>
      <path d="m3.5 11 17-8-8 17-1.9-7.1Z" />
    </IconBase>
  );
}

function ExternalLinkIcon() {
  return (
    <IconBase size={15}>
      <path d="M14 5h5v5" />
      <path d="m19 5-8 8" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </IconBase>
  );
}

function ChevronDownIcon({
  size = 18,
}: IconProps) {
  return (
    <IconBase size={size}>
      <path d="m7 10 5 5 5-5" />
    </IconBase>
  );
}

function ChevronUpIcon() {
  return (
    <IconBase size={15}>
      <path d="m7 14 5-5 5 5" />
    </IconBase>
  );
}

function ArrowDownIcon() {
  return (
    <IconBase size={15}>
      <path d="M12 4v16" />
      <path d="m6 14 6 6 6-6" />
    </IconBase>
  );
}

const smallLinkStyle: CSSProperties = {
  minHeight: 42,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: "10px",
  boxSizing: "border-box",
  borderRadius: 13,
  color: theme.colors.background,
  textAlign: "center",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 900,
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: 43,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: "11px 12px",
  border:
    `1px solid ${theme.colors.border}`,
  borderRadius: 14,
  background:
    "rgba(255,255,255,0.035)",
  color: theme.colors.textSoft,
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};

export default Itinerary;