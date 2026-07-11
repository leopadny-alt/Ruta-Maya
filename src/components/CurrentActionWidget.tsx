import { useMemo } from "react";
import {
  actionSchedule,
  type ActionType,
} from "../data/actionSchedule";
import { getAppDate } from "../utils/travelClock";
import { getTravelerProfile } from "../utils/travelerProfile";
import { theme } from "../styles/theme";

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
  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return "Adesso";
  }

  const totalMinutes = Math.floor(
    difference / (1000 * 60),
  );

  const days = Math.floor(totalMinutes / 1440);
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

      return action.travelers.includes(traveler);
    });
  }, [traveler]);

  const currentAction = eligibleActions.find((action) => {
    const start = new Date(action.dateTime);

    const end = new Date(
      action.endDateTime ?? action.dateTime,
    );

    return now >= start && now <= end;
  });

  const nextAction = eligibleActions.find(
    (action) =>
      new Date(action.dateTime).getTime() >
      now.getTime(),
  );

  const action = currentAction ?? nextAction;

  if (!action) {
    return null;
  }

  const isCurrent = Boolean(currentAction);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        marginTop: 18,
        padding: 20,
        borderRadius: 24,
        background: isCurrent
          ? "linear-gradient(135deg, rgba(17,197,191,0.98), rgba(14,79,111,0.96))"
          : "linear-gradient(135deg, rgba(23,118,154,0.92), rgba(7,38,65,0.96))",
        border: "1px solid rgba(255,255,255,0.11)",
        boxShadow: "0 17px 38px rgba(0,0,0,0.23)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -45,
          bottom: -65,
          width: 155,
          height: 155,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.09)",
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
            borderRadius: 999,
            background: "rgba(7,26,46,0.24)",
            fontSize: 10,
            fontWeight: 850,
            letterSpacing: 0.6,
            textTransform: "uppercase",
          }}
        >
          {isCurrent
            ? "Da fare adesso"
            : "Prossima azione"}
        </span>

        <ActionTypeBadge type={action.type} />
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          marginTop: 17,
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
            background: "rgba(7,26,46,0.24)",
            fontSize: 25,
          }}
        >
          {action.icon}
        </span>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              lineHeight: 1.3,
            }}
          >
            {action.title}
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color: "rgba(255,255,255,0.76)",
              fontSize: 13,
              lineHeight: 1.5,
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
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
          marginTop: 16,
        }}
      >
        <InfoCard
          label="Orario"
          value={formatTime(action.dateTime)}
        />

        <InfoCard
          label="Quando"
          value={
            isCurrent
              ? "Adesso"
              : getTimeRemaining(
                  new Date(action.dateTime),
                  now,
                )
          }
        />
      </div>

      {traveler && (
        <p
          style={{
            position: "relative",
            margin: "12px 2px 0",
            color: "rgba(255,255,255,0.63)",
            fontSize: 11,
          }}
        >
          👤 Indicazione personalizzata per {traveler}
        </p>
      )}

      {action.mapsQuery && (
        <a
          href={getMapsUrl(action.mapsQuery)}
          target="_blank"
          rel="noreferrer"
          style={{
            position: "relative",
            display: "block",
            marginTop: 14,
            padding: 12,
            borderRadius: 14,
            background: "#FFFFFF",
            color: theme.colors.background,
            textAlign: "center",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 850,
          }}
        >
          Apri in Google Maps
        </a>
      )}
    </section>
  );
}

function ActionTypeBadge({
  type,
}: {
  type: ActionType;
}) {
  const labels: Record<ActionType, string> = {
    confirmed: "Confermato",
    suggested: "Suggerito",
    reminder: "Promemoria",
  };

  const color =
    type === "confirmed"
      ? "#BDEBFF"
      : type === "suggested"
        ? "#F4D58D"
        : "#FFCB91";

  return (
    <span
      style={{
        flexShrink: 0,
        padding: "5px 8px",
        borderRadius: 999,
        background: "rgba(7,26,46,0.24)",
        color,
        fontSize: 9,
        fontWeight: 850,
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 15,
        background: "rgba(7,26,46,0.24)",
      }}
    >
      <span
        style={{
          display: "block",
          color: "rgba(255,255,255,0.59)",
          fontSize: 9,
          fontWeight: 750,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 6,
          fontSize: 13,
          lineHeight: 1.4,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

export default CurrentActionWidget;