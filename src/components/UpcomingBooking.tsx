import { bookingSchedule } from "../data/bookingSchedule";
import { getAppDate } from "../utils/travelClock";
import { getTravelerProfile } from "../utils/travelerProfile";
import { theme } from "../styles/theme";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeRemaining(target: Date, now: Date) {
  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return "In corso o appena terminata";
  }

  const totalMinutes = Math.floor(
    difference / (1000 * 60),
  );

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `Tra ${days} ${
      days === 1 ? "giorno" : "giorni"
    } e ${hours} h`;
  }

  if (hours > 0) {
    return `Tra ${hours} h e ${minutes} min`;
  }

  return `Tra ${minutes} min`;
}

function UpcomingBooking() {
  const now = getAppDate();
  const traveler = getTravelerProfile();

  const eligibleBookings = bookingSchedule.filter(
    (booking) => {
      const isFuture =
        new Date(booking.dateTime).getTime() >= now.getTime();

      if (!isFuture) {
        return false;
      }

      if (!traveler) {
        return true;
      }

      return booking.travelers.includes(traveler);
    },
  );

  const nextBooking = eligibleBookings[0];

  if (!nextBooking) {
    return null;
  }

  const eventDate = new Date(nextBooking.dateTime);

  return (
    <section
      style={{
        marginTop: 18,
        padding: 20,
        borderRadius: 23,
        background: theme.colors.card,
        border: "1px solid rgba(110,212,255,0.24)",
        boxShadow: "0 15px 34px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#6ED4FF",
            fontSize: 12,
            fontWeight: 850,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Prossima prenotazione
        </p>

        {traveler && (
          <span
            style={{
              padding: "5px 8px",
              borderRadius: 999,
              background: "rgba(72,184,232,0.13)",
              color: "#6ED4FF",
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            Per {traveler}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          marginTop: 14,
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
            background: "rgba(72,184,232,0.14)",
            fontSize: 24,
          }}
        >
          {nextBooking.icon}
        </span>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              lineHeight: 1.3,
            }}
          >
            {nextBooking.title}
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: theme.colors.textSoft,
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            {nextBooking.subtitle}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
          marginTop: 16,
        }}
      >
        <div style={infoCardStyle}>
          <span style={infoLabelStyle}>Data e ora</span>

          <strong style={infoValueStyle}>
            {formatDateTime(nextBooking.dateTime)}
          </strong>
        </div>

        <div style={infoCardStyle}>
          <span style={infoLabelStyle}>Manca</span>

          <strong style={infoValueStyle}>
            {getTimeRemaining(eventDate, now)}
          </strong>
        </div>
      </div>

      <p
        style={{
          margin: "13px 1px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
        }}
      >
        👥 {nextBooking.travelers.join(", ")}
      </p>

      {!traveler && (
        <p
          style={{
            margin: "11px 0 0",
            color: theme.colors.secondary,
            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          Seleziona “Il mio profilo” per personalizzare le
          prenotazioni mostrate su questo telefono.
        </p>
      )}
    </section>
  );
}

const infoCardStyle = {
  padding: 12,
  borderRadius: 15,
  background: "rgba(255,255,255,0.055)",
};

const infoLabelStyle = {
  display: "block",
  color: theme.colors.textSoft,
  fontSize: 10,
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
};

const infoValueStyle = {
  display: "block",
  marginTop: 6,
  fontSize: 13,
  lineHeight: 1.4,
};

export default UpcomingBooking;