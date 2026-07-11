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
  icon: React.ReactNode;
};

const navigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <HomeIcon />,
  },
  {
    id: "map",
    label: "Mappa",
    icon: <MapIcon />,
  },
  {
    id: "itinerary",
    label: "Itinerario",
    icon: <CalendarIcon />,
  },
  {
    id: "budget",
    label: "Budget",
    icon: <WalletIcon />,
  },
  {
    id: "more",
    label: "Altro",
    icon: <MoreIcon />,
  },
];

function BottomNavigation({
  activeTab,
  onChange,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="Navigazione principale"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: "calc(10px + env(safe-area-inset-bottom))",
        zIndex: 4000,
        maxWidth: 690,
        margin: "0 auto",
        padding: 8,
        border: "1px solid rgba(255,255,255,0.11)",
        borderRadius: 26,
        background: "rgba(5,18,32,0.84)",
        boxShadow:
          "0 18px 45px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)",
        backdropFilter: "blur(24px) saturate(145%)",
        WebkitBackdropFilter: "blur(24px) saturate(145%)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 5,
        }}
      >
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(item.id)}
              style={{
                position: "relative",
                minWidth: 0,
                minHeight: 58,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "7px 4px",
                border: 0,
                borderRadius: 19,
                background: isActive
                  ? "linear-gradient(180deg, rgba(17,197,191,0.22), rgba(17,197,191,0.09))"
                  : "transparent",
                color: isActive
                  ? "#5CE2DC"
                  : "rgba(255,255,255,0.58)",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    width: 28,
                    height: 3,
                    borderRadius: "0 0 999px 999px",
                    background: "#11C5BF",
                    boxShadow: "0 0 14px rgba(17,197,191,0.72)",
                    transform: "translateX(-50%)",
                  }}
                />
              )}

              <span
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 24,
                  display: "grid",
                  placeItems: "center",
                  transform: isActive
                    ? "translateY(-1px) scale(1.06)"
                    : "none",
                  transition:
                    "transform 180ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {item.icon}
              </span>

              <span
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 10,
                  fontWeight: isActive ? 850 : 700,
                  letterSpacing: 0.1,
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
  children: React.ReactNode;
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

function HomeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.5 9.8V21h13V9.8" />
      <path d="M9.5 21v-6h5v6" />
    </IconBase>
  );
}

function MapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 6 5-2 8 2 5-2v14l-5 2-8-2-5 2Z" />
      <path d="M8 4v14" />
      <path d="M16 6v14" />
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
      <path d="M8 14h2" />
      <path d="M14 14h2" />
      <path d="M8 18h2" />
      <path d="M14 18h2" />
    </IconBase>
  );
}

function WalletIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v2H7a3 3 0 0 0 0 6h13v4a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5Z" />
      <path d="M20 8H7a3 3 0 0 0 0 6h13Z" />
      <path d="M16.5 11h.01" />
    </IconBase>
  );
}

function MoreIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export default BottomNavigation;