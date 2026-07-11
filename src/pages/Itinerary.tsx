import { useState } from "react";
import { accommodations } from "../data/accommodations";
import { itinerary } from "../data/itinerary";
import { roadTrip } from "../data/roadTrip";
import { theme } from "../styles/theme";

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
  return roadTrip.filter((leg) => leg.day === date);
}

function getGoogleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

function Itinerary() {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const expandedCount = expandedDays.length;

  function toggleDay(day: number) {
    setExpandedDays((currentDays) => {
      if (currentDays.includes(day)) {
        return currentDays.filter(
          (expandedDay) => expandedDay !== day,
        );
      }

      return [...currentDays, day];
    });
  }

  function expandAll() {
    setExpandedDays(itinerary.map((tripDay) => tripDay.day));
  }

  function closeAll() {
    setExpandedDays([]);
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
        06–15 agosto 2026
      </p>

      <h1
        style={{
          margin: "8px 0 6px",
          fontSize: 34,
        }}
      >
        Itinerario
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Dieci giornate tra mare, siti Maya, cenote e città.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginTop: 23,
        }}
      >
        <SummaryCard value="10" label="giorni" />
        <SummaryCard value="6" label="alloggi" />
        <SummaryCard value="5" label="amici" />
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 17,
        }}
      >
        <button
          type="button"
          onClick={expandAll}
          disabled={expandedCount === itinerary.length}
          style={{
            ...controlButtonStyle,
            background:
              expandedCount === itinerary.length
                ? "rgba(255,255,255,0.05)"
                : "rgba(17,197,191,0.15)",
            color:
              expandedCount === itinerary.length
                ? theme.colors.textSoft
                : theme.colors.primary,
          }}
        >
          Espandi tutto
        </button>

        <button
          type="button"
          onClick={closeAll}
          disabled={expandedCount === 0}
          style={{
            ...controlButtonStyle,
            opacity: expandedCount === 0 ? 0.55 : 1,
          }}
        >
          Chiudi tutto
        </button>
      </div>

      <section
        style={{
          display: "grid",
          gap: 14,
          marginTop: 21,
        }}
      >
        {itinerary.map((tripDay, index) => {
          const isExpanded = expandedDays.includes(tripDay.day);
          const accommodation = getAccommodation(
            tripDay.overnight,
          );
          const dailyRoadTrip = getRoadTripLegs(tripDay.date);

          return (
            <article
              key={tripDay.day}
              style={{
                overflow: "hidden",
                borderRadius: 23,
                background: theme.colors.card,
                border: isExpanded
                  ? "1px solid rgba(17,197,191,0.28)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: isExpanded
                  ? "0 14px 35px rgba(0,0,0,0.18)"
                  : "none",
              }}
            >
              <button
                type="button"
                onClick={() => toggleDay(tripDay.day)}
                aria-expanded={isExpanded}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 18,
                  border: 0,
                  background: "transparent",
                  color: theme.colors.text,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 51,
                    height: 51,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 17,
                    background: isExpanded
                      ? theme.colors.primary
                      : "rgba(17,197,191,0.15)",
                    color: isExpanded
                      ? theme.colors.background
                      : theme.colors.primary,
                    fontSize: 19,
                    fontWeight: 900,
                  }}
                >
                  {tripDay.day}
                </span>

                <span style={{ flex: 1 }}>
                  <span
                    style={{
                      display: "block",
                      color: theme.colors.secondary,
                      fontSize: 12,
                      fontWeight: 850,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                    }}
                  >
                    {tripDay.date}
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: 5,
                      fontSize: 18,
                      lineHeight: 1.3,
                    }}
                  >
                    {tripDay.title}
                  </strong>

                  {tripDay.overnight && (
                    <span
                      style={{
                        display: "block",
                        marginTop: 5,
                        color: theme.colors.textSoft,
                        fontSize: 12,
                      }}
                    >
                      🛏️ Notte a {tripDay.overnight}
                    </span>
                  )}
                </span>

                <span
                  style={{
                    color: theme.colors.primary,
                    fontSize: 25,
                    transform: isExpanded
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 200ms ease",
                  }}
                >
                  ›
                </span>
              </button>

              {isExpanded && (
                <div
                  style={{
                    padding: "0 18px 19px",
                  }}
                >
                  <div
                    style={{
                      paddingTop: 17,
                      borderTop:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <SectionTitle
                      icon="📋"
                      title="Programma della giornata"
                    />

                    <div
                      style={{
                        display: "grid",
                        gap: 10,
                        marginTop: 13,
                      }}
                    >
                      {tripDay.activities.map(
                        (activity, activityIndex) => (
                          <div
                            key={activity}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 11,
                              padding: 12,
                              borderRadius: 15,
                              background:
                                "rgba(255,255,255,0.055)",
                            }}
                          >
                            <span
                              style={{
                                width: 25,
                                height: 25,
                                display: "grid",
                                placeItems: "center",
                                flexShrink: 0,
                                borderRadius: 8,
                                background:
                                  "rgba(17,197,191,0.15)",
                                color: theme.colors.primary,
                                fontSize: 11,
                                fontWeight: 900,
                              }}
                            >
                              {activityIndex + 1}
                            </span>

                            <span
                              style={{
                                color: theme.colors.textSoft,
                                lineHeight: 1.45,
                                fontSize: 14,
                              }}
                            >
                              {activity}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {dailyRoadTrip.length > 0 && (
                    <div style={{ marginTop: 21 }}>
                      <SectionTitle
                        icon="🚗"
                        title="Spostamenti"
                      />

                      <div
                        style={{
                          display: "grid",
                          gap: 10,
                          marginTop: 13,
                        }}
                      >
                        {dailyRoadTrip.map((leg) => (
                          <div
                            key={leg.id}
                            style={{
                              padding: 14,
                              borderRadius: 16,
                              background:
                                "rgba(72,184,232,0.09)",
                              border:
                                "1px solid rgba(72,184,232,0.15)",
                            }}
                          >
                            <strong
                              style={{
                                display: "block",
                                fontSize: 15,
                              }}
                            >
                              {leg.from} → {leg.to}
                            </strong>

                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 7,
                                marginTop: 9,
                              }}
                            >
                              <DetailPill
                                text={`⏱️ ${leg.duration}`}
                              />

                              <DetailPill
                                text={`📏 ${leg.distance}`}
                              />

                              <DetailPill
                                text={leg.transport}
                              />
                            </div>

                            <p
                              style={{
                                margin: "11px 0 0",
                                color: theme.colors.textSoft,
                                fontSize: 13,
                                lineHeight: 1.45,
                              }}
                            >
                              {leg.notes}
                            </p>

                            <a
                              href={getGoogleMapsSearchUrl(
                                leg.mapsQuery,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "block",
                                marginTop: 12,
                                padding: "11px 12px",
                                borderRadius: 13,
                                background:
                                  "rgba(72,184,232,0.18)",
                                color: "#6ED4FF",
                                textAlign: "center",
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 850,
                              }}
                            >
                              Apri percorso
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {accommodation && (
                    <div style={{ marginTop: 21 }}>
                      <SectionTitle
                        icon="🏨"
                        title="Alloggio"
                      />

                      <div
                        style={{
                          marginTop: 13,
                          padding: 15,
                          borderRadius: 17,
                          background:
                            "rgba(255,184,107,0.09)",
                          border:
                            "1px solid rgba(255,184,107,0.17)",
                        }}
                      >
                        <strong
                          style={{
                            display: "block",
                            color: "#FFB86B",
                            fontSize: 16,
                          }}
                        >
                          {accommodation.location}
                        </strong>

                        <p
                          style={{
                            margin: "7px 0 0",
                            color: theme.colors.textSoft,
                            fontSize: 13,
                          }}
                        >
                          {accommodation.dates} ·{" "}
                          {accommodation.nights}
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 8,
                            marginTop: 13,
                          }}
                        >
                          <a
                            href={accommodation.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              ...smallLinkStyle,
                              background: "#FFB86B",
                            }}
                          >
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
                                theme.colors.primary,
                            }}
                          >
                            Google Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <a
                    href={getGoogleMapsSearchUrl(tripDay.title)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      marginTop: 20,
                      padding: "13px 15px",
                      borderRadius: 15,
                      background:
                        "rgba(17,197,191,0.14)",
                      border:
                        "1px solid rgba(17,197,191,0.24)",
                      color: theme.colors.primary,
                      textAlign: "center",
                      textDecoration: "none",
                      fontWeight: 850,
                    }}
                  >
                    Apri la destinazione in Google Maps
                  </a>

                  {index < itinerary.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedDays((currentDays) => [
                          ...new Set([
                            ...currentDays,
                            itinerary[index + 1].day,
                          ]),
                        ]);

                        window.setTimeout(() => {
                          document
                            .getElementById(
                              `trip-day-${itinerary[index + 1].day}`,
                            )
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }, 50);
                      }}
                      style={{
                        width: "100%",
                        marginTop: 10,
                        padding: "12px 14px",
                        border:
                          "1px solid rgba(255,255,255,0.11)",
                        borderRadius: 15,
                        background: "transparent",
                        color: theme.colors.textSoft,
                        fontWeight: 750,
                        cursor: "pointer",
                      }}
                    >
                      Giorno successivo ↓
                    </button>
                  )}
                </div>
              )}

              <div
                id={`trip-day-${tripDay.day}`}
                style={{
                  position: "relative",
                  top: -20,
                }}
              />
            </article>
          );
        })}
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
    <article
      style={{
        padding: "15px 8px",
        borderRadius: 18,
        background: theme.colors.card,
        border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}
    >
      <strong
        style={{
          display: "block",
          fontSize: 23,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 4,
          color: theme.colors.textSoft,
          fontSize: 11,
        }}
      >
        {label}
      </span>
    </article>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <h3
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        margin: 0,
        fontSize: 17,
      }}
    >
      <span>{icon}</span>
      <span>{title}</span>
    </h3>
  );
}

function DetailPill({ text }: { text: string }) {
  return (
    <span
      style={{
        padding: "7px 9px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.07)",
        color: theme.colors.textSoft,
        fontSize: 11,
        fontWeight: 750,
      }}
    >
      {text}
    </span>
  );
}

const controlButtonStyle = {
  padding: "12px 13px",
  border: "1px solid rgba(255,255,255,0.11)",
  borderRadius: 15,
  background: theme.colors.card,
  color: theme.colors.text,
  fontWeight: 800,
  cursor: "pointer",
};

const smallLinkStyle = {
  padding: "11px 10px",
  borderRadius: 13,
  color: theme.colors.background,
  textAlign: "center" as const,
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

export default Itinerary;