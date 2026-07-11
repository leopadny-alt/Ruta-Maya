import { useMemo } from "react";
import {
  actionSchedule,
  type ActionType,
  type TripAction,
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

function formatFullDate(value: string) {
  return new Date(value).toLocaleString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDifferenceText(target: Date, now: Date) {
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

function WhatNow() {
  const now = getAppDate();
  const traveler = getTravelerProfile();

  const eligibleActions = useMemo(() => {
    return actionSchedule.filter((action) => {
      if (!action.travelers || !traveler) {
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

  const nextActions = eligibleActions
    .filter(
      (action) =>
        new Date(action.dateTime).getTime() >
        now.getTime(),
    )
    .slice(0, 3);

  const mainAction =
    currentAction ?? nextActions[0] ?? null;

  const isCurrent = Boolean(currentAction);

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
        Assistente di viaggio
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Cosa faccio adesso?
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        {traveler
          ? `Indicazioni personalizzate per ${traveler}.`
          : "Prossime azioni previste per il gruppo."}
      </p>

      {mainAction ? (
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            marginTop: 23,
            padding: 23,
            borderRadius: 27,
            background: isCurrent
              ? "linear-gradient(135deg, #11C5BF, #0E4F6F)"
              : "linear-gradient(135deg, #17769A, #0A314F)",
            boxShadow:
              "0 20px 46px rgba(0,0,0,0.28)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -55,
              bottom: -70,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
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
                background: "rgba(7,26,46,0.24)",
                fontSize: 11,
                fontWeight: 850,
                textTransform: "uppercase",
              }}
            >
              {isCurrent ? "Da fare adesso" : "Prossima azione"}
            </span>

            <ActionTypeBadge type={mainAction.type} />
          </div>

          <span
            style={{
              position: "relative",
              display: "block",
              marginTop: 22,
              fontSize: 42,
            }}
          >
            {mainAction.icon}
          </span>

          <h2
            style={{
              position: "relative",
              margin: "12px 0 0",
              fontSize: 28,
              lineHeight: 1.2,
            }}
          >
            {mainAction.title}
          </h2>

          <p
            style={{
              position: "relative",
              margin: "11px 0 0",
              maxWidth: 340,
              fontSize: 14,
              lineHeight: 1.55,
              opacity: 0.86,
            }}
          >
            {mainAction.description}
          </p>

          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
              marginTop: 20,
            }}
          >
            <InfoCard
              label="Orario"
              value={formatTime(mainAction.dateTime)}
            />

            <InfoCard
              label="Quando"
              value={
                isCurrent
                  ? "Adesso"
                  : getDifferenceText(
                      new Date(mainAction.dateTime),
                      now,
                    )
              }
            />
          </div>

          {mainAction.mapsQuery && (
            <a
              href={getMapsUrl(mainAction.mapsQuery)}
              target="_blank"
              rel="noreferrer"
              style={{
                position: "relative",
                display: "block",
                marginTop: 14,
                padding: 13,
                borderRadius: 15,
                background: "#FFFFFF",
                color: theme.colors.background,
                textAlign: "center",
                textDecoration: "none",
                fontWeight: 850,
              }}
            >
              Apri in Google Maps
            </a>
          )}
        </section>
      ) : (
        <section
          style={{
            marginTop: 23,
            padding: 24,
            borderRadius: 24,
            background: theme.colors.card,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 40 }}>🏁</span>

          <h2 style={{ margin: "13px 0 0" }}>
            Nessuna azione prevista
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: theme.colors.textSoft,
              lineHeight: 1.5,
            }}
          >
            Il programma del viaggio è terminato.
          </p>
        </section>
      )}

      {nextActions.length > 0 && (
        <section style={{ marginTop: 27 }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 21 }}>
            Subito dopo
          </h2>

          <div style={{ display: "grid", gap: 11 }}>
            {nextActions
              .filter(
                (action) =>
                  !mainAction ||
                  action.id !== mainAction.id,
              )
              .map((action) => (
                <NextActionCard
                  key={action.id}
                  action={action}
                  now={now}
                />
              ))}
          </div>
        </section>
      )}

      <section
        style={{
          marginTop: 24,
          padding: 19,
          borderRadius: 21,
          background: "rgba(244,213,141,0.08)",
          border:
            "1px solid rgba(244,213,141,0.18)",
        }}
      >
        <strong style={{ color: theme.colors.secondary }}>
          Orari confermati e suggeriti
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          Voli, traghetti e noleggio derivano dalle
          prenotazioni. Gli orari delle visite sono proposte
          flessibili e possono essere modificati sul posto.
        </p>
      </section>
    </main>
  );
}

function NextActionCard({
  action,
  now,
}: {
  action: TripAction;
  now: Date;
}) {
  return (
    <article
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 13,
        padding: 16,
        borderRadius: 20,
        background: theme.colors.card,
        border:
          action.type === "confirmed"
            ? "1px solid rgba(110,212,255,0.20)"
            : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span
        style={{
          width: 45,
          height: 45,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          borderRadius: 15,
          background: "rgba(17,197,191,0.13)",
          fontSize: 21,
        }}
      >
        {action.icon}
      </span>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <strong
            style={{
              fontSize: 15,
              lineHeight: 1.4,
            }}
          >
            {action.title}
          </strong>

          <ActionTypeBadge type={action.type} />
        </div>

        <p
          style={{
            margin: "6px 0 0",
            color: theme.colors.textSoft,
            fontSize: 12,
            lineHeight: 1.45,
          }}
        >
          {formatFullDate(action.dateTime)}
        </p>

        <p
          style={{
            margin: "7px 0 0",
            color: theme.colors.primary,
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {getDifferenceText(
            new Date(action.dateTime),
            now,
          )}
        </p>
      </div>
    </article>
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
      ? "#6ED4FF"
      : type === "suggested"
        ? "#F4D58D"
        : "#FFB86B";

  return (
    <span
      style={{
        flexShrink: 0,
        padding: "5px 7px",
        borderRadius: 999,
        background: `${color}18`,
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
          fontSize: 10,
          opacity: 0.7,
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

export default WhatNow;