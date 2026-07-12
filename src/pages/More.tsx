import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Accommodations from "./Accommodations";
import AppSettings from "./AppSettings";
import BetaFeedback from "./BetaFeedback";
import Bookings from "./Bookings";
import CurrencyConverter from "./CurrencyConverter";
import DailyAgenda from "./DailyAgenda";
import DataBackup from "./DataBackup";
import DocumentVault from "./DocumentVault";
import EmergencyLocation from "./EmergencyLocation";
import FoodGuide from "./FoodGuide";
import FuelCalculator from "./FuelCalculator";
import PackingChecklist from "./PackingChecklist";
import Phrasebook from "./Phrasebook";
import PreTripCheck from "./PreTripCheck";
import PrivateTravelData from "./PrivateTravelData";
import RoadTrip from "./RoadTrip";
import TravelerProfile from "./TravelerProfile";
import TravelChecklist from "./TravelChecklist";
import TravelInfo from "./TravelInfo";
import TripNotes from "./TripNotes";
import TripSimulator from "./TripSimulator";
import WeatherPage from "./WeatherPage";
import WhatNow from "./WhatNow";
import { theme } from "../styles/theme";
import { getTravelerProfile } from "../utils/travelerProfile";

type MoreSection =
  | "menu"
  | "accommodations"
  | "food"
  | "bookings"
  | "roadtrip"
  | "checklist"
  | "currency"
  | "phrasebook"
  | "notes"
  | "backup"
  | "info"
  | "weather"
  | "fuel"
  | "settings"
  | "simulator"
  | "pretrip"
  | "private-data"
  | "documents"
  | "agenda"
  | "emergency-location"
  | "travel-checklist"
  | "what-now"
  | "beta-feedback"
  | "profile";

type ToolCategory =
  | "In evidenza"
  | "Viaggio"
  | "Utilità"
  | "Sicurezza"
  | "Impostazioni e test";

type MenuItem = {
  id: Exclude<MoreSection, "menu">;
  icon: string;
  title: string;
  subtitle: string;
  category: ToolCategory;
  accent: string;
  badge?: string;
  featured?: boolean;
};

const menuItems: MenuItem[] = [
  {
    id: "what-now",
    icon: "🧭",
    title: "Cosa faccio adesso?",
    subtitle: "La prossima azione del viaggio",
    category: "In evidenza",
    accent: "#6ED4FF",
    badge: "Live",
    featured: true,
  },
  {
    id: "agenda",
    icon: "🕒",
    title: "Agenda del giorno",
    subtitle: "Attività, orari e spostamenti",
    category: "In evidenza",
    accent: "#11C5BF",
    featured: true,
  },
  {
    id: "bookings",
    icon: "🎟️",
    title: "Prenotazioni",
    subtitle: "Voli, traghetti, auto e assicurazione",
    category: "In evidenza",
    accent: "#C3A8FF",
    badge: "9",
    featured: true,
  },
  {
    id: "emergency-location",
    icon: "🆘",
    title: "SOS e posizione",
    subtitle: "Emergenze e condivisione GPS",
    category: "In evidenza",
    accent: "#FF8E8E",
    featured: true,
  },

  {
    id: "accommodations",
    icon: "🏨",
    title: "Alloggi",
    subtitle: "6 prenotazioni Airbnb",
    category: "Viaggio",
    accent: "#FFB86B",
  },
  {
    id: "food",
    icon: "🍽️",
    title: "Food Guide",
    subtitle: "Ristoranti e locali consigliati",
    category: "Viaggio",
    accent: "#FF9D9D",
  },
  {
    id: "roadtrip",
    icon: "🚗",
    title: "Road Trip",
    subtitle: "Tratte, tempi e soste",
    category: "Viaggio",
    accent: "#6ED4FF",
  },
  {
    id: "documents",
    icon: "🗂️",
    title: "Cassaforte documenti",
    subtitle: "Voucher e biglietti offline",
    category: "Viaggio",
    accent: "#C3A8FF",
    badge: "Offline",
  },
  {
    id: "travel-checklist",
    icon: "✅",
    title: "Checklist viaggio",
    subtitle: "Preparazione e cose da ricordare",
    category: "Viaggio",
    accent: "#11C5BF",
  },
  {
    id: "checklist",
    icon: "🎒",
    title: "Checklist valigia",
    subtitle: "Prepara tutto per la partenza",
    category: "Viaggio",
    accent: "#F4D58D",
  },

  {
    id: "weather",
    icon: "🌤️",
    title: "Meteo Yucatán",
    subtitle: "Previsioni per tutte le tappe",
    category: "Utilità",
    accent: "#6ED4FF",
  },
  {
    id: "fuel",
    icon: "⛽",
    title: "Carburante",
    subtitle: "Consumi e divisione dei costi",
    category: "Utilità",
    accent: "#FFB86B",
  },
  {
    id: "currency",
    icon: "💱",
    title: "Cambio valuta",
    subtitle: "Euro e peso messicano",
    category: "Utilità",
    accent: "#11C5BF",
  },
  {
    id: "phrasebook",
    icon: "💬",
    title: "Frasario spagnolo",
    subtitle: "Frasi utili anche offline",
    category: "Utilità",
    accent: "#C3A8FF",
  },
  {
    id: "notes",
    icon: "📝",
    title: "Note di viaggio",
    subtitle: "Promemoria e informazioni offline",
    category: "Utilità",
    accent: "#F4D58D",
  },

  {
    id: "info",
    icon: "☎️",
    title: "Info e numeri utili",
    subtitle: "Emergenze e contatti personali",
    category: "Sicurezza",
    accent: "#FF8E8E",
  },
  {
    id: "backup",
    icon: "💾",
    title: "Backup dati",
    subtitle: "Salva e trasferisci i dati dell’app",
    category: "Sicurezza",
    accent: "#6ED4FF",
  },
  {
    id: "private-data",
    icon: "🔐",
    title: "Codici privati",
    subtitle: "PNR e riferimenti sul telefono",
    category: "Sicurezza",
    accent: "#C3A8FF",
  },
  {
    id: "pretrip",
    icon: "🛡️",
    title: "Controllo pre-partenza",
    subtitle: "Verifica che l’app sia pronta",
    category: "Sicurezza",
    accent: "#11C5BF",
    badge: "100%",
  },

  {
    id: "profile",
    icon: "👤",
    title: "Il mio profilo",
    subtitle: "Personalizza questo dispositivo",
    category: "Impostazioni e test",
    accent: "#6ED4FF",
  },
  {
    id: "settings",
    icon: "⚙️",
    title: "Aggiornamenti app",
    subtitle: "Versione, cache e installazione",
    category: "Impostazioni e test",
    accent: "#C3A8FF",
  },
  {
    id: "simulator",
    icon: "🗓️",
    title: "Simula il viaggio",
    subtitle: "Prova in anticipo ogni giornata",
    category: "Impostazioni e test",
    accent: "#F4D58D",
  },
  {
    id: "beta-feedback",
    icon: "🧪",
    title: "Diario beta",
    subtitle: "Problemi, idee e feedback",
    category: "Impostazioni e test",
    accent: "#11C5BF",
  },
];

const categories: ToolCategory[] = [
  "Viaggio",
  "Utilità",
  "Sicurezza",
  "Impostazioni e test",
];

function More() {
  const [section, setSection] =
    useState<MoreSection>("menu");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [openCategory, setOpenCategory] =
    useState<ToolCategory | null>("Viaggio");

  const traveler = getTravelerProfile();

  const pages: Partial<
    Record<MoreSection, ReactNode>
  > = {
    accommodations: <Accommodations />,
    food: <FoodGuide />,
    bookings: <Bookings />,
    roadtrip: <RoadTrip />,
    fuel: <FuelCalculator />,
    checklist: <PackingChecklist />,
    weather: <WeatherPage />,
    currency: <CurrencyConverter />,
    phrasebook: <Phrasebook />,
    notes: <TripNotes />,
    backup: <DataBackup />,
    info: <TravelInfo />,
    settings: <AppSettings />,
    pretrip: <PreTripCheck />,
    simulator: <TripSimulator />,
    "private-data": <PrivateTravelData />,
    documents: <DocumentVault />,
    agenda: <DailyAgenda />,
    profile: <TravelerProfile />,
    "emergency-location": (
      <EmergencyLocation />
    ),
    "what-now": <WhatNow />,
    "travel-checklist": (
      <TravelChecklist />
    ),
    "beta-feedback": <BetaFeedback />,
  };

  const normalizedSearch =
    searchQuery.trim().toLocaleLowerCase("it");

  const filteredItems = useMemo(() => {
    if (!normalizedSearch) {
      return menuItems;
    }

    return menuItems.filter((item) => {
      const searchableText = [
        item.title,
        item.subtitle,
        item.category,
      ]
        .join(" ")
        .toLocaleLowerCase("it");

      return searchableText.includes(
        normalizedSearch,
      );
    });
  }, [normalizedSearch]);

  const featuredItems = filteredItems.filter(
    (item) => item.featured,
  );

  function openSection(
    selectedSection: Exclude<
      MoreSection,
      "menu"
    >,
  ) {
    setSection(selectedSection);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  function returnToMenu() {
    setSection("menu");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  if (section !== "menu") {
    return (
      <div>
        <button
          type="button"
          onClick={returnToMenu}
          style={{
            position: "fixed",
            top:
              "calc(12px + env(safe-area-inset-top))",
            left: 15,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 13px",
            border:
              "1px solid rgba(255,255,255,0.14)",
            borderRadius: 999,
            background:
              "rgba(7,26,46,0.88)",
            boxShadow:
              "0 10px 28px rgba(0,0,0,0.26)",
            color: theme.colors.text,
            fontSize: 13,
            fontWeight: 850,
            cursor: "pointer",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter:
              "blur(18px)",
          }}
        >
          <span style={{ fontSize: 17 }}>
            ‹
          </span>
          Strumenti
        </button>

        {pages[section]}
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding:
          "calc(23px + env(safe-area-inset-top)) 18px calc(176px + env(safe-area-inset-bottom))",
        background: `
          radial-gradient(
            circle at 92% 3%,
            rgba(195,168,255,0.13),
            transparent 27%
          ),
          radial-gradient(
            circle at 8% 34%,
            rgba(17,197,191,0.10),
            transparent 25%
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
              Ruta Maya
            </p>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize: 34,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              Strumenti
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
              {traveler
                ? `Tutto ciò che serve a ${traveler} durante il viaggio.`
                : "Tutto ciò che serve durante il viaggio."}
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
                "linear-gradient(135deg, rgba(195,168,255,0.25), rgba(17,197,191,0.18))",
              border:
                "1px solid rgba(255,255,255,0.11)",
              fontSize: 25,
              boxShadow:
                "0 14px 32px rgba(0,0,0,0.22)",
            }}
          >
            ✦
          </div>
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 23,
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
            placeholder="Cerca uno strumento…"
            aria-label="Cerca uno strumento"
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
              appearance: "none",
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
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          )}
        </div>
      </header>

      {!normalizedSearch &&
        featuredItems.length > 0 && (
          <section
            style={{
              marginTop: 27,
            }}
          >
            <SectionHeading
              eyebrow="Essenziali"
              title="In evidenza"
              count={featuredItems.length}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 11,
                marginTop: 14,
              }}
            >
              {featuredItems.map(
                (item) => (
                  <FeaturedTool
                    key={item.id}
                    item={item}
                    onClick={() =>
                      openSection(item.id)
                    }
                  />
                ),
              )}
            </div>
          </section>
        )}

      {normalizedSearch ? (
        <section
          style={{
            marginTop: 27,
          }}
        >
          <SectionHeading
            eyebrow="Ricerca"
            title="Risultati"
            count={filteredItems.length}
          />

          {filteredItems.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 14,
              }}
            >
              {filteredItems.map(
                (item) => (
                  <ToolRow
                    key={item.id}
                    item={item}
                    onClick={() =>
                      openSection(item.id)
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div
              style={{
                marginTop: 14,
                padding: 25,
                borderRadius: 22,
                background:
                  "rgba(255,255,255,0.06)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: 34,
                }}
              >
                🔎
              </span>

              <h2
                style={{
                  margin: "13px 0 0",
                  fontSize: 19,
                }}
              >
                Nessun risultato
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color:
                    theme.colors.textSoft,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Prova a cercare “volo”,
                “meteo”, “SOS” oppure
                “backup”.
              </p>
            </div>
          )}
        </section>
      ) : (
        categories.map((category) => {
          const categoryItems =
            menuItems.filter(
              (item) =>
                item.category ===
                category,
            );

          const isOpen =
            openCategory === category;

          return (
            <section
              key={category}
              style={{
                marginTop: 18,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenCategory(
                    isOpen ? null : category,
                  )
                }
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  padding: "17px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  gap: 14,
                  border:
                    "1px solid rgba(255,255,255,0.09)",
                  borderRadius: isOpen
                    ? "22px 22px 16px 16px"
                    : 22,
                  background:
                    "rgba(255,255,255,0.065)",
                  boxShadow:
                    "0 10px 26px rgba(0,0,0,0.12)",
                  color: theme.colors.text,
                  textAlign: "left",
                  cursor: "pointer",
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
                      textTransform:
                        "uppercase",
                    }}
                  >
                    {getCategoryEyebrow(
                      category,
                    )}
                  </p>

                  <h2
                    style={{
                      margin: "5px 0 0",
                      fontSize: 22,
                      lineHeight: 1.2,
                      letterSpacing: -0.3,
                    }}
                  >
                    {category}
                  </h2>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      minWidth: 29,
                      padding: "6px 9px",
                      borderRadius: 999,
                      background:
                        "rgba(17,197,191,0.12)",
                      color:
                        theme.colors.primary,
                      fontSize: 10,
                      fontWeight: 900,
                      textAlign: "center",
                    }}
                  >
                    {categoryItems.length}
                  </span>

                  <span
                    style={{
                      width: 30,
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 10,
                      background:
                        "rgba(255,255,255,0.06)",
                      color:
                        theme.colors.textSoft,
                      fontSize: 18,
                      transform: isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition:
                        "transform 180ms ease",
                    }}
                  >
                    ⌄
                  </span>
                </div>
              </button>

              {isOpen && (
                <div
                  style={{
                    display: "grid",
                    gap: 9,
                    marginTop: 9,
                  }}
                >
                  {categoryItems.map(
                    (item) => (
                      <ToolRow
                        key={item.id}
                        item={item}
                        onClick={() =>
                          openSection(
                            item.id,
                          )
                        }
                      />
                    ),
                  )}
                </div>
              )}
            </section>
          );
        })
      )}
    </main>
  );
}

function getCategoryEyebrow(
  category: ToolCategory,
) {
  if (category === "Viaggio") {
    return "Organizzazione";
  }

  if (category === "Utilità") {
    return "Sul posto";
  }

  if (category === "Sicurezza") {
    return "Protezione dati";
  }

  return "Applicazione";
}

function SectionHeading({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
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
          {eyebrow}
        </p>

        <h2
          style={{
            margin: "5px 0 0",
            fontSize: 22,
            lineHeight: 1.2,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </h2>
      </div>

      <span
        style={{
          minWidth: 29,
          padding: "6px 9px",
          borderRadius: 999,
          background:
            "rgba(17,197,191,0.12)",
          color: theme.colors.primary,
          fontSize: 10,
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        {count}
      </span>
    </div>
  );
}

function FeaturedTool({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minWidth: 0,
        minHeight: 169,
        padding: 17,
        border: `1px solid ${item.accent}25`,
        borderRadius: 23,
        background:
          "rgba(255,255,255,0.07)",
        boxShadow:
          "0 14px 32px rgba(0,0,0,0.14)",
        color: theme.colors.text,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent:
            "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 47,
            height: 47,
            display: "grid",
            placeItems: "center",
            borderRadius: 16,
            background: `${item.accent}18`,
            fontSize: 22,
          }}
        >
          {item.icon}
        </span>

        {item.badge && (
          <span
            style={{
              padding: "5px 7px",
              borderRadius: 999,
              background: `${item.accent}15`,
              color: item.accent,
              fontSize: 9,
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            {item.badge}
          </span>
        )}
      </div>

      <strong
        style={{
          display: "block",
          marginTop: 17,
          fontSize: 16,
          lineHeight: 1.25,
        }}
      >
        {item.title}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 6,
          color: theme.colors.textSoft,
          fontSize: 11,
          lineHeight: 1.45,
        }}
      >
        {item.subtitle}
      </span>

      <span
        style={{
          display: "block",
          marginTop: 13,
          color: item.accent,
          fontSize: 12,
          fontWeight: 900,
        }}
      >
        Apri →
      </span>
    </button>
  );
}

function ToolRow({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: 14,
        border:
          "1px solid rgba(255,255,255,0.08)",
        borderRadius: 19,
        background:
          "rgba(255,255,255,0.06)",
        boxShadow:
          "0 8px 22px rgba(0,0,0,0.10)",
        color: theme.colors.text,
        textAlign: "left",
        cursor: "pointer",
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
          background: `${item.accent}17`,
          fontSize: 21,
        }}
      >
        {item.icon}
      </span>

      <span
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 7,
          }}
        >
          <strong
            style={{
              fontSize: 15,
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </strong>

          {item.badge && (
            <span
              style={{
                padding: "4px 6px",
                borderRadius: 999,
                background: `${item.accent}15`,
                color: item.accent,
                fontSize: 8,
                fontWeight: 900,
                textTransform:
                  "uppercase",
              }}
            >
              {item.badge}
            </span>
          )}
        </span>

        <span
          style={{
            display: "block",
            marginTop: 5,
            overflow: "hidden",
            color:
              theme.colors.textSoft,
            fontSize: 11,
            lineHeight: 1.4,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.subtitle}
        </span>
      </span>

      <span
        style={{
          flexShrink: 0,
          color: item.accent,
          fontSize: 22,
          lineHeight: 1,
        }}
      >
        ›
      </span>
    </button>
  );
}

export default More;