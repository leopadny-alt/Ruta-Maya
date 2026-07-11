import { accommodations } from "../data/accommodations";
import { theme } from "../styles/theme";

function Accommodations() {
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
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          fontSize: 13,
        }}
      >
        Prenotazioni
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Alloggi
      </h1>

      <p
        style={{
          marginTop: 0,
          marginBottom: 28,
          color: theme.colors.textSoft,
        }}
      >
        6 strutture · 9 notti
      </p>

      <section style={{ display: "grid", gap: 16 }}>
        {accommodations.map((accommodation) => (
          <article
            key={accommodation.id}
            style={{
              padding: 20,
              borderRadius: 24,
              background: theme.colors.card,
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  borderRadius: 18,
                  background: "rgba(17,197,191,0.18)",
                  fontSize: 27,
                }}
              >
                {accommodation.icon}
              </div>

              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 21,
                  }}
                >
                  {accommodation.location}
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: theme.colors.textSoft,
                    fontSize: 14,
                  }}
                >
                  {accommodation.dates} · {accommodation.nights}
                </p>
              </div>
            </div>

            <a
              href={accommodation.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                marginTop: 18,
                padding: "13px 16px",
                borderRadius: 16,
                background: theme.colors.primary,
                color: theme.colors.background,
                textAlign: "center",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Apri su Airbnb
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Accommodations;