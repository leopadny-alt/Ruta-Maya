import { useMemo, useState } from "react";
import { restaurants } from "../data/restaurants";
import { theme } from "../styles/theme";

const cities = [
  "Tutti",
  ...Array.from(
    new Set(restaurants.map((restaurant) => restaurant.city)),
  ),
];

function FoodGuide() {
  const [selectedCity, setSelectedCity] = useState("Tutti");

  const filteredRestaurants = useMemo(() => {
    if (selectedCity === "Tutti") {
      return restaurants;
    }

    return restaurants.filter(
      (restaurant) => restaurant.city === selectedCity,
    );
  }, [selectedCity]);

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
        Dove mangiare
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Food Guide
      </h1>

      <p
        style={{
          marginTop: 0,
          marginBottom: 22,
          color: theme.colors.textSoft,
        }}
      >
        Una prima selezione per ogni tappa
      </p>

      <div
        style={{
          display: "flex",
          gap: 9,
          marginBottom: 22,
          paddingBottom: 5,
          overflowX: "auto",
        }}
      >
        {cities.map((city) => {
          const isActive = selectedCity === city;

          return (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              style={{
                flexShrink: 0,
                padding: "10px 14px",
                border: isActive
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.12)",
                borderRadius: 999,
                background: isActive
                  ? theme.colors.primary
                  : theme.colors.card,
                color: isActive
                  ? theme.colors.background
                  : theme.colors.text,
                fontWeight: 750,
                cursor: "pointer",
              }}
            >
              {city}
            </button>
          );
        })}
      </div>

      <section style={{ display: "grid", gap: 15 }}>
        {filteredRestaurants.map((restaurant) => (
          <article
            key={restaurant.id}
            style={{
              padding: 20,
              borderRadius: 23,
              background: theme.colors.card,
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 15,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: theme.colors.secondary,
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {restaurant.city}
                </p>

                <h2
                  style={{
                    margin: "6px 0 0",
                    fontSize: 21,
                  }}
                >
                  {restaurant.name}
                </h2>
              </div>

              <span
                style={{
                  height: "fit-content",
                  padding: "7px 10px",
                  borderRadius: 999,
                  background: "rgba(17,197,191,0.16)",
                  color: theme.colors.primary,
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {restaurant.price}
              </span>
            </div>

            <p
              style={{
                margin: "9px 0 0",
                color: theme.colors.primary,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {restaurant.category}
            </p>

            <p
              style={{
                margin: "13px 0 0",
                color: theme.colors.textSoft,
                lineHeight: 1.55,
              }}
            >
              {restaurant.description}
            </p>

            <div
              style={{
                marginTop: 15,
                padding: "11px 13px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                color: theme.colors.textSoft,
                fontSize: 14,
              }}
            >
              ⭐ Ideale per: {restaurant.recommendedFor}
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                restaurant.mapsQuery,
              )}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                marginTop: 16,
                padding: "13px 15px",
                borderRadius: 16,
                background: theme.colors.primary,
                color: theme.colors.background,
                textAlign: "center",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Apri in Google Maps
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
        Controllare disponibilità, orari e prenotazioni prima di
        raggiungere il locale.
      </p>
    </main>
  );
}

export default FoodGuide;