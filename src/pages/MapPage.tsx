import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from "react-leaflet";
import {
  locations,
  type MapLocation,
  type MapLocationType,
} from "../data/locations";
import { accommodations } from "../data/accommodations";
import { restaurants } from "../data/restaurants";
import { theme } from "../styles/theme";

type FilterType = MapLocationType | "all";

const FAVORITES_KEY = "ruta-maya-map-favorites";

const accommodationLocations: MapLocation[] = accommodations.map(
  (accommodation) => ({
    id: 100 + accommodation.id,
    name: `Alloggio ${accommodation.location}`,
    type: "accommodation",
    latitude: accommodation.latitude,
    longitude: accommodation.longitude,
    description: accommodation.description,
    details: `${accommodation.dates} · ${accommodation.nights}`,
    externalUrl: accommodation.url,
  }),
);

const restaurantLocations: MapLocation[] = restaurants.map(
  (restaurant) => ({
    id: 200 + restaurant.id,
    name: restaurant.name,
    type: "restaurant",
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    description: restaurant.description,
    details: `${restaurant.city} · ${restaurant.category} · ${restaurant.price}`,
    externalUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      restaurant.mapsQuery,
    )}`,
  }),
);

const allLocations: MapLocation[] = [
  ...locations,
  ...accommodationLocations,
  ...restaurantLocations,
];

const routeNames = [
  "Cancún",
  "Isla Mujeres",
  "Puerto Morelos",
  "Tulum",
  "Valladolid",
  "Ek’ Balam",
  "Valladolid",
  "Chichén Itzá",
  "Cenote Yokdzonot",
  "Mérida",
  "Uxmal",
  "Kabah",
  "Mérida",
  "Chiquilá",
  "Isla Holbox",
  "Chiquilá",
  "Cancún",
];

const route = routeNames
  .map((name) =>
    locations.find((location) => location.name === name),
  )
  .filter(
    (location): location is MapLocation =>
      location !== undefined,
  )
  .map(
    (location) =>
      [location.latitude, location.longitude] as [
        number,
        number,
      ],
  );

const categoryConfig: Record<
  MapLocationType,
  {
    label: string;
    shortLabel: string;
    color: string;
  }
> = {
  city: {
    label: "Città",
    shortLabel: "C",
    color: "#11C5BF",
  },
  beach: {
    label: "Mare",
    shortLabel: "M",
    color: "#48B8E8",
  },
  ruins: {
    label: "Siti Maya",
    shortLabel: "S",
    color: "#F4D58D",
  },
  cenote: {
    label: "Cenote",
    shortLabel: "O",
    color: "#6ED4FF",
  },
  ferry: {
    label: "Traghetti",
    shortLabel: "T",
    color: "#BFA7FF",
  },
  accommodation: {
    label: "Alloggi",
    shortLabel: "A",
    color: "#FFB86B",
  },
  restaurant: {
    label: "Ristoranti",
    shortLabel: "R",
    color: "#FF8E8E",
  },
};

const categories: {
  id: FilterType;
  label: string;
}[] = [
  { id: "all", label: "Tutti" },
  { id: "city", label: "Città" },
  { id: "beach", label: "Mare" },
  { id: "ruins", label: "Siti Maya" },
  { id: "cenote", label: "Cenote" },
  { id: "ferry", label: "Traghetti" },
  { id: "accommodation", label: "Alloggi" },
  { id: "restaurant", label: "Ristoranti" },
];

function createMarkerIcon(type: MapLocationType) {
  const config = categoryConfig[type];

  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #071A2E;
          border: 3px solid ${config.color};
          color: ${config.color};
          font-family: Arial, sans-serif;
          font-size: 15px;
          font-weight: 900;
          box-shadow: 0 8px 18px rgba(0,0,0,0.38);
        "
      >
        ${config.shortLabel}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

function getGoogleMapsUrl(location: MapLocation) {
  return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
}

function MapPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterType>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);

    if (!savedFavorites) {
      return;
    }

    try {
      setFavoriteIds(JSON.parse(savedFavorites));
    } catch {
      localStorage.removeItem(FAVORITES_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favoriteIds),
    );
  }, [favoriteIds]);

  const visibleLocations = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLocaleLowerCase("it");

    return allLocations.filter((location) => {
      const matchesCategory =
        selectedCategory === "all" ||
        location.type === selectedCategory;

      const matchesSearch =
        !normalizedQuery ||
        location.name
          .toLocaleLowerCase("it")
          .includes(normalizedQuery) ||
        location.description
          .toLocaleLowerCase("it")
          .includes(normalizedQuery) ||
        location.details
          ?.toLocaleLowerCase("it")
          .includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  function toggleFavorite(id: number) {
    setFavoriteIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter(
          (favoriteId) => favoriteId !== id,
        );
      }

      return [...currentIds, id];
    });
  }

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
        Road trip
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Smart Map
      </h1>

      <p
        style={{
          marginTop: 0,
          marginBottom: 18,
          color: theme.colors.textSoft,
        }}
      >
        Tappe, alloggi e ristoranti in un’unica mappa
      </p>

      <input
        type="search"
        value={searchQuery}
        onChange={(event) =>
          setSearchQuery(event.target.value)
        }
        placeholder="Cerca un luogo..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginBottom: 14,
          padding: "14px 16px",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 17,
          outline: "none",
          background: "rgba(255,255,255,0.09)",
          color: theme.colors.text,
          fontSize: 16,
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 9,
          marginBottom: 18,
          paddingBottom: 5,
          overflowX: "auto",
        }}
      >
        {categories.map((category) => {
          const isActive =
            selectedCategory === category.id;

          const categoryColor =
            category.id === "all"
              ? theme.colors.primary
              : categoryConfig[category.id].color;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                setSelectedCategory(category.id)
              }
              style={{
                flexShrink: 0,
                padding: "10px 14px",
                border: `1px solid ${
                  isActive
                    ? categoryColor
                    : "rgba(255,255,255,0.12)"
                }`,
                borderRadius: 999,
                background: isActive
                  ? categoryColor
                  : theme.colors.card,
                color: isActive
                  ? theme.colors.background
                  : theme.colors.text,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <section
        style={{
          overflow: "hidden",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
        }}
      >
        <MapContainer
          center={[20.75, -88.2]}
          zoom={7}
          scrollWheelZoom
          style={{
            width: "100%",
            height: "58vh",
            minHeight: 430,
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline
            positions={route}
            pathOptions={{
              color: theme.colors.primary,
              weight: 4,
              opacity: 0.75,
            }}
          />

          {visibleLocations.map((location) => {
            const config = categoryConfig[location.type];

            return (
              <Marker
                key={location.id}
                position={[
                  location.latitude,
                  location.longitude,
                ]}
                icon={createMarkerIcon(location.type)}
              >
                <Popup>
                  <strong>
                    {config.shortLabel} · {location.name}
                  </strong>

                  {location.details && (
                    <p>{location.details}</p>
                  )}

                  <p>{location.description}</p>

                  <a
                    href={getGoogleMapsUrl(location)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Apri in Google Maps
                  </a>

                  {location.externalUrl && (
                    <>
                      <br />
                      <br />

                      <a
                        href={location.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Apri collegamento
                      </a>
                    </>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </section>

      <section style={{ marginTop: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 21 }}>
            Luoghi visibili
          </h2>

          <span
            style={{
              padding: "7px 10px",
              borderRadius: 999,
              background: "rgba(17,197,191,0.16)",
              color: theme.colors.primary,
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            {visibleLocations.length}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gap: 11,
            marginTop: 14,
          }}
        >
          {visibleLocations.map((location) => {
            const config = categoryConfig[location.type];
            const isFavorite = favoriteIds.includes(location.id);

            return (
              <article
                key={location.id}
                style={{
                  padding: 16,
                  borderRadius: 20,
                  background: theme.colors.card,
                  border: `1px solid ${config.color}35`,
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
                      width: 43,
                      height: 43,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      borderRadius: 14,
                      background: `${config.color}20`,
                      color: config.color,
                      fontSize: 15,
                      fontWeight: 900,
                    }}
                  >
                    {config.shortLabel}
                  </span>

                  <span style={{ flex: 1 }}>
                    <strong
                      style={{
                        display: "block",
                        fontSize: 16,
                      }}
                    >
                      {location.name}
                    </strong>

                    {location.details && (
                      <span
                        style={{
                          display: "block",
                          marginTop: 4,
                          color: config.color,
                          fontSize: 12,
                          fontWeight: 750,
                        }}
                      >
                        {location.details}
                      </span>
                    )}

                    <span
                      style={{
                        display: "block",
                        marginTop: 6,
                        color: theme.colors.textSoft,
                        fontSize: 13,
                        lineHeight: 1.4,
                      }}
                    >
                      {location.description}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite(location.id)
                    }
                    aria-label={
                      isFavorite
                        ? "Rimuovi dai preferiti"
                        : "Aggiungi ai preferiti"
                    }
                    style={{
                      padding: 0,
                      border: 0,
                      background: "transparent",
                      color: isFavorite
                        ? theme.colors.secondary
                        : theme.colors.textSoft,
                      fontSize: 24,
                      cursor: "pointer",
                    }}
                  >
                    {isFavorite ? "★" : "☆"}
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: location.externalUrl
                      ? "1fr 1fr"
                      : "1fr",
                    gap: 8,
                    marginTop: 14,
                  }}
                >
                  <a
                    href={getGoogleMapsUrl(location)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "11px 12px",
                      borderRadius: 14,
                      background: theme.colors.primary,
                      color: theme.colors.background,
                      textAlign: "center",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    Portami qui
                  </a>

                  {location.externalUrl && (
                    <a
                      href={location.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "11px 12px",
                        borderRadius: 14,
                        background: theme.colors.secondary,
                        color: theme.colors.background,
                        textAlign: "center",
                        textDecoration: "none",
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      Apri dettagli
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {visibleLocations.length === 0 && (
          <div
            style={{
              marginTop: 14,
              padding: 20,
              borderRadius: 20,
              background: theme.colors.card,
              color: theme.colors.textSoft,
              textAlign: "center",
            }}
          >
            Nessun luogo corrisponde alla ricerca.
          </div>
        )}
      </section>
    </main>
  );
}

export default MapPage;