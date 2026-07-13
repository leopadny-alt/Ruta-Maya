import {
  useMemo,
  type ReactNode,
} from "react";
import {
  actionSchedule,
  type ActionType,
} from "../data/actionSchedule";
import { theme } from "../styles/theme";
import { getAppDate } from "../utils/travelClock";
import { getTravelerProfile } from "../utils/travelerProfile";

function getMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeRemaining(target: Date, now: Date) {
  const difference =
    target.getTime() - now.getTime();

  if (difference <= 0) {
    return "Adesso";
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

function CurrentActionWidget() {
  const now = getAppDate();
  const traveler = getTravelerProfile();

  const eligibleActions = useMemo(() => {
    return actionSchedule.filter((action) => {
      if (!traveler || !action.travelers) {
        return true;
      }

      return action.travelers.includes(
        traveler,
      );
    });
  }, [traveler]);

  const currentAction =
    eligibleActions.find((action) => {
      const start = new Date(
        action.dateTime,
      );

      const end = new Date(
        action.endDateTime ??
          action.dateTime,
      );

      return now >= start && now <= end;
    });

  const nextAction =
    eligibleActions.find(
      (action) =>
        new Date(
          action.dateTime,
        ).getTime() > now.getTime(),
    );

  const action =
    currentAction ?? nextAction;

  if (!action) {
    return null;
  }

  const isCurrent =
    Boolean(currentAction);

  const visual =
    getActionVisual(action.type);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        marginTop: 18,
        padding: 18,
        borderRadius: 24,
        background: isCurrent
          ? "linear-gradient(135deg, rgba(32,206,198,0.96), rgba(9,90,108,0.97) 54%, rgba(7,44,70,0.99))"
          : "linear-gradient(135deg, rgba(24,119,155,0.92), rgba(8,58,88,0.97) 52%, rgba(5,31,54,0.99))",
        border:
          "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 18px 40px rgba(0,0,0,0.24)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -56,
          bottom: -74,
          width: 170,
          height: 170,
          borderRadius: "50%",
          background:
            "rgba(255,255,255,0.075)",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -65,
          left: -65,
          width: 135,
          height: 135,
          borderRadius: "50%",
          border:
            "1px solid rgba(255,255,255,0.08)",
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
        <span
          style={{
            padding: "6px 9px",
            borderRadius:
              theme.radius.pill,
            background:
              "rgba(5,26,42,0.25)",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 0.7,
            textTransform: "uppercase",
          }}
        >
          {isCurrent
            ? "Da fare adesso"
            : "Prossima azione"}
        </span>

        <ActionTypeBadge
          type={action.type}
        />
      </div>

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns:
            "52px 1fr",
          alignItems: "start",
          gap: 14,
          marginTop: 16,
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
            background:
              "rgba(5,27,43,0.24)",
            border:
              "1px solid rgba(255,255,255,0.07)",
            color: visual.color,
          }}
        >
          {visual.icon}
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
            {action.title}
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color:
                "rgba(255,255,255,0.80)",
              fontSize: 14,
              lineHeight: 1.48,
            }}
          >
            {action.description}
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
          label="Orario"
          value={formatTime(
            action.dateTime,
          )}
          icon={<ClockIcon />}
        />

        <InfoCard
          label="Quando"
          value={
            isCurrent
              ? "Adesso"
              : getTimeRemaining(
                  new Date(
                    action.dateTime,
                  ),
                  now,
                )
          }
          icon={<TimerIcon />}
        />
      </div>

      {traveler && (
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginTop: 12,
            color:
              "rgba(255,255,255,0.68)",
            fontSize: 11,
            lineHeight: 1.4,
          }}
        >
          <UserIcon />
          <span>
            Indicazione personalizzata per{" "}
            <strong>{traveler}</strong>
          </span>
        </div>
      )}

      {action.mapsQuery && (
        <a
          href={getMapsUrl(
            action.mapsQuery,
          )}
          target="_blank"
          rel="noreferrer"
          style={{
            position: "relative",
            minHeight: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            marginTop: 15,
            padding: "12px 15px",
            borderRadius: 16,
            background:
              "rgba(4,23,38,0.30)",
            border:
              "1px solid rgba(255,255,255,0.14)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.05)",
            color: "#FFFFFF",
            textAlign: "center",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 900,
            boxSizing: "border-box",
          }}
        >
          <NavigationIcon />
          Apri in Google Maps
          <ArrowUpRightIcon />
        </a>
      )}
    </section>
  );
}

function getActionVisual(
  type: ActionType,
): {
  color: string;
  icon: ReactNode;
} {
  if (type === "suggested") {
    return {
      color: theme.colors.secondary,
      icon: <CompassIcon />,
    };
  }

  if (type === "reminder") {
    return {
      color: theme.colors.warning,
      icon: <BellIcon />,
    };
  }

  return {
    color: theme.colors.info,
    icon: <NavigationIcon size={24} />,
  };
}

function ActionTypeBadge({
  type,
}: {
  type: ActionType;
}) {
  const labels: Record<
    ActionType,
    string
  > = {
    confirmed: "Confermato",
    suggested: "Suggerito",
    reminder: "Promemoria",
  };

  const color =
    type === "confirmed"
      ? theme.colors.info
      : type === "suggested"
        ? theme.colors.secondary
        : theme.colors.warning;

  return (
    <span
      style={{
        flexShrink: 0,
        padding: "5px 8px",
        borderRadius:
          theme.radius.pill,
        background:
          "rgba(5,26,42,0.24)",
        color,
        fontSize: 9,
        fontWeight: 900,
        letterSpacing: 0.35,
        textTransform: "uppercase",
      }}
    >
      {labels[type]}
    </span>
  );
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
    <div
      style={{
        minWidth: 0,
        padding: 12,
        borderRadius: 15,
        background:
          "rgba(5,26,42,0.22)",
        border:
          "1px solid rgba(255,255,255,0.055)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color:
            "rgba(255,255,255,0.62)",
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

function NavigationIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="m3.5 11 17-8-8 17-1.9-7.1Z" />
    </IconBase>
  );
}

function CompassIcon() {
  return (
    <IconBase size={24}>
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8Z" />
    </IconBase>
  );
}

function BellIcon() {
  return (
    <IconBase size={24}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M10 19h4" />
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

function UserIcon() {
  return (
    <IconBase size={15}>
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </IconBase>
  );
}

function ArrowUpRightIcon() {
  return (
    <IconBase size={15}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </IconBase>
  );
}

export default CurrentActionWidget;