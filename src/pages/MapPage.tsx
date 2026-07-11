import {
  useEffect,
  useMemo,
  useState,
} from "react";
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

const FAVORITES_KEY =
  "ruta-maya-map-favorites";

const accommodationLocations: MapLocation[] =
  accommodations.map((accommodation) => ({
    id: 100 + accommodation.id,
    name: `Alloggio ${accommodation.location}`,
    type: "accommodation",
    latitude: accommodation.latitude,
    longitude: accommodation.longitude,
    description: accommodation.description,
    details: `${accommodation.dates} · ${accommodation.nights}`,
    externalUrl: accommodation.url,
  }));

const restaurantLocations: MapLocation[] =
  restaurants.map((restaurant) => ({
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
  }));

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
    locations.find(
      (location) => location.name === name,
    ),
  )
  .filter(
    (location): location is MapLocation =>
      location !== undefined,
  )
  .map(
    (location) =>
      [
        location.latitude,
        location.longitude,
      ] as [number, number],
  );

const categoryConfig: Record<
  MapLocationType,
  {
    label: string;
    icon: string;
    color: string;
  }
> = {
  city: {
    label: "Città",
    icon: "🏙️",
    color: "#11C5BF",
  },
  beach: {
    label: "Mare",
    icon: "🏝️",
    color: "#48B8E8",
  },
  ruins: {
    label: "Siti Maya",
    icon: "🗿",
    color: "#F4D58D",
  },
  cenote: {
    label: "Cenote",
    icon: "💧",
    color: "#6ED4FF",
  },
  ferry: {
    label: "Traghetti",
    icon: "⛴️",
    color: "#BFA7FF",
  },
  accommodation: {
    label: "Alloggi",
    icon: "🏨",
    color: "#FFB86B",
  },
  restaurant: {
    label: "Ristoranti",
    icon: "🍽️",
    color: "#FF8E8E",
  },
};

const categories: {
  id: FilterType;
  label: string;
  icon: string;
}[] = [
  {
    id: "all",
    label: "Tutti",
    icon: "✦",
  },
  {
    id: "city",
    label: "Città",
    icon: "🏙️",
  },
  {
    id: "beach",
    label: "Mare",
    icon: "🏝️",
  },
  {
    id: "ruins",
    label: "Maya",
    icon: "🗿",
  },
  {
    id: "cenote",
    label: "Cenote",
    icon: "💧",
  },
  {
    id: "ferry",
    label: "Traghetti",
    icon: "⛴️",
  },
  {
    id: "accommodation",
    label: "Alloggi",
    icon: "🏨",
  },
  {
    id: "restaurant",
    label: "Ristoranti",
    icon: "🍽️",
  },
];

function createMarkerIcon(
  type: MapLocationType,
) {
  const config = categoryConfig[type];

  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          position: relative;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 15px 15px 15px 4px;
          transform: rotate(-45deg);
          background: rgba(7,26,46,0.96);
          border: 3px solid ${config.color};
          box-shadow: 0 10px 24px rgba(0,0,0,0.42);
        "
      >
        <span
          style="
            display: block;
            transform: rotate(45deg);
            font-size: 19px;
            line-height: 1;
          "
        >
          ${config.icon}
        </span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
}

function getGoogleMapsUrl(
  location: MapLocation,
) {
  return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
}

function MapPage() {
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<FilterType>("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [favoriteIds, setFavoriteIds] =
    useState<number[]>([]);

  const [showFavorites, setShowFavorites] =
    useState(false);

  useEffect(() => {
    const savedFavorites =
      localStorage.getItem(FAVORITES_KEY);

    if (!savedFavorites) {
      return;
    }

    try {
      const parsedFavorites =
        JSON.parse(savedFavorites);

      if (Array.isArray(parsedFavorites)) {
        setFavoriteIds(parsedFavorites);
      }
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

      const matchesFavorites =
        !showFavorites ||
        favoriteIds.includes(location.id);

      const searchableText = [
        location.name,
        location.description,
        location.details ?? "",
        categoryConfig[location.type].label,
      ]
        .join(" ")
        .toLocaleLowerCase("it");

      const matchesSearch =
        !normalizedQuery ||
        searchableText.includes(normalizedQuery);

      return (
        matchesCategory &&
        matchesFavorites &&
        matchesSearch
      );
    });
  }, [
    favoriteIds,
    searchQuery,
    selectedCategory,
    showFavorites,
  ]);

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

  function resetFilters() {
    setSelectedCategory("all");
    setSearchQuery("");
    setShowFavorites(false);
  }

  const hasActiveFilters =
    selectedCategory !== "all" ||
    searchQuery.trim() !== "" ||
    showFavorites;

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding:
          "calc(23px + env(safe-area-inset-top)) 18px 116px",
        background: `
          radial-gradient(
            circle at 92% 4%,
            rgba(72,184,232,0.15),
            transparent 27%
          ),
          radial-gradient(
            circle at 4% 45%,
            rgba(17,197,191,0.08),
            transparent 26%
          ),
          linear-gradient(
            180deg,
            ${theme.colors.background},
            ${theme.colors.backgroundGradient}
          )
        `,
        color: theme.colors.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <header>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: theme.colors.primary,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              Road trip
            </p>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize: 34,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              Smart Map
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                color: theme.colors.textSoft,
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              Tutto il viaggio su una sola mappa.
            </p>
          </div>

          <div
            style={{
              width: 55,
              height: 55,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(72,184,232,0.24), rgba(17,197,191,0.17))",
              border:
                "1px solid rgba(255,255,255,0.11)",
              boxShadow:
                "0 14px 32px rgba(0,0,0,0.22)",
              fontSize: 25,
            }}
          >
            🗺️
          </div>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: 8,
            marginTop: 23,
          }}
        >
          <MapStat
            value={allLocations.length}
            label="luoghi"
          />

          <MapStat
            value={routeNames.length - 3}
            label="tappe"
          />

          <MapStat
            value={favoriteIds.length}
            label="preferiti"
          />
        </section>

        <div
          style={{
            position: "relative",
            marginTop: 18,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: 15,
              zIndex: 1,
              transform: "translateY(-50%)",
              color: theme.colors.textSoft,
              fontSize: 18,
            }}
          >
            ⌕
          </span>

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Cerca città, cenote, ristorante…"
            aria-label="Cerca un luogo"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 44px 14px 45px",
              border:
                "1px solid rgba(255,255,255,0.10)",
              borderRadius: 18,
              outline: "none",
              background:
                "rgba(255,255,255,0.07)",
              boxShadow:
                "0 11px 28px rgba(0,0,0,0.12)",
              color: theme.colors.text,
              fontSize: 15,
            }}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Cancella ricerca"
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                width: 31,
                height: 31,
                display: "grid",
                placeItems: "center",
                transform: "translateY(-50%)",
                border: 0,
                borderRadius: 10,
                background:
                  "rgba(255,255,255,0.07)",
                color: theme.colors.textSoft,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
            paddingBottom: 4,
            overflowX: "auto",
          }}
        >
          {categories.map((category) => {
            const isActive =
              selectedCategory === category.id;

            const color =
              category.id === "all"
                ? theme.colors.primary
                : categoryConfig[category.id]
                    .color;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(category.id)
                }
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 12px",
                  border: `1px solid ${
                    isActive
                      ? color
                      : "rgba(255,255,255,0.10)"
                  }`,
                  borderRadius: 999,
                  background: isActive
                    ? color
                    : "rgba(255,255,255,0.055)",
                  color: isActive
                    ? theme.colors.background
                    : theme.colors.text,
                  fontSize: 11,
                  fontWeight: 850,
                  cursor: "pointer",
                }}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 9,
          }}
        >
          <button
            type="button"
            onClick={() =>
              setShowFavorites(
                (currentValue) => !currentValue,
              )
            }
            style={{
              padding: "8px 11px",
              border: `1px solid ${
                showFavorites
                  ? theme.colors.secondary
                  : "rgba(255,255,255,0.10)"
              }`,
              borderRadius: 999,
              background: showFavorites
                ? "rgba(244,213,141,0.15)"
                : "rgba(255,255,255,0.045)",
              color: showFavorites
                ? theme.colors.secondary
                : theme.colors.textSoft,
              fontSize: 10,
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            {showFavorites ? "★" : "☆"} Preferiti
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                padding: "8px 11px",
                border: 0,
                background: "transparent",
                color: theme.colors.primary,
                fontSize: 10,
                fontWeight: 850,
                cursor: "pointer",
              }}
            >
              Azzera filtri
            </button>
          )}
        </div>
      </header>

      <section
        style={{
          position: "relative",
          marginTop: 20,
          overflow: "hidden",
          borderRadius: 27,
          border:
            "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 22px 50px rgba(0,0,0,0.30)",
        }}
      >
        <MapContainer
          center={[20.75, -88.2]}
          zoom={7}
          scrollWheelZoom
          style={{
            width: "100%",
            height: "56vh",
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
              opacity: 0.72,
              dashArray: "10 7",
            }}
          />

          {visibleLocations.map((location) => {
            const config =
              categoryConfig[location.type];

            return (
              <Marker
                key={location.id}
                position={[
                  location.latitude,
                  location.longitude,
                ]}
                icon={createMarkerIcon(
                  location.type,
                )}
              >
                <Popup>
                  <div
                    style={{
                      minWidth: 190,
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                      }}
                    >
                      {config.icon}
                    </span>

                    <strong
                      style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 16,
                      }}
                    >
                      {location.name}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: config.color,
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {config.label}
                    </span>

                    {location.details && (
                      <p
                        style={{
                          margin:
                            "8px 0 0",
                          fontSize: 12,
                          lineHeight: 1.4,
                        }}
                      >
                        {location.details}
                      </p>
                    )}

                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 12,
                        lineHeight: 1.45,
                      }}
                    >
                      {location.description}
                    </p>

                    <a
                      href={getGoogleMapsUrl(
                        location,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        marginTop: 12,
                        fontWeight: 800,
                      }}
                    >
                      Portami qui →
                    </a>

                    {location.externalUrl && (
                      <a
                        href={location.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "block",
                          marginTop: 8,
                          fontWeight: 800,
                        }}
                      >
                        Apri dettagli →
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            zIndex: 500,
            padding: "8px 11px",
            borderRadius: 999,
            background:
              "rgba(7,26,46,0.88)",
            border:
              "1px solid rgba(255,255,255,0.12)",
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: 800,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter:
              "blur(12px)",
          }}
        >
          📍 {visibleLocations.length} luoghi
          visibili
        </div>
      </section>

      <section
        style={{
          marginTop: 25,
        }}
      >
        <SectionHeading
          title={
            showFavorites
              ? "I tuoi preferiti"
              : "Esplora i luoghi"
          }
          count={visibleLocations.length}
        />

        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 14,
          }}
        >
          {visibleLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              isFavorite={favoriteIds.includes(
                location.id,
              )}
              onToggleFavorite={() =>
                toggleFavorite(location.id)
              }
            />
          ))}
        </div>

        {visibleLocations.length === 0 && (
          <div
            style={{
              marginTop: 14,
              padding: 27,
              borderRadius: 23,
              background:
                "rgba(255,255,255,0.06)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 35 }}>
              🗺️
            </span>

            <h2
              style={{
                margin: "13px 0 0",
                fontSize: 19,
              }}
            >
              Nessun luogo visibile
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: theme.colors.textSoft,
                fontSize: 13,
              }}
            >
              Modifica la ricerca o azzera i
              filtri.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              style={{
                marginTop: 15,
                padding: "10px 14px",
                border: 0,
                borderRadius: 13,
                background: theme.colors.primary,
                color: theme.colors.background,
                fontWeight: 850,
                cursor: "pointer",
              }}
            >
              Azzera filtri
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function MapStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        padding: "13px 7px",
        borderRadius: 17,
        background:
          "rgba(255,255,255,0.06)",
        border:
          "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}
    >
      <strong
        style={{
          display: "block",
          color: theme.colors.primary,
          fontSize: 21,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 4,
          color: theme.colors.textSoft,
          fontSize: 9,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionHeading({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 14,
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: theme.colors.primary,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          Smart Map
        </p>

        <h2
          style={{
            margin: "5px 0 0",
            fontSize: 22,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </h2>
      </div>

      <span
        style={{
          padding: "6px 9px",
          borderRadius: 999,
          background:
            "rgba(17,197,191,0.12)",
          color: theme.colors.primary,
          fontSize: 10,
          fontWeight: 900,
        }}
      >
        {count}
      </span>
    </div>
  );
}

function LocationCard({
  location,
  isFavorite,
  onToggleFavorite,
}: {
  location: MapLocation;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const config =
    categoryConfig[location.type];

  return (
    <article
      style={{
        padding: 15,
        borderRadius: 21,
        background:
          "rgba(255,255,255,0.06)",
        border: `1px solid ${config.color}24`,
        boxShadow:
          "0 9px 24px rgba(0,0,0,0.11)",
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
            width: 46,
            height: 46,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            borderRadius: 15,
            background: `${config.color}17`,
            fontSize: 21,
          }}
        >
          {config.icon}
        </span>

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 7,
            }}
          >
            <strong
              style={{
                fontSize: 16,
                lineHeight: 1.3,
              }}
            >
              {location.name}
            </strong>

            <span
              style={{
                padding: "4px 6px",
                borderRadius: 999,
                background: `${config.color}14`,
                color: config.color,
                fontSize: 8,
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              {config.label}
            </span>
          </div>

          {location.details && (
            <span
              style={{
                display: "block",
                marginTop: 6,
                color: config.color,
                fontSize: 11,
                fontWeight: 750,
                lineHeight: 1.4,
              }}
            >
              {location.details}
            </span>
          )}

          <p
            style={{
              margin: "7px 0 0",
              color: theme.colors.textSoft,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            {location.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={
            isFavorite
              ? "Rimuovi dai preferiti"
              : "Aggiungi ai preferiti"
          }
          style={{
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            padding: 0,
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: 13,
            background: isFavorite
              ? "rgba(244,213,141,0.12)"
              : "rgba(255,255,255,0.04)",
            color: isFavorite
              ? theme.colors.secondary
              : theme.colors.textSoft,
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            location.externalUrl
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
            padding: "11px 10px",
            borderRadius: 14,
            background: theme.colors.primary,
            color: theme.colors.background,
            textAlign: "center",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 850,
          }}
        >
          📍 Portami qui
        </a>

        {location.externalUrl && (
          <a
            href={location.externalUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "11px 10px",
              borderRadius: 14,
              background: `${config.color}18`,
              border: `1px solid ${config.color}28`,
              color: config.color,
              textAlign: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 850,
            }}
          >
            Apri dettagli
          </a>
        )}
      </div>
    </article>
  );
}

export default MapPage;