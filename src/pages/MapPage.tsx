import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  locations,
  type MapLocation,
  type MapLocationType,
} from "../data/locations";
import { accommodations } from "../data/accommodations";
import { itinerary } from "../data/itinerary";
import { restaurants } from "../data/restaurants";
import { theme } from "../styles/theme";
import { getAppDate } from "../utils/travelClock";

type FilterType = MapLocationType | "all";
type ViewMode = "today" | "all" | "favorites";

const FAVORITES_KEY =
  "ruta-maya-map-favorites";

const TRIP_START = new Date("2026-08-06T00:00:00");
const TRIP_END = new Date("2026-08-15T23:59:59");

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
    color: string;
  }
> = {
  city: {
    label: "Città",
    color: theme.colors.primary,
  },
  beach: {
    label: "Mare",
    color: theme.colors.info,
  },
  ruins: {
    label: "Siti Maya",
    color: theme.colors.secondary,
  },
  cenote: {
    label: "Cenote",
    color: "#74D7FF",
  },
  ferry: {
    label: "Traghetti",
    color: "#C7AEFF",
  },
  accommodation: {
    label: "Alloggi",
    color: theme.colors.warning,
  },
  restaurant: {
    label: "Ristoranti",
    color: theme.colors.danger,
  },
};

const categories: {
  id: FilterType;
  label: string;
}[] = [
  { id: "all", label: "Tutti" },
  { id: "city", label: "Città" },
  { id: "beach", label: "Mare" },
  { id: "ruins", label: "Maya" },
  { id: "cenote", label: "Cenote" },
  { id: "ferry", label: "Traghetti" },
  {
    id: "accommodation",
    label: "Alloggi",
  },
  {
    id: "restaurant",
    label: "Ristoranti",
  },
];

const cityDayMap: Record<string, number[]> = {
  cancún: [1, 3, 9, 10],
  "isla mujeres": [1, 2],
  tulum: [3, 4],
  valladolid: [4, 5, 6],
  mérida: [6, 7, 8],
  "isla holbox": [8, 9],
  holbox: [8, 9],
};

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getCurrentTripDay() {
  const today = getAppDate();

  if (today < TRIP_START || today > TRIP_END) {
    return undefined;
  }

  const normalizedToday = new Date(today);
  const normalizedStart = new Date(TRIP_START);

  normalizedToday.setHours(0, 0, 0, 0);
  normalizedStart.setHours(0, 0, 0, 0);

  return (
    Math.floor(
      (normalizedToday.getTime() -
        normalizedStart.getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1
  );
}

function getLocationDays(
  location: MapLocation,
): number[] {
  const details = location.details ?? "";

  const explicitRange = details.match(
    /Giorni?\s+(\d+)(?:\s*,\s*(\d+))?(?:\s+e\s+(\d+))?/i,
  );

  if (explicitRange) {
    return explicitRange
      .slice(1)
      .filter(Boolean)
      .map(Number);
  }

  if (location.type === "accommodation") {
    const normalizedName = normalizeText(
      location.name.replace("Alloggio ", ""),
    );

    for (const [city, days] of Object.entries(
      cityDayMap,
    )) {
      if (
        normalizedName.includes(
          normalizeText(city),
        )
      ) {
        return days.filter((day) => day <= 9);
      }
    }
  }

  if (location.type === "restaurant") {
    const normalizedDetails =
      normalizeText(details);

    for (const [city, days] of Object.entries(
      cityDayMap,
    )) {
      if (
        normalizedDetails.includes(
          normalizeText(city),
        )
      ) {
        return days;
      }
    }
  }

  return [];
}

function createMarkerIcon(
  type: MapLocationType,
) {
  const config = categoryConfig[type];

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position:relative;
        width:42px;
        height:42px;
        display:grid;
        place-items:center;
        border-radius:15px 15px 15px 4px;
        transform:rotate(-45deg);
        background:rgba(7,26,46,.96);
        border:3px solid ${config.color};
        box-shadow:0 10px 24px rgba(0,0,0,.42);
      ">
        <span style="
          width:22px;
          height:22px;
          display:grid;
          place-items:center;
          color:${config.color};
          transform:rotate(45deg);
        ">${getMarkerSvgMarkup(type)}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
}

function getMarkerSvgMarkup(
  type: MapLocationType,
) {
  const common =
    'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';

  if (type === "city") {
    return `<svg ${common}><path d="M4 21V9l5-3v15"/><path d="M9 21V4l7 3v14"/><path d="M16 21v-8l4-2v10"/><path d="M2 21h20"/></svg>`;
  }

  if (type === "beach") {
    return `<svg ${common}><circle cx="17" cy="6" r="3"/><path d="M3 17c3-2 6-2 9 0s6 2 9 0"/><path d="M4 21h16"/><path d="M8 15c1-4 3-7 6-9"/></svg>`;
  }

  if (type === "ruins") {
    return `<svg ${common}><path d="M4 20h16"/><path d="m6 20 2-4h8l2 4"/><path d="m8 16 2-4h4l2 4"/><path d="m10 12 2-5 2 5"/></svg>`;
  }

  if (type === "cenote") {
    return `<svg ${common}><path d="M12 3s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12Z"/></svg>`;
  }

  if (type === "ferry") {
    return `<svg ${common}><path d="M4 13 12 5l8 8"/><path d="M6 13h12l-2 6H8Z"/><path d="M3 21c2-1 4-1 6 0 2-1 4-1 6 0 2-1 4-1 6 0"/></svg>`;
  }

  if (type === "accommodation") {
    return `<svg ${common}><path d="M3 19v-8"/><path d="M21 19v-6a3 3 0 0 0-3-3H7a4 4 0 0 0-4 4"/><path d="M3 16h18"/><path d="M7 10V7h5a3 3 0 0 1 3 3"/></svg>`;
  }

  return `<svg ${common}><path d="M7 3v8"/><path d="M4 3v5a3 3 0 0 0 6 0V3"/><path d="M7 11v10"/><path d="M17 3v18"/><path d="M17 3c3 2 3 7 0 9"/></svg>`;
}

function getGoogleMapsUrl(
  location: MapLocation,
) {
  return `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
}

function MapAutoFit({
  locationsToFit,
}: {
  locationsToFit: MapLocation[];
}) {
  const map = useMap();

  useEffect(() => {
    window.setTimeout(() => {
      map.invalidateSize();

      if (locationsToFit.length === 0) {
        map.setView([20.75, -88.2], 7);
        return;
      }

      if (locationsToFit.length === 1) {
        map.setView(
          [
            locationsToFit[0].latitude,
            locationsToFit[0].longitude,
          ],
          12,
        );
        return;
      }

      const bounds = L.latLngBounds(
        locationsToFit.map(
          (location) =>
            [
              location.latitude,
              location.longitude,
            ] as [number, number],
        ),
      );

      map.fitBounds(bounds, {
        paddingTopLeft: [38, 38],
        paddingBottomRight: [38, 120],
        maxZoom: 11,
      });
    }, 80);
  }, [locationsToFit, map]);

  return null;
}

function MapPage() {
  const currentTripDay = getCurrentTripDay();

  const [viewMode, setViewMode] =
    useState<ViewMode>(
      currentTripDay ? "today" : "all",
    );

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<FilterType>("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [favoriteIds, setFavoriteIds] =
    useState<number[]>([]);

  const [expandedDays, setExpandedDays] =
    useState<number[]>(
      currentTripDay ? [currentTripDay] : [1],
    );

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
    const normalizedQuery = normalizeText(
      searchQuery.trim(),
    );

    return allLocations.filter((location) => {
      const matchesCategory =
        selectedCategory === "all" ||
        location.type === selectedCategory;

      const locationDays =
        getLocationDays(location);

      const matchesView =
        viewMode === "all" ||
        (viewMode === "favorites" &&
          favoriteIds.includes(location.id)) ||
        (viewMode === "today" &&
          currentTripDay !== undefined &&
          locationDays.includes(currentTripDay));

      const searchableText = normalizeText(
        [
          location.name,
          location.description,
          location.details ?? "",
          categoryConfig[location.type].label,
        ].join(" "),
      );

      const matchesSearch =
        !normalizedQuery ||
        searchableText.includes(normalizedQuery);

      return (
        matchesCategory &&
        matchesView &&
        matchesSearch
      );
    });
  }, [
    currentTripDay,
    favoriteIds,
    searchQuery,
    selectedCategory,
    viewMode,
  ]);

  const groupedLocations = useMemo(() => {
    return itinerary
      .map((tripDay) => ({
        day: tripDay.day,
        date: tripDay.date,
        title: tripDay.title,
        locations: visibleLocations.filter(
          (location) =>
            getLocationDays(location).includes(
              tripDay.day,
            ),
        ),
      }))
      .filter(
        (group) =>
          group.locations.length > 0,
      );
  }, [visibleLocations]);

  const ungroupedLocations = useMemo(
    () =>
      visibleLocations.filter(
        (location) =>
          getLocationDays(location).length === 0,
      ),
    [visibleLocations],
  );

  function toggleFavorite(id: number) {
    setFavoriteIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter(
            (favoriteId) =>
              favoriteId !== id,
          )
        : [...currentIds, id],
    );
  }

  function toggleDay(day: number) {
    setExpandedDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter(
            (currentDay) =>
              currentDay !== day,
          )
        : [...currentDays, day],
    );
  }

  function changeViewMode(mode: ViewMode) {
    setViewMode(mode);

    if (
      mode === "today" &&
      currentTripDay
    ) {
      setExpandedDays([currentTripDay]);
    }
  }

  function resetFilters() {
    setSelectedCategory("all");
    setSearchQuery("");
    setViewMode(
      currentTripDay ? "today" : "all",
    );
  }

  const hasActiveFilters =
    selectedCategory !== "all" ||
    searchQuery.trim() !== "" ||
    viewMode !==
      (currentTripDay ? "today" : "all");

  const sectionTitle =
    viewMode === "today"
      ? `Luoghi del giorno ${currentTripDay}`
      : viewMode === "favorites"
        ? "I tuoi preferiti"
        : "Esplora per giornata";

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding:
          "calc(21px + env(safe-area-inset-top)) 18px calc(155px + env(safe-area-inset-bottom))",
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
            justifyContent:
              "space-between",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color:
                  theme.colors.primary,
                fontSize:
                  theme.typography.eyebrow,
                fontWeight: 900,
                letterSpacing: 1.6,
                textTransform:
                  "uppercase",
              }}
            >
              Road trip
            </p>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize:
                  theme.typography.display,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              Smart Map
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                color:
                  theme.colors.textSoft,
                fontSize:
                  theme.typography.body,
                lineHeight: 1.45,
              }}
            >
              Trova ciò che serve senza
              scorrere tutto il viaggio.
            </p>
          </div>

          <div
            aria-hidden="true"
            style={{
              width: 54,
              height: 54,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(116,215,255,0.20), rgba(32,206,198,0.14))",
              border:
                `1px solid ${theme.colors.borderStrong}`,
              boxShadow:
                theme.shadows.card,
              color:
                theme.colors.info,
            }}
          >
            <MapIcon size={26} />
          </div>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: 8,
            marginTop: 20,
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
            display: "grid",
            gridTemplateColumns:
              currentTripDay
                ? "repeat(3, 1fr)"
                : "repeat(2, 1fr)",
            gap: 8,
            marginTop: 17,
          }}
        >
          {currentTripDay && (
            <ViewButton
              active={
                viewMode === "today"
              }
              icon={<PinIcon />}
              label="Oggi"
              onClick={() =>
                changeViewMode("today")
              }
            />
          )}

          <ViewButton
            active={viewMode === "all"}
            icon={<MapIcon />}
            label="Tutti"
            onClick={() =>
              changeViewMode("all")
            }
          />

          <ViewButton
            active={
              viewMode === "favorites"
            }
            icon={<StarIcon />}
            label="Preferiti"
            onClick={() =>
              changeViewMode("favorites")
            }
          />
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 13,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: 15,
              zIndex: 1,
              transform:
                "translateY(-50%)",
              color:
                theme.colors.textSoft,
              fontSize: 18,
            }}
          >
            <SearchIcon />
          </span>

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
            placeholder="Cerca città, cenote, ristorante…"
            aria-label="Cerca un luogo"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding:
                "14px 44px 14px 45px",
              border:
                "1px solid rgba(255,255,255,0.10)",
              borderRadius: 18,
              outline: "none",
              background:
                "rgba(255,255,255,0.07)",
              color: theme.colors.text,
              fontSize: 15,
            }}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() =>
                setSearchQuery("")
              }
              aria-label="Cancella ricerca"
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                width: 31,
                height: 31,
                display: "grid",
                placeItems: "center",
                transform:
                  "translateY(-50%)",
                border: 0,
                borderRadius: 10,
                background:
                  "rgba(255,255,255,0.07)",
                color:
                  theme.colors.textSoft,
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
            width: "100%",
            marginTop: 12,
            padding:
              "0 18px 5px 0",
            overflowX: "auto",
            scrollPaddingRight: 18,
          }}
        >
          {categories.map(
            (category) => {
              const isActive =
                selectedCategory ===
                category.id;

              const color =
                category.id === "all"
                  ? theme.colors.primary
                  : categoryConfig[
                      category.id
                    ].color;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      category.id,
                    )
                  }
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding:
                      "9px 12px",
                    border: `1px solid ${
                      isActive
                        ? color
                        : "rgba(255,255,255,0.10)"
                    }`,
                    borderRadius: 999,
                    background:
                      isActive
                        ? color
                        : "rgba(255,255,255,0.055)",
                    color: isActive
                      ? theme.colors
                          .background
                      : theme.colors.text,
                    fontSize: 11,
                    fontWeight: 850,
                    cursor: "pointer",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 8,
                      height: 8,
                      flexShrink: 0,
                      borderRadius: "50%",
                      background: isActive
                        ? theme.colors.background
                        : color,
                    }}
                  />
                  {category.label}
                </button>
              );
            },
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            style={{
              marginTop: 5,
              padding: "7px 0",
              border: 0,
              background: "transparent",
              color:
                theme.colors.primary,
              fontSize: 10,
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            Azzera filtri
          </button>
        )}
      </header>

      <section
        style={{
          position: "relative",
          marginTop: 15,
          overflow: "hidden",
          borderRadius: 25,
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
            height:
              "clamp(340px, 43vh, 480px)",
          }}
        >
          <MapAutoFit
            locationsToFit={
              visibleLocations
            }
          />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline
            positions={route}
            pathOptions={{
              color:
                theme.colors.primary,
              weight: 4,
              opacity: 0.72,
              dashArray: "10 7",
            }}
          />

          {visibleLocations.map(
            (location) => {
              const config =
                categoryConfig[
                  location.type
                ];

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
                          width: 38,
                          height: 38,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 12,
                          background: `${config.color}16`,
                          color: config.color,
                        }}
                      >
                        <LocationTypeIcon
                          type={location.type}
                          size={20}
                        />
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
                          color:
                            config.color,
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
                          {
                            location.details
                          }
                        </p>
                      )}

                      <p
                        style={{
                          margin: "8px 0 0",
                          fontSize: 12,
                          lineHeight: 1.45,
                        }}
                      >
                        {
                          location.description
                        }
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
                          href={
                            location.externalUrl
                          }
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
            },
          )}
        </MapContainer>

        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            zIndex: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 11px",
            borderRadius:
              theme.radius.pill,
            background:
              "rgba(7,26,46,0.88)",
            border:
              "1px solid rgba(255,255,255,0.12)",
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: 800,
            backdropFilter: "blur(12px)",
          }}
        >
          <PinIcon size={13} />
          {visibleLocations.length}{" "}
          luoghi visibili
        </div>
      </section>

      <section style={{ marginTop: 25 }}>
        <SectionHeading
          title={sectionTitle}
          count={visibleLocations.length}
        />

        {visibleLocations.length === 0 ? (
          <EmptyState
            onReset={resetFilters}
          />
        ) : viewMode === "today" ? (
          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 14,
            }}
          >
            {visibleLocations.map(
              (location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  isFavorite={favoriteIds.includes(
                    location.id,
                  )}
                  onToggleFavorite={() =>
                    toggleFavorite(
                      location.id,
                    )
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 11,
              marginTop: 14,
            }}
          >
            {groupedLocations.map(
              (group) => {
                const isExpanded =
                  expandedDays.includes(
                    group.day,
                  );

                return (
                  <DayGroup
                    key={group.day}
                    day={group.day}
                    date={group.date}
                    title={group.title}
                    locations={
                      group.locations
                    }
                    expanded={isExpanded}
                    onToggle={() =>
                      toggleDay(group.day)
                    }
                    favoriteIds={
                      favoriteIds
                    }
                    onToggleFavorite={
                      toggleFavorite
                    }
                  />
                );
              },
            )}

            {ungroupedLocations.length >
              0 && (
              <DayGroup
                day={0}
                date="Extra"
                title="Altri luoghi"
                locations={
                  ungroupedLocations
                }
                expanded={expandedDays.includes(
                  0,
                )}
                onToggle={() =>
                  toggleDay(0)
                }
                favoriteIds={
                  favoriteIds
                }
                onToggleFavorite={
                  toggleFavorite
                }
              />
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function ViewButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minWidth: 0,
        minHeight: 43,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "9px 7px",
        border: active
          ? "1px solid transparent"
          : "1px solid rgba(255,255,255,0.09)",
        borderRadius: 15,
        background: active
          ? theme.colors.primary
          : "rgba(255,255,255,0.055)",
        color: active
          ? theme.colors.background
          : theme.colors.textSoft,
        fontSize: 11,
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function DayGroup({
  day,
  date,
  title,
  locations,
  expanded,
  onToggle,
  favoriteIds,
  onToggleFavorite,
}: {
  day: number;
  date: string;
  title: string;
  locations: MapLocation[];
  expanded: boolean;
  onToggle: () => void;
  favoriteIds: number[];
  onToggleFavorite: (
    id: number,
  ) => void;
}) {
  return (
    <article
      style={{
        overflow: "hidden",
        borderRadius: 22,
        background:
          "rgba(255,255,255,0.055)",
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "46px 1fr auto",
          alignItems: "center",
          gap: 12,
          padding: 15,
          border: 0,
          background: "transparent",
          color: theme.colors.text,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: 46,
            height: 46,
            display: "grid",
            placeItems: "center",
            borderRadius: 15,
            background:
              "rgba(17,197,191,0.13)",
            color:
              theme.colors.primary,
            fontSize: day === 0 ? 19 : 15,
            fontWeight: 950,
          }}
        >
          {day === 0 ? "✦" : day}
        </span>

        <span>
          <span
            style={{
              display: "block",
              color:
                theme.colors.secondary,
              fontSize: 9,
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            {day === 0
              ? date
              : `Giorno ${day} · ${date}`}
          </span>

          <strong
            style={{
              display: "block",
              marginTop: 5,
              fontSize: 15,
              lineHeight: 1.3,
            }}
          >
            {title}
          </strong>

          <span
            style={{
              display: "block",
              marginTop: 4,
              color:
                theme.colors.textSoft,
              fontSize: 10,
            }}
          >
            {locations.length}{" "}
            {locations.length === 1
              ? "luogo"
              : "luoghi"}
          </span>
        </span>

        <span
          style={{
            display: "grid",
            placeItems: "center",
            color:
              theme.colors.primary,
            transform: expanded
              ? "rotate(180deg)"
              : "rotate(0deg)",
            transition:
              "transform 180ms ease",
          }}
        >
          <ChevronDownIcon />
        </span>
      </button>

      {expanded && (
        <div
          style={{
            display: "grid",
            gap: 9,
            padding:
              "0 12px 12px",
          }}
        >
          {locations.map(
            (location) => (
              <LocationCard
                key={`${day}-${location.id}`}
                location={location}
                isFavorite={favoriteIds.includes(
                  location.id,
                )}
                onToggleFavorite={() =>
                  onToggleFavorite(
                    location.id,
                  )
                }
                compact
              />
            ),
          )}
        </div>
      )}
    </article>
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
        padding: "11px 7px",
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
          color:
            theme.colors.primary,
          fontSize: 20,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 4,
          color:
            theme.colors.textSoft,
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
        justifyContent:
          "space-between",
        gap: 14,
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color:
              theme.colors.primary,
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
          color:
            theme.colors.primary,
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
  compact = false,
}: {
  location: MapLocation;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  compact?: boolean;
}) {
  const config =
    categoryConfig[location.type];

  return (
    <article
      style={{
        padding: compact ? 13 : 15,
        borderRadius: compact
          ? 17
          : 21,
        background: compact
          ? "rgba(7,26,46,0.42)"
          : "rgba(255,255,255,0.06)",
        border: `1px solid ${config.color}24`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: compact ? 40 : 46,
            height: compact ? 40 : 46,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            borderRadius: 14,
            background: `${config.color}14`,
            color: config.color,
          }}
        >
          <LocationTypeIcon
            type={location.type}
            size={compact ? 19 : 22}
          />
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
              gap: 6,
            }}
          >
            <strong
              style={{
                fontSize: compact
                  ? 14
                  : 16,
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
                textTransform:
                  "uppercase",
              }}
            >
              {config.label}
            </span>
          </div>

          {location.details && (
            <span
              style={{
                display: "block",
                marginTop: 5,
                color: config.color,
                fontSize: 10,
                fontWeight: 750,
                lineHeight: 1.4,
              }}
            >
              {location.details}
            </span>
          )}

          <p
            style={{
              margin: "6px 0 0",
              color:
                theme.colors.textSoft,
              fontSize: compact ? 11 : 12,
              lineHeight: 1.45,
            }}
          >
            {location.description}
          </p>
        </div>

        <button
          type="button"
          onClick={
            onToggleFavorite
          }
          aria-label={
            isFavorite
              ? "Rimuovi dai preferiti"
              : "Aggiungi ai preferiti"
          }
          style={{
            width: 36,
            height: 36,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            padding: 0,
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            background: isFavorite
              ? "rgba(244,213,141,0.12)"
              : "rgba(255,255,255,0.04)",
            color: isFavorite
              ? theme.colors.secondary
              : theme.colors.textSoft,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          <StarIcon
            filled={isFavorite}
          />
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
          marginTop: 12,
        }}
      >
        <a
          href={getGoogleMapsUrl(
            location,
          )}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "10px 8px",
            borderRadius: 13,
            background:
              theme.colors.primary,
            color:
              theme.colors.background,
            textAlign: "center",
            textDecoration: "none",
            fontSize: 11,
            fontWeight: 850,
          }}
        >
          <NavigationIcon />
          Portami qui
        </a>

        {location.externalUrl && (
          <a
            href={
              location.externalUrl
            }
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "10px 8px",
              borderRadius: 13,
              background: `${config.color}18`,
              border: `1px solid ${config.color}28`,
              color: config.color,
              textAlign: "center",
              textDecoration: "none",
              fontSize: 11,
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

function EmptyState({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
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
      <span
        style={{
          width: 58,
          height: 58,
          display: "grid",
          placeItems: "center",
          margin: "0 auto",
          borderRadius: 19,
          background:
            theme.colors.primarySoft,
          color:
            theme.colors.primary,
        }}
      >
        <MapIcon size={28} />
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
          color:
            theme.colors.textSoft,
          fontSize: 13,
        }}
      >
        Modifica la ricerca o azzera i
        filtri.
      </p>

      <button
        type="button"
        onClick={onReset}
        style={{
          marginTop: 15,
          padding: "10px 14px",
          border: 0,
          borderRadius: 13,
          background:
            theme.colors.primary,
          color:
            theme.colors.background,
          fontWeight: 850,
          cursor: "pointer",
        }}
      >
        Azzera filtri
      </button>
    </div>
  );
}


type IconProps = {
  size?: number;
};

function IconBase({
  children,
  size = 18,
  fill = "none",
}: IconProps & {
  children: ReactNode;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
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

function LocationTypeIcon({
  type,
  size = 20,
}: {
  type: MapLocationType;
  size?: number;
}) {
  if (type === "city") {
    return (
      <IconBase size={size}>
        <path d="M4 21V9l5-3v15" />
        <path d="M9 21V4l7 3v14" />
        <path d="M16 21v-8l4-2v10" />
        <path d="M2 21h20" />
      </IconBase>
    );
  }

  if (type === "beach") {
    return (
      <IconBase size={size}>
        <circle cx="17" cy="6" r="3" />
        <path d="M3 17c3-2 6-2 9 0s6 2 9 0" />
        <path d="M4 21h16" />
        <path d="M8 15c1-4 3-7 6-9" />
      </IconBase>
    );
  }

  if (type === "ruins") {
    return (
      <IconBase size={size}>
        <path d="M4 20h16" />
        <path d="m6 20 2-4h8l2 4" />
        <path d="m8 16 2-4h4l2 4" />
        <path d="m10 12 2-5 2 5" />
      </IconBase>
    );
  }

  if (type === "cenote") {
    return (
      <IconBase size={size}>
        <path d="M12 3s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12Z" />
      </IconBase>
    );
  }

  if (type === "ferry") {
    return (
      <IconBase size={size}>
        <path d="M4 13 12 5l8 8" />
        <path d="M6 13h12l-2 6H8Z" />
        <path d="M3 21c2-1 4-1 6 0 2-1 4-1 6 0 2-1 4-1 6 0" />
      </IconBase>
    );
  }

  if (type === "accommodation") {
    return (
      <IconBase size={size}>
        <path d="M3 19v-8" />
        <path d="M21 19v-6a3 3 0 0 0-3-3H7a4 4 0 0 0-4 4" />
        <path d="M3 16h18" />
        <path d="M7 10V7h5a3 3 0 0 1 3 3" />
      </IconBase>
    );
  }

  return (
    <IconBase size={size}>
      <path d="M7 3v8" />
      <path d="M4 3v5a3 3 0 0 0 6 0V3" />
      <path d="M7 11v10" />
      <path d="M17 3v18" />
      <path d="M17 3c3 2 3 7 0 9" />
    </IconBase>
  );
}

function MapIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="m3.5 6.2 4.8-2 7.5 2 4.7-2v13.6l-4.7 2-7.5-2-4.8 2Z" />
      <path d="M8.3 4.2v13.6" />
      <path d="M15.8 6.2v13.6" />
    </IconBase>
  );
}

function PinIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </IconBase>
  );
}

function StarIcon({
  size = 18,
  filled = false,
}: IconProps & {
  filled?: boolean;
}) {
  return (
    <IconBase
      size={size}
      fill={
        filled
          ? "currentColor"
          : "none"
      }
    >
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />
    </IconBase>
  );
}

function SearchIcon() {
  return (
    <IconBase size={18}>
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />
      <path d="m16 16 4 4" />
    </IconBase>
  );
}

function ChevronDownIcon() {
  return (
    <IconBase size={18}>
      <path d="m7 10 5 5 5-5" />
    </IconBase>
  );
}

function NavigationIcon() {
  return (
    <IconBase size={15}>
      <path d="m3.5 11 17-8-8 17-1.9-7.1Z" />
    </IconBase>
  );
}

export default MapPage;