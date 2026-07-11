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
  { id: "all", label: "Tutti", icon: "✦" },
  { id: "city", label: "Città", icon: "🏙️" },
  { id: "beach", label: "Mare", icon: "🏝️" },
  { id: "ruins", label: "Maya", icon: "🗿" },
  { id: "cenote", label: "Cenote", icon: "💧" },
  { id: "ferry", label: "Traghetti", icon: "⛴️" },
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
          display:block;
          transform:rotate(45deg);
          font-size:19px;
          line-height:1;
        ">${config.icon}</span>
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
          "calc(23px + env(safe-area-inset-top)) 18px 150px",
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
                fontSize: 11,
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
                color:
                  theme.colors.textSoft,
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              Trova ciò che serve senza
              scorrere tutto il viaggio.
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
              icon="📍"
              label="Oggi"
              onClick={() =>
                changeViewMode("today")
              }
            />
          )}

          <ViewButton
            active={viewMode === "all"}
            icon="🗺️"
            label="Tutti"
            onClick={() =>
              changeViewMode("all")
            }
          />

          <ViewButton
            active={
              viewMode === "favorites"
            }
            icon="★"
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
            ⌕
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
                  <span>
                    {category.icon}
                  </span>
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
          marginTop: 18,
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
            height: "48vh",
            minHeight: 390,
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
          }}
        >
          📍 {visibleLocations.length}{" "}
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
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minWidth: 0,
        padding: "11px 8px",
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
      {icon} {label}
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
            color:
              theme.colors.primary,
            fontSize: 23,
            transform: expanded
              ? "rotate(90deg)"
              : "none",
            transition:
              "transform 180ms ease",
          }}
        >
          ›
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
          color:
            theme.colors.primary,
          fontSize: 21,
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
          style={{
            width: compact ? 40 : 46,
            height: compact ? 40 : 46,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            borderRadius: 14,
            background: `${config.color}17`,
            fontSize: compact ? 18 : 21,
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
          📍 Portami qui
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

export default MapPage;