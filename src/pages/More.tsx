import {
  useEffect,
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

type ToolIconName =
  | "compass"
  | "clock"
  | "ticket"
  | "sos"
  | "bed"
  | "restaurant"
  | "car"
  | "folder"
  | "check"
  | "backpack"
  | "weather"
  | "fuel"
  | "currency"
  | "message"
  | "notes"
  | "phone"
  | "backup"
  | "lock"
  | "shield"
  | "profile"
  | "settings"
  | "calendar"
  | "flask";

type MenuItem = {
  id: Exclude<MoreSection, "menu">;
  icon: ToolIconName;
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
    icon: "compass",
    title: "Cosa faccio adesso?",
    subtitle: "La prossima azione del viaggio",
    category: "In evidenza",
    accent: theme.colors.info,
    badge: "Live",
    featured: true,
  },
  {
    id: "agenda",
    icon: "clock",
    title: "Agenda del giorno",
    subtitle: "Attività, orari e spostamenti",
    category: "In evidenza",
    accent: theme.colors.primary,
    featured: true,
  },
  {
    id: "bookings",
    icon: "ticket",
    title: "Prenotazioni",
    subtitle: "Voli, traghetti, auto e assicurazione",
    category: "In evidenza",
    accent: "#C7AEFF",
    badge: "9",
    featured: true,
  },
  {
    id: "emergency-location",
    icon: "sos",
    title: "SOS e posizione",
    subtitle: "Emergenze e condivisione GPS",
    category: "In evidenza",
    accent: theme.colors.danger,
    featured: true,
  },
  {
    id: "accommodations",
    icon: "bed",
    title: "Alloggi",
    subtitle: "6 prenotazioni Airbnb",
    category: "Viaggio",
    accent: theme.colors.warning,
  },
  {
    id: "food",
    icon: "restaurant",
    title: "Food Guide",
    subtitle: "Ristoranti e locali consigliati",
    category: "Viaggio",
    accent: theme.colors.danger,
  },
  {
    id: "roadtrip",
    icon: "car",
    title: "Road Trip",
    subtitle: "Tratte, tempi e soste",
    category: "Viaggio",
    accent: theme.colors.info,
  },
  {
    id: "documents",
    icon: "folder",
    title: "Cassaforte documenti",
    subtitle: "Voucher e biglietti offline",
    category: "Viaggio",
    accent: "#C7AEFF",
    badge: "Offline",
  },
  {
    id: "travel-checklist",
    icon: "check",
    title: "Checklist viaggio",
    subtitle: "Preparazione e cose da ricordare",
    category: "Viaggio",
    accent: theme.colors.primary,
  },
  {
    id: "checklist",
    icon: "backpack",
    title: "Checklist valigia",
    subtitle: "Prepara tutto per la partenza",
    category: "Viaggio",
    accent: theme.colors.secondary,
  },
  {
    id: "weather",
    icon: "weather",
    title: "Meteo Yucatán",
    subtitle: "Previsioni per tutte le tappe",
    category: "Utilità",
    accent: theme.colors.info,
  },
  {
    id: "fuel",
    icon: "fuel",
    title: "Carburante",
    subtitle: "Consumi e divisione dei costi",
    category: "Utilità",
    accent: theme.colors.warning,
  },
  {
    id: "currency",
    icon: "currency",
    title: "Cambio valuta",
    subtitle: "Euro e peso messicano",
    category: "Utilità",
    accent: theme.colors.primary,
  },
  {
    id: "phrasebook",
    icon: "message",
    title: "Frasario spagnolo",
    subtitle: "Frasi utili anche offline",
    category: "Utilità",
    accent: "#C7AEFF",
  },
  {
    id: "notes",
    icon: "notes",
    title: "Note di viaggio",
    subtitle: "Promemoria e informazioni offline",
    category: "Utilità",
    accent: theme.colors.secondary,
  },
  {
    id: "info",
    icon: "phone",
    title: "Info e numeri utili",
    subtitle: "Emergenze e contatti personali",
    category: "Sicurezza",
    accent: theme.colors.danger,
  },
  {
    id: "backup",
    icon: "backup",
    title: "Backup dati",
    subtitle: "Salva e trasferisci i dati dell’app",
    category: "Sicurezza",
    accent: theme.colors.info,
  },
  {
    id: "private-data",
    icon: "lock",
    title: "Codici privati",
    subtitle: "PNR e riferimenti sul telefono",
    category: "Sicurezza",
    accent: "#C7AEFF",
  },
  {
    id: "pretrip",
    icon: "shield",
    title: "Controllo pre-partenza",
    subtitle: "Verifica che l’app sia pronta",
    category: "Sicurezza",
    accent: theme.colors.primary,
    badge: "100%",
  },
  {
    id: "profile",
    icon: "profile",
    title: "Il mio profilo",
    subtitle: "Personalizza questo dispositivo",
    category: "Impostazioni e test",
    accent: theme.colors.info,
  },
  {
    id: "settings",
    icon: "settings",
    title: "Aggiornamenti app",
    subtitle: "Versione, cache e installazione",
    category: "Impostazioni e test",
    accent: "#C7AEFF",
  },
  {
    id: "simulator",
    icon: "calendar",
    title: "Simula il viaggio",
    subtitle: "Prova in anticipo ogni giornata",
    category: "Impostazioni e test",
    accent: theme.colors.secondary,
  },
  {
    id: "beta-feedback",
    icon: "flask",
    title: "Diario beta",
    subtitle: "Problemi, idee e feedback",
    category: "Impostazioni e test",
    accent: theme.colors.primary,
  },
];

const categories: Exclude<
  ToolCategory,
  "In evidenza"
>[] = [
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

  const featuredItems = menuItems.filter(
    (item) => item.featured,
  );

  useEffect(() => {
    function returnToToolsMenu() {
      setSection("menu");
      setSearchQuery("");

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }

    window.addEventListener(
      "ruta-maya:open-tools-menu",
      returnToToolsMenu,
    );

    return () => {
      window.removeEventListener(
        "ruta-maya:open-tools-menu",
        returnToToolsMenu,
      );
    };
  }, []);

  function openSection(
    selectedSection: Exclude<
      MoreSection,
      "menu"
    >,
  ) {
    (
      document.activeElement as
        | HTMLElement
        | null
    )?.blur();

    setSearchQuery("");
    setSection(selectedSection);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }

  function returnToMenu() {
    setSection("menu");
    setSearchQuery("");

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }

  function toggleCategory(
    category: ToolCategory,
  ) {
    const isCurrentlyOpen =
      openCategory === category;

    if (isCurrentlyOpen) {
      setOpenCategory(null);
      return;
    }

    setOpenCategory(category);

    window.setTimeout(() => {
      document
        .getElementById(
          `tool-category-${category}`,
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 120);
  }

  if (section !== "menu") {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          background:
            theme.colors.background,
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            padding:
              "calc(8px + env(safe-area-inset-top)) 18px 9px",
            background:
              "linear-gradient(180deg, rgba(5,24,39,0.98), rgba(5,24,39,0.90))",
            borderBottom:
              `1px solid ${theme.colors.border}`,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter:
              "blur(18px)",
          }}
        >
          <button
            type="button"
            onClick={returnToMenu}
            style={{
              minHeight: 40,
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 12px",
              border:
                `1px solid ${theme.colors.borderStrong}`,
              borderRadius:
                theme.radius.pill,
              background:
                "rgba(255,255,255,0.055)",
              color:
                theme.colors.text,
              fontSize: 12,
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            <ArrowLeftIcon />
            Tutti gli strumenti
          </button>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "100vw",
            overflowX: "hidden",
          }}
        >
          {pages[section]}
        </div>
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
        padding:
          "calc(21px + env(safe-area-inset-top)) 18px calc(160px + env(safe-area-inset-bottom))",
        background: `
          radial-gradient(
            circle at 92% 3%,
            rgba(199,174,255,0.13),
            transparent 27%
          ),
          radial-gradient(
            circle at 8% 34%,
            rgba(32,206,198,0.09),
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
              Ruta Maya
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
              Strumenti
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                maxWidth: 310,
                color:
                  theme.colors.textSoft,
                fontSize:
                  theme.typography.body,
                lineHeight: 1.45,
              }}
            >
              {traveler
                ? `Tutto ciò che serve a ${traveler} durante il viaggio.`
                : "Tutto ciò che serve durante il viaggio."}
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
                "linear-gradient(135deg, rgba(199,174,255,0.22), rgba(32,206,198,0.14))",
              border:
                `1px solid ${theme.colors.borderStrong}`,
              color: "#C7AEFF",
              boxShadow:
                theme.shadows.card,
            }}
          >
            <GridIcon size={26} />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 21,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: 15,
              zIndex: 1,
              display: "grid",
              placeItems: "center",
              transform:
                "translateY(-50%)",
              color:
                theme.colors.textMuted,
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
            placeholder="Cerca uno strumento…"
            aria-label="Cerca uno strumento"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding:
                "13px 44px 13px 45px",
              border:
                `1px solid ${theme.colors.border}`,
              borderRadius: 17,
              outline: "none",
              background:
                "rgba(255,255,255,0.065)",
              boxShadow:
                theme.shadows.soft,
              color: theme.colors.text,
              fontSize: 16,
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
                right: 9,
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
                fontSize: 17,
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
              marginTop: 24,
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
                gap: 10,
                marginTop: 13,
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
            marginTop: 24,
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
                gap: 8,
                marginTop: 13,
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
                display: "grid",
                gridTemplateColumns:
                  "48px minmax(0, 1fr)",
                alignItems: "center",
                gap: 13,
                marginTop: 13,
                padding: 15,
                borderRadius: 18,
                background:
                  theme.colors.cardSoft,
                border:
                  `1px solid ${theme.colors.border}`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 15,
                  background:
                    theme.colors.primarySoft,
                  color:
                    theme.colors.primary,
                }}
              >
                <SearchIcon size={23} />
              </span>

              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 15,
                  }}
                >
                  Nessun risultato
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color:
                      theme.colors.textSoft,
                    fontSize: 11,
                    lineHeight: 1.45,
                  }}
                >
                  Prova “volo”, “meteo”,
                  “SOS” oppure “backup”.
                </p>
              </div>
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

          const categoryMeta =
            getCategoryMeta(category);

          return (
            <section
              key={category}
              id={`tool-category-${category}`}
              style={{
                marginTop: 14,
                scrollMarginTop:
                  "calc(18px + env(safe-area-inset-top))",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  toggleCategory(category)
                }
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns:
                    "46px minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: 12,
                  padding: 14,
                  border:
                    `1px solid ${
                      isOpen
                        ? `${categoryMeta.accent}30`
                        : theme.colors.border
                    }`,
                  borderRadius: isOpen
                    ? "21px 21px 16px 16px"
                    : 21,
                  background: isOpen
                    ? `linear-gradient(145deg, ${categoryMeta.accent}12, rgba(255,255,255,0.045))`
                    : theme.colors.cardSoft,
                  boxShadow:
                    theme.shadows.soft,
                  color:
                    theme.colors.text,
                  textAlign: "left",
                  cursor: "pointer",
                  WebkitTapHighlightColor:
                    "transparent",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 46,
                    height: 46,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 15,
                    background: `${categoryMeta.accent}14`,
                    color:
                      categoryMeta.accent,
                  }}
                >
                  {categoryMeta.icon}
                </span>

                <span
                  style={{
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color:
                        categoryMeta.accent,
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: 0.95,
                      textTransform:
                        "uppercase",
                    }}
                  >
                    {categoryMeta.eyebrow}
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: 4,
                      fontSize: 17,
                      lineHeight: 1.25,
                    }}
                  >
                    {category}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      overflow: "hidden",
                      color:
                        theme.colors.textSoft,
                      fontSize: 10,
                      lineHeight: 1.35,
                      textOverflow:
                        "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {categoryMeta.subtitle}
                  </span>
                </span>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      minWidth: 27,
                      padding: "5px 8px",
                      borderRadius:
                        theme.radius.pill,
                      background: `${categoryMeta.accent}12`,
                      color:
                        categoryMeta.accent,
                      fontSize: 9,
                      fontWeight: 900,
                      textAlign: "center",
                    }}
                  >
                    {categoryItems.length}
                  </span>

                  <span
                    style={{
                      width: 28,
                      height: 28,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 10,
                      background:
                        "rgba(255,255,255,0.055)",
                      color:
                        theme.colors.textSoft,
                      transform: isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition:
                        "transform 180ms ease",
                    }}
                  >
                    <ChevronDownIcon />
                  </span>
                </span>
              </button>

              {isOpen && (
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    marginTop: 8,
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

function getCategoryMeta(
  category: Exclude<
    ToolCategory,
    "In evidenza"
  >,
): {
  eyebrow: string;
  subtitle: string;
  accent: string;
  icon: ReactNode;
} {
  if (category === "Viaggio") {
    return {
      eyebrow: "Organizzazione",
      subtitle:
        "Prenotazioni, tappe e preparazione",
      accent:
        theme.colors.warning,
      icon: <SuitcaseIcon />,
    };
  }

  if (category === "Utilità") {
    return {
      eyebrow: "Sul posto",
      subtitle:
        "Strumenti pratici durante il viaggio",
      accent:
        theme.colors.info,
      icon: <ToolsIcon />,
    };
  }

  if (category === "Sicurezza") {
    return {
      eyebrow: "Protezione",
      subtitle:
        "Emergenze, dati e backup",
      accent:
        theme.colors.danger,
      icon: <ShieldIcon />,
    };
  }

  return {
    eyebrow: "Applicazione",
    subtitle:
      "Profilo, aggiornamenti e simulazione",
    accent: "#C7AEFF",
    icon: <SettingsIcon />,
  };
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
            fontSize:
              theme.typography.eyebrow,
            fontWeight: 900,
            letterSpacing: 1.1,
            textTransform:
              "uppercase",
          }}
        >
          {eyebrow}
        </p>

        <h2
          style={{
            margin: "5px 0 0",
            fontSize:
              theme.typography.title,
            lineHeight: 1.2,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </h2>
      </div>

      <span
        style={{
          minWidth: 27,
          padding: "5px 8px",
          borderRadius:
            theme.radius.pill,
          background:
            theme.colors.primarySoft,
          color:
            theme.colors.primary,
          fontSize: 9,
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
        minHeight: 158,
        padding: 15,
        border: `1px solid ${item.accent}24`,
        borderRadius: 21,
        background:
          `linear-gradient(145deg, ${item.accent}0F, rgba(255,255,255,0.052))`,
        boxShadow:
          theme.shadows.soft,
        color:
          theme.colors.text,
        textAlign: "left",
        cursor: "pointer",
        WebkitTapHighlightColor:
          "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems:
            "flex-start",
          justifyContent:
            "space-between",
          gap: 8,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            display: "grid",
            placeItems: "center",
            borderRadius: 14,
            background: `${item.accent}14`,
            color: item.accent,
          }}
        >
          <ToolIcon
            name={item.icon}
            size={21}
          />
        </span>

        {item.badge && (
          <span
            style={{
              padding: "5px 7px",
              borderRadius:
                theme.radius.pill,
              background: `${item.accent}12`,
              color: item.accent,
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: 0.35,
              textTransform:
                "uppercase",
            }}
          >
            {item.badge}
          </span>
        )}
      </div>

      <strong
        style={{
          display: "block",
          marginTop: 14,
          fontSize: 15,
          lineHeight: 1.25,
        }}
      >
        {item.title}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 5,
          color:
            theme.colors.textSoft,
          fontSize: 10,
          lineHeight: 1.4,
        }}
      >
        {item.subtitle}
      </span>

      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginTop: 11,
          color: item.accent,
          fontSize: 11,
          fontWeight: 900,
        }}
      >
        Apri
        <ArrowRightIcon />
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
        display: "grid",
        gridTemplateColumns:
          "43px minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 12,
        padding: 12,
        border:
          `1px solid ${theme.colors.border}`,
        borderRadius: 17,
        background:
          theme.colors.cardSoft,
        boxShadow:
          theme.shadows.soft,
        color:
          theme.colors.text,
        textAlign: "left",
        cursor: "pointer",
        WebkitTapHighlightColor:
          "transparent",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 43,
          height: 43,
          display: "grid",
          placeItems: "center",
          borderRadius: 14,
          background: `${item.accent}14`,
          color: item.accent,
        }}
      >
        <ToolIcon
          name={item.icon}
          size={20}
        />
      </span>

      <span
        style={{
          minWidth: 0,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <strong
            style={{
              fontSize: 14,
              lineHeight: 1.25,
            }}
          >
            {item.title}
          </strong>

          {item.badge && (
            <span
              style={{
                padding: "4px 6px",
                borderRadius:
                  theme.radius.pill,
                background: `${item.accent}12`,
                color:
                  item.accent,
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
            marginTop: 4,
            overflow: "hidden",
            color:
              theme.colors.textSoft,
            fontSize: 10,
            lineHeight: 1.35,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.subtitle}
        </span>
      </span>

      <span
        aria-hidden="true"
        style={{
          width: 30,
          height: 30,
          display: "grid",
          placeItems: "center",
          borderRadius: 10,
          background:
            "rgba(255,255,255,0.045)",
          color: item.accent,
        }}
      >
        <ChevronRightIcon />
      </span>
    </button>
  );
}

function ToolIcon({
  name,
  size = 20,
}: {
  name: ToolIconName;
  size?: number;
}) {
  if (name === "compass") {
    return <CompassIcon size={size} />;
  }

  if (name === "clock") {
    return <ClockIcon size={size} />;
  }

  if (name === "ticket") {
    return <TicketIcon size={size} />;
  }

  if (name === "sos") {
    return <SosIcon size={size} />;
  }

  if (name === "bed") {
    return <BedIcon size={size} />;
  }

  if (name === "restaurant") {
    return <RestaurantIcon size={size} />;
  }

  if (name === "car") {
    return <CarIcon size={size} />;
  }

  if (name === "folder") {
    return <FolderIcon size={size} />;
  }

  if (name === "check") {
    return <CheckSquareIcon size={size} />;
  }

  if (name === "backpack") {
    return <BackpackIcon size={size} />;
  }

  if (name === "weather") {
    return <WeatherIcon size={size} />;
  }

  if (name === "fuel") {
    return <FuelIcon size={size} />;
  }

  if (name === "currency") {
    return <CurrencyIcon size={size} />;
  }

  if (name === "message") {
    return <MessageIcon size={size} />;
  }

  if (name === "notes") {
    return <NotesIcon size={size} />;
  }

  if (name === "phone") {
    return <PhoneIcon size={size} />;
  }

  if (name === "backup") {
    return <BackupIcon size={size} />;
  }

  if (name === "lock") {
    return <LockIcon size={size} />;
  }

  if (name === "shield") {
    return <ShieldIcon size={size} />;
  }

  if (name === "profile") {
    return <ProfileIcon size={size} />;
  }

  if (name === "settings") {
    return <SettingsIcon size={size} />;
  }

  if (name === "calendar") {
    return <CalendarIcon size={size} />;
  }

  return <FlaskIcon size={size} />;
}

type IconProps = {
  size?: number;
};

function IconBase({
  children,
  size = 18,
}: IconProps & {
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
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

function GridIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </IconBase>
  );
}

function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </IconBase>
  );
}

function ArrowLeftIcon() {
  return (
    <IconBase size={16}>
      <path d="m15 18-6-6 6-6" />
    </IconBase>
  );
}

function ArrowRightIcon() {
  return (
    <IconBase size={14}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

function ChevronDownIcon() {
  return (
    <IconBase size={17}>
      <path d="m7 10 5 5 5-5" />
    </IconBase>
  );
}

function ChevronRightIcon() {
  return (
    <IconBase size={17}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}

function SuitcaseIcon() {
  return (
    <IconBase size={22}>
      <rect x="4" y="7" width="16" height="13" rx="3" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M8 12v3" />
      <path d="M16 12v3" />
    </IconBase>
  );
}

function ToolsIcon() {
  return (
    <IconBase size={22}>
      <path d="m14 7 3-3 3 3-3 3" />
      <path d="M4 20 17 7" />
      <path d="m7 14 3 3-4 4-3-3Z" />
    </IconBase>
  );
}

function CompassIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8Z" />
    </IconBase>
  );
}

function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

function TicketIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 5v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.5 2.5 0 0 0 0-5Z" />
      <path d="M12 5v14" />
    </IconBase>
  );
}

function SosIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M7 12h2" />
      <path d="M15 12h2" />
      <path d="M12 7v2" />
      <path d="M12 15v2" />
      <circle cx="12" cy="12" r="2.5" />
    </IconBase>
  );
}

function BedIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 19v-8" />
      <path d="M21 19v-6a3 3 0 0 0-3-3H7a4 4 0 0 0-4 4" />
      <path d="M3 16h18" />
      <path d="M7 10V7h5a3 3 0 0 1 3 3" />
    </IconBase>
  );
}

function RestaurantIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 3v8" />
      <path d="M4 3v5a3 3 0 0 0 6 0V3" />
      <path d="M7 11v10" />
      <path d="M17 3v18" />
      <path d="M17 3c3 2 3 7 0 9" />
    </IconBase>
  );
}

function CarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 17-1-5 2-5h12l2 5-1 5" />
      <path d="M3 14h18" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </IconBase>
  );
}

function FolderIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </IconBase>
  );
}

function CheckSquareIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="m8 12 3 3 5-6" />
    </IconBase>
  );
}

function BackpackIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 8V6a5 5 0 0 1 10 0v2" />
      <rect x="5" y="7" width="14" height="14" rx="4" />
      <path d="M8 12h8" />
      <path d="M9 15h6" />
    </IconBase>
  );
}

function WeatherIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 2v2" />
      <path d="M2 8h2" />
      <path d="m3.8 3.8 1.4 1.4" />
      <path d="M12 16a4 4 0 0 0-7.5-2A3.5 3.5 0 0 0 5 21h11a4 4 0 0 0 0-8 5 5 0 0 0-4 2" />
    </IconBase>
  );
}

function FuelIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="3" width="10" height="18" rx="2" />
      <path d="M7 7h4" />
      <path d="M14 8h2l3 3v7a2 2 0 0 0 2 2" />
    </IconBase>
  );
}

function CurrencyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 7h11" />
      <path d="m13 4 3 3-3 3" />
      <path d="M19 17H8" />
      <path d="m11 14-3 3 3 3" />
    </IconBase>
  );
}

function MessageIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </IconBase>
  );
}

function NotesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 3h14v18H5Z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </IconBase>
  );
}

function PhoneIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6.5 3h3l1.5 4-2 1.5a15 15 0 0 0 6.5 6.5L17 13l4 1.5v3A3.5 3.5 0 0 1 17.5 21C9.5 21 3 14.5 3 6.5A3.5 3.5 0 0 1 6.5 3Z" />
    </IconBase>
  );
}

function BackupIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 4h12l2 2v14H5Z" />
      <path d="M8 4v6h8V4" />
      <path d="M8 20v-6h8v6" />
    </IconBase>
  );
}

function LockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="10" width="16" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </IconBase>
  );
}

function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

function ProfileIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </IconBase>
  );
}

function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L7 4.2l.1.1A1.7 1.7 0 0 0 9 4a1.7 1.7 0 0 0 1-1.6V2h4v.4A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 6l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1H21v4h-.1a1.7 1.7 0 0 0-1.5 2Z" />
    </IconBase>
  );
}

function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
    </IconBase>
  );
}

function FlaskIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
      <path d="M8 15h8" />
    </IconBase>
  );
}

export default More;