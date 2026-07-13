import type {
  CSSProperties,
  ReactNode,
} from "react";
import { bookingSchedule } from "../data/bookingSchedule";
import { theme } from "../styles/theme";
import { getAppDate } from "../utils/travelClock";
import { getTravelerProfile } from "../utils/travelerProfile";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(
    "it-IT",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function getTimeRemaining(
  target: Date,
  now: Date,
) {
  const difference =
    target.getTime() - now.getTime();

  if (difference <= 0) {
    return "In corso o appena terminata";
  }

  const totalMinutes = Math.floor(
    difference / (1000 * 60),
  );

  const days = Math.floor(
    totalMinutes / 1440,
  );

  const hours = Math.floor(
    (totalMinutes % 1440) / 60,
  );

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

  const eligibleBookings =
    bookingSchedule.filter((booking) => {
      const isFuture =
        new Date(
          booking.dateTime,
        ).getTime() >= now.getTime();

      if (!isFuture) {
        return false;
      }

      if (!traveler) {
        return true;
      }

      return booking.travelers.includes(
        traveler,
      );
    });

  const nextBooking =
    eligibleBookings[0];

  if (!nextBooking) {
    return null;
  }

  const eventDate = new Date(
    nextBooking.dateTime,
  );

  const bookingVisual =
    getBookingVisual(
      nextBooking.title,
      nextBooking.subtitle,
    );

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        marginTop: 18,
        padding: 18,
        borderRadius: 24,
        background:
          "linear-gradient(145deg, rgba(116,215,255,0.11), rgba(255,255,255,0.065))",
        border:
          "1px solid rgba(116,215,255,0.20)",
        boxShadow:
          theme.shadows.card,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -65,
          right: -60,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background:
            "rgba(116,215,255,0.055)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 10,
        }}
      >
        <p
          style={{
            margin: 0,
            color: theme.colors.info,
            fontSize:
              theme.typography.eyebrow,
            fontWeight: 900,
            letterSpacing: 1.05,
            textTransform: "uppercase",
          }}
        >
          Prossima prenotazione
        </p>

        {traveler && (
          <span
            style={{
              maxWidth: "48%",
              overflow: "hidden",
              padding: "5px 8px",
              borderRadius:
                theme.radius.pill,
              background:
                "rgba(116,215,255,0.11)",
              color:
                theme.colors.info,
              fontSize: 10,
              fontWeight: 850,
              textOverflow:
                "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Per {traveler}
          </span>
        )}
      </div>

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns:
            "52px 1fr",
          alignItems: "start",
          gap: 14,
          marginTop: 15,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 52,
            height: 52,
            display: "grid",
            placeItems: "center",
            borderRadius: 17,
            background: `${bookingVisual.color}14`,
            border: `1px solid ${bookingVisual.color}20`,
            color: bookingVisual.color,
          }}
        >
          {bookingVisual.icon}
        </span>

        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 21,
              lineHeight: 1.2,
              letterSpacing: -0.25,
            }}
          >
            {nextBooking.title}
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color:
                theme.colors.textSoft,
              fontSize: 14,
              lineHeight: 1.48,
            }}
          >
            {nextBooking.subtitle}
          </p>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 9,
          marginTop: 16,
        }}
      >
        <InfoCard
          label="Data e ora"
          value={formatDateTime(
            nextBooking.dateTime,
          )}
          icon={<CalendarIcon />}
        />

        <InfoCard
          label="Manca"
          value={getTimeRemaining(
            eventDate,
            now,
          )}
          icon={<TimerIcon />}
        />
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          marginTop: 13,
          color:
            theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.45,
        }}
      >
        <GroupIcon />

        <span>
          {nextBooking.travelers.join(
            ", ",
          )}
        </span>
      </div>

      {!traveler && (
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: 9,
            marginTop: 13,
            padding: 12,
            borderRadius: 15,
            background:
              theme.colors.secondarySoft,
            border:
              "1px solid rgba(246,217,144,0.17)",
            color:
              theme.colors.secondary,
            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          <InfoIcon />

          <span>
            Seleziona “Il mio profilo”
            per personalizzare le
            prenotazioni mostrate su
            questo telefono.
          </span>
        </div>
      )}
    </section>
  );
}

function getBookingVisual(
  title: string,
  subtitle: string,
): {
  color: string;
  icon: ReactNode;
} {
  const text = `${title} ${subtitle}`
    .toLocaleLowerCase("it");

  if (
    text.includes("volo") ||
    text.includes("aereo") ||
    text.includes("flight")
  ) {
    return {
      color: theme.colors.info,
      icon: <PlaneIcon />,
    };
  }

  if (
    text.includes("auto") ||
    text.includes("noleggio") ||
    text.includes("localiza")
  ) {
    return {
      color: theme.colors.warning,
      icon: <CarIcon />,
    };
  }

  if (
    text.includes("traghetto") ||
    text.includes("ferry") ||
    text.includes("barca")
  ) {
    return {
      color: "#C7AEFF",
      icon: <ShipIcon />,
    };
  }

  if (
    text.includes("hotel") ||
    text.includes("alloggio") ||
    text.includes("airbnb")
  ) {
    return {
      color: theme.colors.success,
      icon: <BedIcon />,
    };
  }

  if (
    text.includes("assicurazione") ||
    text.includes("polizza")
  ) {
    return {
      color: theme.colors.danger,
      icon: <ShieldIcon />,
    };
  }

  return {
    color: theme.colors.info,
    icon: <TicketIcon />,
  };
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div style={infoCardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color:
            theme.colors.textMuted,
        }}
      >
        {icon}

        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 0.55,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>

      <strong
        style={{
          display: "block",
          marginTop: 7,
          overflowWrap: "anywhere",
          fontSize: 13,
          lineHeight: 1.4,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

const infoCardStyle: CSSProperties = {
  minWidth: 0,
  padding: 12,
  borderRadius: 15,
  background:
    "rgba(255,255,255,0.050)",
  border:
    `1px solid ${theme.colors.border}`,
};

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

function PlaneIcon() {
  return (
    <IconBase size={24}>
      <path d="M22 2 9.5 14.5" />
      <path d="m22 2-7 20-4-8-8-4Z" />
    </IconBase>
  );
}

function CarIcon() {
  return (
    <IconBase size={24}>
      <path d="m5 17-1-5 2-5h12l2 5-1 5" />
      <path d="M3 14h18" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </IconBase>
  );
}

function ShipIcon() {
  return (
    <IconBase size={24}>
      <path d="M4 13 12 4l8 9" />
      <path d="M6 13h12l-2 6H8Z" />
      <path d="M3 21c2-1 4-1 6 0 2-1 4-1 6 0 2-1 4-1 6 0" />
    </IconBase>
  );
}

function BedIcon() {
  return (
    <IconBase size={24}>
      <path d="M3 19v-8" />
      <path d="M21 19v-6a3 3 0 0 0-3-3H7a4 4 0 0 0-4 4" />
      <path d="M3 16h18" />
      <path d="M7 10V7h5a3 3 0 0 1 3 3" />
    </IconBase>
  );
}

function ShieldIcon() {
  return (
    <IconBase size={24}>
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

function TicketIcon() {
  return (
    <IconBase size={24}>
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 5v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.5 2.5 0 0 0 0-5Z" />
      <path d="M12 5v14" />
    </IconBase>
  );
}

function CalendarIcon() {
  return (
    <IconBase size={14}>
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

function TimerIcon() {
  return (
    <IconBase size={14}>
      <circle
        cx="12"
        cy="13"
        r="8"
      />
      <path d="M12 9v4l2.5 1.5" />
      <path d="M9 2h6" />
    </IconBase>
  );
}

function GroupIcon() {
  return (
    <IconBase size={16}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  );
}

function InfoIcon() {
  return (
    <IconBase size={16}>
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </IconBase>
  );
}

export default UpcomingBooking;