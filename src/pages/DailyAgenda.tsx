import { useMemo, useState } from "react";
import { accommodations } from "../data/accommodations";
import {
  bookingSchedule,
  type ScheduledBooking,
} from "../data/bookingSchedule";
import { itinerary } from "../data/itinerary";
import { roadTrip } from "../data/roadTrip";
import { getAppDate } from "../utils/travelClock";
import { getTravelerProfile } from "../utils/travelerProfile";
import { theme } from "../styles/theme";

const TRIP_START_DATE = "2026-08-06";

function getDateValue(dayNumber: number) {
  const date = new Date(`${TRIP_START_DATE}T12:00:00`);

  date.setDate(date.getDate() + dayNumber - 1);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getInitialDay() {
  const appDate = getAppDate();

  const startDate = new Date(
    `${TRIP_START_DATE}T00:00:00`,
  );

  const currentDate = new Date(
    appDate.getFullYear(),
    appDate.getMonth(),
    appDate.getDate(),
  );

  const difference = Math.floor(
    (currentDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (difference < 0) {
    return 1;
  }

  if (difference >= itinerary.length) {
    return itinerary.length;
  }

  return difference + 1;
}

function getTime(value: string) {
  return new Date(value).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAccommodation(location?: string) {
  if (!location) {
    return undefined;
  }

  const normalizedLocation = location
    .toLocaleLowerCase("it")
    .replace("isla ", "");

  return accommodations.find((accommodation) =>
    accommodation.location
      .toLocaleLowerCase("it")
      .replace("isla ", "")
      .includes(normalizedLocation),
  );
}

function getGoogleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

function DailyAgenda() {
  const [selectedDay, setSelectedDay] =
    useState(getInitialDay());

  const traveler = getTravelerProfile();

  const currentDay =
    itinerary.find((day) => day.day === selectedDay) ??
    itinerary[0];

  const selectedDate = getDateValue(currentDay.day);

  const dailyBookings = useMemo(() => {
    return bookingSchedule
      .filter((booking) => {
        const matchesDate =
          booking.dateTime.startsWith(selectedDate);

        if (!matchesDate) {
          return false;
        }

        if (!traveler) {
          return true;
        }

        return booking.travelers.includes(traveler);
      })
      .sort(
        (firstBooking, secondBooking) =>
          new Date(firstBooking.dateTime).getTime() -
          new Date(secondBooking.dateTime).getTime(),
      );
  }, [selectedDate, traveler]);

  const dailyRoadTrip = useMemo(() => {
    return roadTrip.filter(
      (leg) => leg.day === currentDay.date,
    );
  }, [currentDay.date]);

  const accommodation = getAccommodation(
    currentDay.overnight,
  );

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
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div>
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
            Programma quotidiano
          </p>

          <h1
            style={{
              margin: "8px 0 6px",
              fontSize: 34,
            }}
          >
            Agenda del giorno
          </h1>
        </div>

        {traveler && (
          <span
            style={{
              flexShrink: 0,
              marginTop: 3,
              padding: "8px 11px",
              borderRadius: 999,
              background: "rgba(17,197,191,0.14)",
              border:
                "1px solid rgba(17,197,191,0.22)",
              color: theme.colors.primary,
              fontSize: 11,
              fontWeight: 850,
            }}
          >
            👤 {traveler}
          </span>
        )}
      </div>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Attività, prenotazioni e spostamenti riuniti in una sola
        schermata.
      </p>

      {!traveler && (
        <div
          style={{
            marginTop: 17,
            padding: 14,
            borderRadius: 17,
            background: "rgba(244,213,141,0.08)",
            border:
              "1px solid rgba(244,213,141,0.18)",
            color: theme.colors.secondary,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          👤 Nessun profilo selezionato: vengono mostrate le
          prenotazioni di tutto il gruppo.
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 9,
          marginTop: 21,
          paddingBottom: 7,
          overflowX: "auto",
        }}
      >
        {itinerary.map((day) => {
          const isActive = day.day === selectedDay;

          return (
            <button
              key={day.day}
              type="button"
              onClick={() => setSelectedDay(day.day)}
              style={{
                minWidth: 65,
                flexShrink: 0,
                padding: "10px 11px",
                border: isActive
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.11)",
                borderRadius: 17,
                background: isActive
                  ? theme.colors.primary
                  : theme.colors.card,
                color: isActive
                  ? theme.colors.background
                  : theme.colors.text,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  opacity: 0.75,
                }}
              >
                Giorno
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: 3,
                  fontSize: 19,
                }}
              >
                {day.day}
              </strong>
            </button>
          );
        })}
      </div>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: 17,
          padding: 22,
          borderRadius: 26,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow:
            "0 19px 42px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -50,
            bottom: -70,
            width: 170,
            height: 170,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
          }}
        />

        <p
          style={{
            position: "relative",
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            opacity: 0.84,
          }}
        >
          Giorno {currentDay.day} · {currentDay.date}
        </p>

        <h2
          style={{
            position: "relative",
            margin: "9px 0 0",
            maxWidth: 310,
            fontSize: 27,
            lineHeight: 1.2,
          }}
        >
          {currentDay.title}
        </h2>

        {currentDay.overnight && (
          <p
            style={{
              position: "relative",
              margin: "15px 0 0",
              fontSize: 14,
              fontWeight: 750,
              opacity: 0.87,
            }}
          >
            🛏️ Notte a {currentDay.overnight}
          </p>
        )}
      </section>

      {dailyBookings.length > 0 && (
        <section style={{ marginTop: 25 }}>
          <SectionHeading
            icon="🎫"
            title={
              traveler
                ? `Orari confermati per ${traveler}`
                : "Orari confermati"
            }
            count={dailyBookings.length}
          />

          <div
            style={{
              display: "grid",
              gap: 11,
              marginTop: 13,
            }}
          >
            {dailyBookings.map((booking) => (
              <ConfirmedBookingCard
                key={booking.id}
                booking={booking}
              />
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 25 }}>
        <SectionHeading
          icon="📋"
          title="Programma flessibile"
          count={currentDay.activities.length}
        />

        <div
          style={{
            position: "relative",
            display: "grid",
            gap: 0,
            marginTop: 14,
          }}
        >
          {currentDay.activities.map(
            (activity, index) => {
              const isLast =
                index ===
                currentDay.activities.length - 1;

              return (
                <div
                  key={activity}
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "42px 1fr",
                    gap: 12,
                    minHeight: 78,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {!isLast && (
                      <span
                        style={{
                          position: "absolute",
                          top: 34,
                          bottom: -4,
                          width: 2,
                          background:
                            "rgba(17,197,191,0.20)",
                        }}
                      />
                    )}

                    <span
                      style={{
                        position: "relative",
                        zIndex: 1,
                        width: 32,
                        height: 32,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 11,
                        background:
                          "rgba(17,197,191,0.15)",
                        border:
                          "1px solid rgba(17,197,191,0.22)",
                        color:
                          theme.colors.primary,
                        fontSize: 12,
                        fontWeight: 900,
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <article
                    style={{
                      marginBottom: isLast ? 0 : 11,
                      padding: 15,
                      borderRadius: 18,
                      background: theme.colors.card,
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color:
                          theme.colors.textSoft,
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {activity}
                    </p>
                  </article>
                </div>
              );
            },
          )}
        </div>
      </section>

      {dailyRoadTrip.length > 0 && (
        <section style={{ marginTop: 26 }}>
          <SectionHeading
            icon="🚗"
            title="Spostamenti"
            count={dailyRoadTrip.length}
          />

          <div
            style={{
              display: "grid",
              gap: 11,
              marginTop: 13,
            }}
          >
            {dailyRoadTrip.map((leg) => (
              <article
                key={leg.id}
                style={{
                  padding: 17,
                  borderRadius: 20,
                  background: theme.colors.card,
                  border:
                    "1px solid rgba(110,212,255,0.17)",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: 16,
                    lineHeight: 1.4,
                  }}
                >
                  {leg.from} → {leg.to}
                </strong>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 7,
                    marginTop: 11,
                  }}
                >
                  <Pill text={`⏱️ ${leg.duration}`} />
                  <Pill text={`📏 ${leg.distance}`} />
                  <Pill text={leg.transport} />
                </div>

                <p
                  style={{
                    margin: "12px 0 0",
                    color: theme.colors.textSoft,
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {leg.notes}
                </p>

                <a
                  href={getGoogleMapsUrl(leg.mapsQuery)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    marginTop: 14,
                    padding: "12px 13px",
                    borderRadius: 14,
                    background:
                      "rgba(72,184,232,0.15)",
                    color: "#6ED4FF",
                    textAlign: "center",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 850,
                  }}
                >
                  Apri percorso
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {accommodation && (
        <section
          style={{
            marginTop: 25,
            padding: 19,
            borderRadius: 22,
            background: theme.colors.card,
            border:
              "1px solid rgba(255,184,107,0.22)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#FFB86B",
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            🏨 Alloggio della notte
          </p>

          <h2
            style={{
              margin: "9px 0 0",
              fontSize: 21,
            }}
          >
            {accommodation.location}
          </h2>

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
              gap: 9,
              marginTop: 15,
            }}
          >
            <a
              href={accommodation.url}
              target="_blank"
              rel="noreferrer"
              style={{
                ...linkButtonStyle,
                background: "#FFB86B",
              }}
            >
              Apri Airbnb
            </a>

            <a
              href={getGoogleMapsUrl(
                accommodation.location,
              )}
              target="_blank"
              rel="noreferrer"
              style={{
                ...linkButtonStyle,
                background:
                  theme.colors.primary,
              }}
            >
              Google Maps
            </a>
          </div>
        </section>
      )}

      <p
        style={{
          margin: "23px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        Gli orari nelle card azzurre derivano dalle
        prenotazioni confermate. Le altre attività restano
        flessibili e possono essere adattate durante il viaggio.
      </p>
    </main>
  );
}

function ConfirmedBookingCard({
  booking,
}: {
  booking: ScheduledBooking;
}) {
  return (
    <article
      style={{
        padding: 17,
        borderRadius: 21,
        background: theme.colors.card,
        border:
          "1px solid rgba(110,212,255,0.24)",
        boxShadow:
          "0 13px 30px rgba(0,0,0,0.16)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 13,
        }}
      >
        <span
          style={{
            width: 48,
            height: 48,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            borderRadius: 16,
            background:
              "rgba(72,184,232,0.14)",
            fontSize: 23,
          }}
        >
          {booking.icon}
        </span>

        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              color: "#6ED4FF",
              fontSize: 12,
              fontWeight: 850,
            }}
          >
            {getTime(booking.dateTime)}
            {booking.endDateTime
              ? ` → ${getTime(
                  booking.endDateTime,
                )}`
              : ""}
          </p>

          <strong
            style={{
              display: "block",
              marginTop: 5,
              fontSize: 17,
              lineHeight: 1.35,
            }}
          >
            {booking.title}
          </strong>

          <p
            style={{
              margin: "6px 0 0",
              color: theme.colors.textSoft,
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            {booking.subtitle}
          </p>

          <p
            style={{
              margin: "9px 0 0",
              color: theme.colors.textSoft,
              fontSize: 11,
              lineHeight: 1.45,
            }}
          >
            👥 {booking.travelers.join(", ")}
          </p>
        </div>
      </div>
    </article>
  );
}

function SectionHeading({
  icon,
  title,
  count,
}: {
  icon: string;
  title: string;
  count: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          margin: 0,
          fontSize: 21,
        }}
      >
        <span>{icon}</span>
        <span>{title}</span>
      </h2>

      <span
        style={{
          minWidth: 30,
          padding: "6px 9px",
          borderRadius: 999,
          background:
            "rgba(17,197,191,0.14)",
          color: theme.colors.primary,
          fontSize: 12,
          fontWeight: 850,
          textAlign: "center",
        }}
      >
        {count}
      </span>
    </div>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <span
      style={{
        padding: "7px 9px",
        borderRadius: 999,
        background:
          "rgba(255,255,255,0.06)",
        color: theme.colors.textSoft,
        fontSize: 11,
        fontWeight: 750,
      }}
    >
      {text}
    </span>
  );
}

const linkButtonStyle = {
  padding: "12px 10px",
  borderRadius: 14,
  color: theme.colors.background,
  textAlign: "center" as const,
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

export default DailyAgenda;