import { useState } from "react";
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
  return roadTrip.filter((leg) => leg.day === date);
}

function getGoogleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

function getCurrentTripDay() {
  const today = getAppDate();
  const start = new Date("2026-08-06T00:00:00");
  const end = new Date("2026-08-15T23:59:59");

  if (today < start || today > end) {
    return undefined;
  }

  const normalizedToday = new Date(today);
  const normalizedStart = new Date(start);

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
  const currentTripDay = getCurrentTripDay();

  const [expandedDay, setExpandedDay] = useState<number | null>(
    currentTripDay ?? 1,
  );

  const [expandedRoadLegs, setExpandedRoadLegs] =
    useState<number[]>([]);

  function toggleDay(day: number) {
    setExpandedDay((currentDay) =>
      currentDay === day ? null : day,
    );
  }

  function toggleRoadLeg(id: number) {
    setExpandedRoadLegs((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter(
            (currentId) => currentId !== id,
          )
        : [...currentIds, id],
    );
  }

  function openNextDay(index: number) {
    const nextDay = itinerary[index + 1];

    if (!nextDay) {
      return;
    }

    setExpandedDay(nextDay.day);

    window.setTimeout(() => {
      document
        .getElementById(`trip-day-${nextDay.day}`)
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
          "calc(23px + env(safe-area-inset-top)) 18px calc(165px + env(safe-area-inset-bottom))",
        background: `
          radial-gradient(
            circle at 94% 4%,
            rgba(244,213,141,0.12),
            transparent 27%
          ),
          radial-gradient(
            circle at 5% 42%,
            rgba(17,197,191,0.09),
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
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              06–15 agosto 2026
            </p>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize: 34,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              Itinerario
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                maxWidth: 280,
                color: theme.colors.textSoft,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Dieci giornate attraverso lo Yucatán.
            </p>
          </div>

          <div
            style={{
              width: 55,
              height: 55,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(244,213,141,0.22), rgba(17,197,191,0.17))",
              border:
                "1px solid rgba(255,255,255,0.11)",
              boxShadow:
                "0 14px 32px rgba(0,0,0,0.22)",
              fontSize: 25,
            }}
          >
            🗓️
          </div>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginTop: 23,
          }}
        >
          <SummaryCard value="10" label="giorni" />
          <SummaryCard value="14" label="tratte" />
          <SummaryCard value="6" label="alloggi" />
        </section>

      </header>

      <section
        style={{
          position: "relative",
          display: "grid",
          gap: 12,
          marginTop: 27,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 30,
            bottom: 30,
            left: 27,
            width: 2,
            background:
              "linear-gradient(180deg, rgba(17,197,191,0.55), rgba(17,197,191,0.08))",
          }}
        />

        {itinerary.map((tripDay, index) => {
          const isExpanded = expandedDay === tripDay.day;
          const isCurrent = currentTripDay === tripDay.day;
          const accommodation = getAccommodation(
            tripDay.overnight,
          );
          const dailyRoadTrip = getRoadTripLegs(tripDay.date);

          return (
            <article
              id={`trip-day-${tripDay.day}`}
              key={tripDay.day}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 24,
                background: isCurrent
                  ? "linear-gradient(145deg, rgba(17,197,191,0.13), rgba(255,255,255,0.065))"
                  : "rgba(255,255,255,0.06)",
                border: isCurrent
                  ? "1px solid rgba(17,197,191,0.34)"
                  : isExpanded
                    ? "1px solid rgba(255,255,255,0.13)"
                    : "1px solid rgba(255,255,255,0.075)",
                boxShadow: isCurrent
                  ? "0 18px 42px rgba(0,0,0,0.22)"
                  : "0 9px 25px rgba(0,0,0,0.09)",
                scrollMarginTop: 20,
              }}
            >
              <button
                type="button"
                onClick={() => toggleDay(tripDay.day)}
                aria-expanded={isExpanded}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "55px 1fr auto",
                  alignItems: "center",
                  gap: 13,
                  padding: 16,
                  border: 0,
                  background: "transparent",
                  color: theme.colors.text,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    zIndex: 2,
                    width: 55,
                    height: 55,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 18,
                    background:
                      isExpanded || isCurrent
                        ? theme.colors.primary
                        : theme.colors.background,
                    border:
                      isExpanded || isCurrent
                        ? "1px solid rgba(255,255,255,0.14)"
                        : "2px solid rgba(17,197,191,0.42)",
                    color:
                      isExpanded || isCurrent
                        ? theme.colors.background
                        : theme.colors.primary,
                    boxShadow:
                      isExpanded || isCurrent
                        ? "0 10px 25px rgba(17,197,191,0.20)"
                        : "none",
                    fontSize: 19,
                    fontWeight: 950,
                  }}
                >
                  {tripDay.day}
                </span>

                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 7,
                    }}
                  >
                    <span
                      style={{
                        color: theme.colors.secondary,
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                      }}
                    >
                      {tripDay.date}
                    </span>

                    {isCurrent && (
                      <span
                        style={{
                          padding: "4px 6px",
                          borderRadius: 999,
                          background:
                            "rgba(17,197,191,0.15)",
                          color: theme.colors.primary,
                          fontSize: 8,
                          fontWeight: 950,
                          textTransform: "uppercase",
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
                      display: "block",
                      marginTop: 5,
                      color: theme.colors.textSoft,
                      fontSize: 11,
                    }}
                  >
                    {tripDay.overnight
                      ? `🛏️ ${tripDay.overnight}`
                      : "✈️ Rientro"}
                    {" · "}
                    {tripDay.activities.length} attività
                  </span>
                </span>

                <span
                  style={{
                    color: theme.colors.primary,
                    fontSize: 24,
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
                    padding: "0 16px 18px 84px",
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
                        (activity, activityIndex) => (
                          <div
                            key={activity}
                            style={{
                              position: "relative",
                              display: "grid",
                              gridTemplateColumns: "29px 1fr",
                              gap: 10,
                              paddingBottom:
                                activityIndex ===
                                tripDay.activities.length - 1
                                  ? 0
                                  : 15,
                            }}
                          >
                            {activityIndex <
                              tripDay.activities.length - 1 && (
                              <span
                                aria-hidden="true"
                                style={{
                                  position: "absolute",
                                  top: 25,
                                  bottom: 0,
                                  left: 14,
                                  width: 1,
                                  background:
                                    "rgba(17,197,191,0.22)",
                                }}
                              />
                            )}

                            <span
                              style={{
                                position: "relative",
                                zIndex: 1,
                                width: 29,
                                height: 29,
                                display: "grid",
                                placeItems: "center",
                                borderRadius: 10,
                                background:
                                  "rgba(17,197,191,0.14)",
                                color: theme.colors.primary,
                                fontSize: 10,
                                fontWeight: 950,
                              }}
                            >
                              {activityIndex + 1}
                            </span>

                            <span
                              style={{
                                paddingTop: 5,
                                color: theme.colors.textSoft,
                                fontSize: 13,
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

                  {dailyRoadTrip.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <SectionTitle
                        eyebrow="On the road"
                        title="Spostamenti"
                      />

                      <div
                        style={{
                          display: "grid",
                          gap: 10,
                          marginTop: 14,
                        }}
                      >
                        {dailyRoadTrip.map((leg) => {
                          const isRoadLegExpanded =
                            expandedRoadLegs.includes(leg.id);

                          return (
                            <div
                              key={leg.id}
                              style={{
                                padding: 14,
                                borderRadius: 18,
                                background:
                                  "rgba(72,184,232,0.075)",
                                border:
                                  "1px solid rgba(72,184,232,0.16)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 9,
                                }}
                              >
                                <span
                                  style={{
                                    width: 35,
                                    height: 35,
                                    display: "grid",
                                    placeItems: "center",
                                    flexShrink: 0,
                                    borderRadius: 12,
                                    background:
                                      "rgba(72,184,232,0.14)",
                                    fontSize: 17,
                                  }}
                                >
                                  {leg.transport === "Traghetto"
                                    ? "⛴️"
                                    : leg.transport ===
                                        "Auto + traghetto"
                                      ? "🧭"
                                      : "🚗"}
                                </span>

                                <strong
                                  style={{
                                    fontSize: 14,
                                    lineHeight: 1.35,
                                  }}
                                >
                                  {leg.from} → {leg.to}
                                </strong>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 6,
                                  marginTop: 11,
                                }}
                              >
                                <DetailPill
                                  text={`⏱️ ${leg.duration}`}
                                />
                                <DetailPill
                                  text={`📏 ${leg.distance}`}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleRoadLeg(leg.id)
                                }
                                aria-expanded={isRoadLegExpanded}
                                style={{
                                  width: "100%",
                                  marginTop: 10,
                                  padding: "8px 10px",
                                  border:
                                    "1px solid rgba(255,255,255,0.08)",
                                  borderRadius: 12,
                                  background:
                                    "rgba(255,255,255,0.045)",
                                  color: theme.colors.textSoft,
                                  fontSize: 10,
                                  fontWeight: 850,
                                  cursor: "pointer",
                                }}
                              >
                                {isRoadLegExpanded
                                  ? "Nascondi info ↑"
                                  : "Info percorso ↓"}
                              </button>

                              {isRoadLegExpanded && (
                                <p
                                  style={{
                                    margin: "11px 0 0",
                                    color: theme.colors.textSoft,
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
                                  display: "block",
                                  marginTop: 12,
                                  padding: "10px 12px",
                                  borderRadius: 13,
                                  background:
                                    "rgba(72,184,232,0.15)",
                                  color: "#6ED4FF",
                                  textAlign: "center",
                                  textDecoration: "none",
                                  fontSize: 12,
                                  fontWeight: 900,
                                }}
                              >
                                Apri percorso →
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {accommodation && (
                    <div style={{ marginTop: 24 }}>
                      <SectionTitle
                        eyebrow="Questa notte"
                        title="Alloggio"
                      />

                      <div
                        style={{
                          marginTop: 14,
                          padding: 15,
                          borderRadius: 18,
                          background:
                            "rgba(255,184,107,0.075)",
                          border:
                            "1px solid rgba(255,184,107,0.17)",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            color: "#FFB86B",
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 0.7,
                            textTransform: "uppercase",
                          }}
                        >
                          🏨 Pernottamento
                        </span>

                        <strong
                          style={{
                            display: "block",
                            marginTop: 7,
                            fontSize: 17,
                          }}
                        >
                          {accommodation.location}
                        </strong>

                        <p
                          style={{
                            margin: "7px 0 0",
                            color: theme.colors.textSoft,
                            fontSize: 12,
                            lineHeight: 1.45,
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
                              background: theme.colors.primary,
                            }}
                          >
                            Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      marginTop: 20,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedDay(null)}
                      style={{
                        padding: "12px 14px",
                        border:
                          "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 14,
                        background: "transparent",
                        color: theme.colors.textSoft,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Chiudi giornata ↑
                    </button>

                    {index < itinerary.length - 1 && (
                      <button
                        type="button"
                        onClick={() => openNextDay(index)}
                        style={{
                          padding: "12px 14px",
                          border:
                            "1px solid rgba(255,255,255,0.09)",
                          borderRadius: 14,
                          background: "transparent",
                          color: theme.colors.textSoft,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Giorno successivo ↓
                      </button>
                    )}
                  </div>
                </div>
              )}
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
    <div
      style={{
        padding: "13px 7px",
        borderRadius: 17,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}
    >
      <strong
        style={{
          display: "block",
          color: theme.colors.primary,
          fontSize: 21,
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
          color: theme.colors.primary,
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

function DetailPill({ text }: { text: string }) {
  return (
    <span
      style={{
        padding: "6px 8px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.065)",
        color: theme.colors.textSoft,
        fontSize: 10,
        fontWeight: 750,
      }}
    >
      {text}
    </span>
  );
}


const smallLinkStyle = {
  padding: "10px",
  borderRadius: 13,
  color: theme.colors.background,
  textAlign: "center" as const,
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 900,
};

export default Itinerary;