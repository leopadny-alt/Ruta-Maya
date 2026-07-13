import type { ReactNode } from "react";

export type Tab =
  | "home"
  | "map"
  | "itinerary"
  | "budget"
  | "more";

type BottomNavigationProps = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
};

type NavigationItem = {
  id: Tab;
  label: string;
  icon: ReactNode;
  accent: string;
};

const navigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <HomeIcon />,
    accent: "#11C5BF",
  },
  {
    id: "map",
    label: "Mappa",
    icon: <MapIcon />,
    accent: "#6ED4FF",
  },
  {
    id: "itinerary",
    label: "Itinerario",
    icon: <CalendarIcon />,
    accent: "#F4D58D",
  },
  {
    id: "budget",
    label: "Budget",
    icon: <WalletIcon />,
    accent: "#FFB86B",
  },
  {
    id: "more",
    label: "Altro",
    icon: <MoreIcon />,
    accent: "#C3A8FF",
  },
];

function BottomNavigation({
  activeTab,
  onChange,
}: BottomNavigationProps) {
  function handleNavigation(tab: Tab) {
    if (
      tab === "more" &&
      activeTab === "more"
    ) {
      window.dispatchEvent(
        new Event(
          "ruta-maya:open-tools-menu",
        ),
      );
    }

    onChange(tab);
  }

  return (
    <nav
      aria-label="Navigazione principale"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom:
          "calc(9px + env(safe-area-inset-bottom))",
        zIndex: 4000,
        maxWidth: 690,
        margin: "0 auto",
        padding: 7,
        border:
          "1px solid rgba(255,255,255,0.12)",
        borderRadius: 27,
        background:
          "linear-gradient(180deg, rgba(8,27,46,0.91), rgba(4,17,31,0.94))",
        boxShadow:
          "0 22px 55px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.055)",
        backdropFilter:
          "blur(26px) saturate(155%)",
        WebkitBackdropFilter:
          "blur(26px) saturate(155%)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, minmax(0, 1fr))",
          gap: 4,
        }}
      >
        {navigationItems.map((item) => {
          const isActive =
            activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
              onClick={() =>
                handleNavigation(item.id)
              }
              style={{
                position: "relative",
                minWidth: 0,
                minHeight: 59,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent:
                  "center",
                gap: 4,
                padding: "7px 3px",
                border: 0,
                borderRadius: 20,
                background: isActive
                  ? `linear-gradient(
                      180deg,
                      ${item.accent}20,
                      ${item.accent}0A
                    )`
                  : "transparent",
                color: isActive
                  ? item.accent
                  : "rgba(255,255,255,0.52)",
                cursor: "pointer",
                overflow: "hidden",
                transition:
                  "background 180ms ease, color 180ms ease, transform 160ms ease",
                WebkitTapHighlightColor:
                  "transparent",
              }}
            >
              {isActive && (
                <>
                  <span
                    aria-hidden="true"
                    style={{
                      position:
                        "absolute",
                      top: 0,
                      left: "50%",
                      width: 25,
                      height: 3,
                      borderRadius:
                        "0 0 999px 999px",
                      background:
                        item.accent,
                      boxShadow: `0 0 15px ${item.accent}B3`,
                      transform:
                        "translateX(-50%)",
                    }}
                  />

                  <span
                    aria-hidden="true"
                    style={{
                      position:
                        "absolute",
                      top: 8,
                      left: "50%",
                      width: 42,
                      height: 42,
                      borderRadius:
                        "50%",
                      background: `${item.accent}12`,
                      filter: "blur(5px)",
                      transform:
                        "translateX(-50%)",
                    }}
                  />
                </>
              )}

              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: 28,
                  height: 28,
                  display: "grid",
                  placeItems: "center",
                  transform: isActive
                    ? "translateY(-1px) scale(1.08)"
                    : "scale(1)",
                  transition:
                    "transform 190ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {item.icon}
              </span>

              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 9.5,
                  fontWeight: isActive
                    ? 900
                    : 700,
                  letterSpacing: 0.1,
                  transition:
                    "font-weight 180ms ease",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

type IconProps = {
  size?: number;
};

function IconBase({
  children,
  size = 23,
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
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function HomeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3.5 10.5 12 3.2l8.5 7.3" />
      <path d="M5.5 9.8V20.5h13V9.8" />
      <path d="M9.4 20.5v-5.7h5.2v5.7" />
    </IconBase>
  );
}

function MapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3.5 6.2 4.8-2 7.5 2 4.7-2v13.6l-4.7 2-7.5-2-4.8 2Z" />
      <path d="M8.3 4.2v13.6" />
      <path d="M15.8 6.2v13.6" />
    </IconBase>
  );
}

function CalendarIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <rect
        x="3.2"
        y="5.3"
        width="17.6"
        height="15.2"
        rx="3"
      />
      <path d="M8 3.2v4" />
      <path d="M16 3.2v4" />
      <path d="M3.2 10h17.6" />
      <path d="M8 14h2" />
      <path d="M14 14h2" />
      <path d="M8 17.8h2" />
      <path d="M14 17.8h2" />
    </IconBase>
  );
}

function WalletIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="M4 6.6A2.6 2.6 0 0 1 6.6 4H18a2 2 0 0 1 2 2v2H7.1a3.1 3.1 0 0 0 0 6.2H20v3.7a2 2 0 0 1-2 2H6.6A2.6 2.6 0 0 1 4 17.3Z" />
      <path d="M20 8H7.1a3.1 3.1 0 0 0 0 6.2H20Z" />
      <circle
        cx="16.5"
        cy="11.1"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
    </IconBase>
  );
}

function MoreIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle
        cx="5"
        cy="12"
        r="1.4"
        fill="currentColor"
        stroke="none"
      />
      <circle
        cx="12"
        cy="12"
        r="1.4"
        fill="currentColor"
        stroke="none"
      />
      <circle
        cx="19"
        cy="12"
        r="1.4"
        fill="currentColor"
        stroke="none"
      />
    </IconBase>
  );
}

export default BottomNavigation;