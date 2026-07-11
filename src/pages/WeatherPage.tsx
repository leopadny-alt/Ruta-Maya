import { useEffect, useState } from "react";
import { theme } from "../styles/theme";

type WeatherLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type WeatherResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
};

type CachedWeather = {
  locationId: string;
  savedAt: string;
  data: WeatherResponse;
};

const CACHE_KEY = "ruta-maya-weather-cache";

const weatherLocations: WeatherLocation[] = [
  {
    id: "cancun",
    name: "Cancún",
    latitude: 21.1619,
    longitude: -86.8515,
  },
  {
    id: "isla-mujeres",
    name: "Isla Mujeres",
    latitude: 21.2322,
    longitude: -86.734,
  },
  {
    id: "tulum",
    name: "Tulum",
    latitude: 20.2114,
    longitude: -87.4654,
  },
  {
    id: "valladolid",
    name: "Valladolid",
    latitude: 20.6896,
    longitude: -88.2012,
  },
  {
    id: "merida",
    name: "Mérida",
    latitude: 20.9674,
    longitude: -89.5926,
  },
  {
    id: "holbox",
    name: "Isla Holbox",
    latitude: 21.521,
    longitude: -87.377,
  },
];

function getWeatherInfo(code: number) {
  if (code === 0) {
    return { icon: "☀️", label: "Sereno" };
  }

  if ([1, 2].includes(code)) {
    return { icon: "🌤️", label: "Poco nuvoloso" };
  }

  if (code === 3) {
    return { icon: "☁️", label: "Nuvoloso" };
  }

  if ([45, 48].includes(code)) {
    return { icon: "🌫️", label: "Nebbia" };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return { icon: "🌦️", label: "Pioviggine" };
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return { icon: "🌧️", label: "Pioggia" };
  }

  if ([80, 81, 82].includes(code)) {
    return { icon: "🌦️", label: "Rovesci" };
  }

  if ([95, 96, 99].includes(code)) {
    return { icon: "⛈️", label: "Temporale" };
  }

  return { icon: "🌥️", label: "Variabile" };
}

function formatDay(date: string, index: number) {
  if (index === 0) {
    return "Oggi";
  }

  if (index === 1) {
    return "Domani";
  }

  return new Date(`${date}T12:00:00`).toLocaleDateString(
    "it-IT",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    },
  );
}

function formatHour(date: string) {
  return new Date(date).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WeatherPage() {
  const [selectedLocationId, setSelectedLocationId] =
    useState("cancun");

  const [weather, setWeather] =
    useState<WeatherResponse | null>(null);

  const [lastUpdate, setLastUpdate] = useState("");
  const [loading, setLoading] = useState(true);
  const [usingCache, setUsingCache] = useState(false);
  const [error, setError] = useState("");

  const selectedLocation =
    weatherLocations.find(
      (location) => location.id === selectedLocationId,
    ) ?? weatherLocations[0];

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocationId]);

  async function loadWeather(location: WeatherLocation) {
    setLoading(true);
    setError("");
    setUsingCache(false);

    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current: [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "precipitation",
        "weather_code",
        "wind_speed_10m",
      ].join(","),
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max",
        "uv_index_max",
        "sunrise",
        "sunset",
      ].join(","),
      timezone: "auto",
      forecast_days: "7",
    });

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Risposta meteo non valida");
      }

      const data = (await response.json()) as WeatherResponse;

      const cachedWeather: CachedWeather = {
        locationId: location.id,
        savedAt: new Date().toISOString(),
        data,
      };

      localStorage.setItem(
        `${CACHE_KEY}-${location.id}`,
        JSON.stringify(cachedWeather),
      );

      setWeather(data);
      setLastUpdate(cachedWeather.savedAt);
    } catch {
      const cachedValue = localStorage.getItem(
        `${CACHE_KEY}-${location.id}`,
      );

      if (cachedValue) {
        try {
          const cachedWeather = JSON.parse(
            cachedValue,
          ) as CachedWeather;

          setWeather(cachedWeather.data);
          setLastUpdate(cachedWeather.savedAt);
          setUsingCache(true);
        } catch {
          setError(
            "Impossibile recuperare il meteo e non è presente una copia offline.",
          );
        }
      } else {
        setError(
          "Impossibile recuperare il meteo. Controlla la connessione.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const currentInfo = weather
    ? getWeatherInfo(weather.current.weather_code)
    : null;

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
        Previsioni
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Meteo Yucatán
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Condizioni attuali e previsioni per le tappe principali.
      </p>

      <div
        style={{
          display: "flex",
          gap: 9,
          marginTop: 20,
          paddingBottom: 6,
          overflowX: "auto",
        }}
      >
        {weatherLocations.map((location) => {
          const isActive =
            selectedLocationId === location.id;

          return (
            <button
              key={location.id}
              type="button"
              onClick={() =>
                setSelectedLocationId(location.id)
              }
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
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {location.name}
            </button>
          );
        })}
      </div>

      {loading && (
        <section style={messageCardStyle}>
          Aggiornamento del meteo in corso…
        </section>
      )}

      {error && !loading && (
        <section
          style={{
            ...messageCardStyle,
            color: "#FFB4A8",
            border: "1px solid rgba(255,180,168,0.25)",
          }}
        >
          {error}

          <button
            type="button"
            onClick={() => loadWeather(selectedLocation)}
            style={{
              width: "100%",
              marginTop: 15,
              padding: 13,
              border: 0,
              borderRadius: 15,
              background: theme.colors.primary,
              color: theme.colors.background,
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            Riprova
          </button>
        </section>
      )}

      {weather && !loading && currentInfo && (
        <>
          <section
            style={{
              marginTop: 20,
              padding: 23,
              borderRadius: 27,
              background:
                "linear-gradient(135deg, #168FA3, #0E4F6F)",
              boxShadow:
                "0 20px 45px rgba(0,0,0,0.26)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 18,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 750,
                    opacity: 0.86,
                  }}
                >
                  {selectedLocation.name}
                </p>

                <strong
                  style={{
                    display: "block",
                    marginTop: 6,
                    fontSize: 52,
                    lineHeight: 1,
                  }}
                >
                  {Math.round(
                    weather.current.temperature_2m,
                  )}
                  °
                </strong>

                <p
                  style={{
                    margin: "9px 0 0",
                    fontSize: 16,
                    fontWeight: 750,
                  }}
                >
                  {currentInfo.label}
                </p>
              </div>

              <span style={{ fontSize: 64 }}>
                {currentInfo.icon}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginTop: 22,
              }}
            >
              <WeatherStat
                label="Percepita"
                value={`${Math.round(
                  weather.current.apparent_temperature,
                )}°`}
              />

              <WeatherStat
                label="Umidità"
                value={`${weather.current.relative_humidity_2m}%`}
              />

              <WeatherStat
                label="Vento"
                value={`${Math.round(
                  weather.current.wind_speed_10m,
                )} km/h`}
              />

              <WeatherStat
                label="Pioggia"
                value={`${weather.current.precipitation} mm`}
              />
            </div>
          </section>

          {usingCache && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 15,
                background: "rgba(244,213,141,0.14)",
                color: theme.colors.secondary,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              Modalità offline: stai visualizzando l’ultima
              previsione salvata.
            </div>
          )}

          <section style={{ marginTop: 27 }}>
            <h2 style={{ margin: "0 0 14px", fontSize: 22 }}>
              Prossimi 7 giorni
            </h2>

            <div style={{ display: "grid", gap: 11 }}>
              {weather.daily.time.map((date, index) => {
                const info = getWeatherInfo(
                  weather.daily.weather_code[index],
                );

                return (
                  <article
                    key={date}
                    style={{
                      padding: 16,
                      borderRadius: 20,
                      background: theme.colors.card,
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 13,
                      }}
                    >
                      <span
                        style={{
                          width: 48,
                          height: 48,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          borderRadius: 16,
                          background:
                            "rgba(17,197,191,0.13)",
                          fontSize: 25,
                        }}
                      >
                        {info.icon}
                      </span>

                      <div style={{ flex: 1 }}>
                        <strong
                          style={{
                            display: "block",
                            fontSize: 16,
                            textTransform: "capitalize",
                          }}
                        >
                          {formatDay(date, index)}
                        </strong>

                        <span
                          style={{
                            display: "block",
                            marginTop: 4,
                            color: theme.colors.textSoft,
                            fontSize: 13,
                          }}
                        >
                          {info.label}
                        </span>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <strong
                          style={{
                            display: "block",
                            fontSize: 18,
                          }}
                        >
                          {Math.round(
                            weather.daily
                              .temperature_2m_max[index],
                          )}
                          °
                        </strong>

                        <span
                          style={{
                            display: "block",
                            marginTop: 3,
                            color: theme.colors.textSoft,
                            fontSize: 13,
                          }}
                        >
                          {Math.round(
                            weather.daily
                              .temperature_2m_min[index],
                          )}
                          °
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(3, 1fr)",
                        gap: 8,
                        marginTop: 14,
                      }}
                    >
                      <MiniStat
                        label="Pioggia"
                        value={`${weather.daily.precipitation_probability_max[index]}%`}
                      />

                      <MiniStat
                        label="UV"
                        value={Math.round(
                          weather.daily.uv_index_max[index],
                        ).toString()}
                      />

                      <MiniStat
                        label="Tramonto"
                        value={formatHour(
                          weather.daily.sunset[index],
                        )}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <button
            type="button"
            onClick={() => loadWeather(selectedLocation)}
            style={{
              width: "100%",
              marginTop: 20,
              padding: 14,
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: 16,
              background: theme.colors.card,
              color: theme.colors.text,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Aggiorna previsioni
          </button>

          {lastUpdate && (
            <p
              style={{
                margin: "13px 4px 0",
                color: theme.colors.textSoft,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Ultimo aggiornamento:{" "}
              {new Date(lastUpdate).toLocaleString("it-IT")}
            </p>
          )}
        </>
      )}

      <p
        style={{
          margin: "22px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        Le previsioni possono cambiare rapidamente. Controllale
        nuovamente prima di traghetti, escursioni e tratte lunghe.
      </p>
    </main>
  );
}

function WeatherStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 13,
        borderRadius: 15,
        background: "rgba(7,26,46,0.25)",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 12,
          opacity: 0.78,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 5,
          fontSize: 16,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "10px 6px",
        borderRadius: 13,
        background: "rgba(255,255,255,0.06)",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "block",
          color: theme.colors.textSoft,
          fontSize: 10,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 4,
          fontSize: 13,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

const messageCardStyle = {
  marginTop: 20,
  padding: 22,
  borderRadius: 21,
  background: theme.colors.card,
  color: theme.colors.textSoft,
  textAlign: "center" as const,
  lineHeight: 1.5,
};

export default WeatherPage;