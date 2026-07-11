import { useState } from "react";
import Accommodations from "./Accommodations";
import Bookings from "./Bookings";
import CurrencyConverter from "./CurrencyConverter";
import DataBackup from "./DataBackup";
import FoodGuide from "./FoodGuide";
import PackingChecklist from "./PackingChecklist";
import Phrasebook from "./Phrasebook";
import RoadTrip from "./RoadTrip";
import TravelInfo from "./TravelInfo";
import TripNotes from "./TripNotes";
import WeatherPage from "./WeatherPage";
import FuelCalculator from "./FuelCalculator";
import AppSettings from "./AppSettings";
import TripSimulator from "./TripSimulator";
import PreTripCheck from "./PreTripCheck";
import PrivateTravelData from "./PrivateTravelData";
import DocumentVault from "./DocumentVault";
import DailyAgenda from "./DailyAgenda";
import TravelerProfile from "./TravelerProfile";
import EmergencyLocation from "./EmergencyLocation";
import { theme } from "../styles/theme";

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
  | "profile";

const menuItems = [
  {
  id: "profile",
  icon: "👤",
  title: "Il mio profilo",
  subtitle: "Personalizza questo dispositivo",
},
  {
    id: "accommodations",
    icon: "🏨",
    title: "Alloggi",
    subtitle: "6 prenotazioni Airbnb",
  },
  {
    id: "food",
    icon: "🍽️",
    title: "Food Guide",
    subtitle: "Ristoranti e locali",
  },
  {
    id: "bookings",
    icon: "🎟️",
    title: "Prenotazioni",
    subtitle: "Traghetti, auto e attività",
  },
  {
  id: "documents",
  icon: "🗂️",
  title: "Cassaforte documenti",
  subtitle: "Voucher e biglietti disponibili offline",
},
{
  id: "agenda",
  icon: "🕒",
  title: "Agenda del giorno",
  subtitle: "Attività, orari e spostamenti",
},
  {
    id: "roadtrip",
    icon: "🚗",
    title: "Road Trip",
    subtitle: "Tratte, tempi e soste",
  },
  {
  id: "fuel",
  icon: "⛽",
  title: "Carburante",
  subtitle: "Consumi e divisione dei costi",
},
  {
    id: "checklist",
    icon: "🎒",
    title: "Checklist valigia",
    subtitle: "Prepara tutto per la partenza",
  },
  {
  id: "weather",
  icon: "🌤️",
  title: "Meteo Yucatán",
  subtitle: "Previsioni per tutte le tappe",
},
  {
    id: "currency",
    icon: "💱",
    title: "Cambio valuta",
    subtitle: "Euro e peso messicano",
  },
  {
    id: "phrasebook",
    icon: "💬",
    title: "Frasario spagnolo",
    subtitle: "Frasi utili anche offline",
  },
  {
    id: "notes",
    icon: "📝",
    title: "Note di viaggio",
    subtitle: "Promemoria e informazioni offline",
  },
  {
    id: "backup",
    icon: "💾",
    title: "Backup dati",
    subtitle: "Salva e trasferisci i dati dell’app",
  },
  {
  id: "settings",
  icon: "⚙️",
  title: "Aggiornamenti app",
  subtitle: "Versione, cache e installazione",
},
{
  id: "emergency-location",
  icon: "🆘",
  title: "SOS e posizione",
  subtitle: "Emergenze e condivisione GPS",
},
  {
    id: "info",
    icon: "🆘",
    title: "Info e numeri utili",
    subtitle: "Emergenze e contatti personali",
  },
  {
  id: "pretrip",
  icon: "✅",
  title: "Controllo pre-partenza",
  subtitle: "Verifica che l’app sia pronta",
},
  {
  id: "simulator",
  icon: "🧪",
  title: "Simula il viaggio",
  subtitle: "Prova in anticipo ogni giornata",
},
{
  id: "private-data",
  icon: "🔐",
  title: "Codici privati",
  subtitle: "PNR e riferimenti salvati sul telefono",
},
];

function More() {
  const [section, setSection] =
    useState<MoreSection>("menu");

  function renderBackButton() {
    return (
      <button
        type="button"
        onClick={() => setSection("menu")}
        style={{
          position: "fixed",
          top: "calc(14px + env(safe-area-inset-top))",
          left: 16,
          zIndex: 1000,
          padding: "10px 14px",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 14,
          background: "rgba(7,26,46,0.94)",
          color: theme.colors.text,
          fontWeight: 750,
          cursor: "pointer",
          backdropFilter: "blur(14px)",
        }}
      >
        ← Altro
      </button>
    );
  }

  const pages: Partial<Record<MoreSection, React.ReactNode>> = {
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
    "emergency-location": <EmergencyLocation />,
  };

  if (section !== "menu") {
    return (
      <div>
        {renderBackButton()}
        {pages[section]}
      </div>
    );
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
          fontWeight: 850,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        Ruta Maya
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Altro
      </h1>

      <p
        style={{
          marginTop: 0,
          marginBottom: 28,
          color: theme.colors.textSoft,
        }}
      >
        Tutto ciò che serve durante il viaggio
      </p>

      <section style={{ display: "grid", gap: 13 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setSection(item.id as MoreSection)
            }
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 18,
              border:
                "1px solid rgba(255,255,255,0.09)",
              borderRadius: 21,
              background: theme.colors.card,
              color: theme.colors.text,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 50,
                height: 50,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                borderRadius: 17,
                background: "rgba(17,197,191,0.16)",
                fontSize: 25,
              }}
            >
              {item.icon}
            </span>

            <span style={{ flex: 1 }}>
              <strong
                style={{
                  display: "block",
                  fontSize: 17,
                }}
              >
                {item.title}
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 5,
                  color: theme.colors.textSoft,
                  fontSize: 13,
                }}
              >
                {item.subtitle}
              </span>
            </span>

            <span
              style={{
                color: theme.colors.primary,
                fontSize: 23,
              }}
            >
              ›
            </span>
          </button>
        ))}
      </section>
    </main>
  );
}

export default More;