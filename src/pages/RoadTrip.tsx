import { roadTrip } from "../data/roadTrip";
import { theme } from "../styles/theme";

function RoadTrip() {
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
          fontWeight: 800,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        Spostamenti
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Road Trip
      </h1>

      <p
        style={{
          marginTop: 0,
          marginBottom: 26,
          color: theme.colors.textSoft,
        }}
      >
        Tratte principali, tempi e soste consigliate
      </p>

      <section style={{ display: "grid", gap: 15 }}>
        {roadTrip.map((leg) => (
          <article
            key={leg.id}
            style={{
              padding: 20,
              borderRadius: 23,
              background: theme.colors.card,
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: theme.colors.secondary,
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {leg.day} · {leg.transport}
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                fontSize: 21,
              }}
            >
              {leg.from} → {leg.to}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginTop: 16,
              }}
            >
              <div style={infoCardStyle}>
                <span>📏</span>
                <strong>{leg.distance}</strong>
              </div>

              <div style={infoCardStyle}>
                <span>⏱️</span>
                <strong>{leg.duration}</strong>
              </div>
            </div>

            <p
              style={{
                margin: "16px 0 0",
                color: theme.colors.textSoft,
                lineHeight: 1.5,
              }}
            >
              {leg.notes}
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                leg.mapsQuery,
              )}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                marginTop: 17,
                padding: "13px 15px",
                borderRadius: 16,
                background: theme.colors.primary,
                color: theme.colors.background,
                textAlign: "center",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Apri percorso
            </a>
          </article>
        ))}
      </section>

      <p
        style={{
          margin: "22px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        Tempi e distanze sono indicativi. Verificare traffico, lavori
        stradali e condizioni del percorso prima della partenza.
      </p>
    </main>
  );
}

const infoCardStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 7,
  padding: 13,
  borderRadius: 15,
  background: "rgba(255,255,255,0.06)",
  fontSize: 13,
};

export default RoadTrip;