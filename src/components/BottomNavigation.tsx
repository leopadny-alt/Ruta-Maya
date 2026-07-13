import type {
  CSSProperties,
  ReactNode,
} from "react";
import { theme } from "../styles/theme";

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
    accent: theme.colors.primary,
  },
  {
    id: "map",
    label: "Mappa",
    icon: <MapIcon />,
    accent: theme.colors.info,
  },
  {
    id: "itinerary",
    label: "Itinerario",
    icon: <CalendarIcon />,
    accent: theme.colors.secondary,
  },
  {
    id: "budget",
    label: "Budget",
    icon: <WalletIcon />,
    accent: theme.colors.warning,
  },
  {
    id: "more",
    label: "Altro",
    icon: <MoreIcon />,
    accent: "#C7AEFF",
  },
];

function BottomNavigation({
  activeTab,
  onChange,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="Navigazione principale"
      style={navigationStyle}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, minmax(0, 1fr))",
          gap: 3,
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
              title={item.label}
              onClick={() =>
                onChange(item.id)
              }
              style={{
                position: "relative",
                minWidth: 0,
                minHeight: 54,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent:
                  "center",
                gap: 3,
                padding: "5px 2px 4px",
                border: 0,
                borderRadius: 18,
                outline: "none",
                background: isActive
                  ? `linear-gradient(
                      180deg,
                      ${item.accent}22,
                      ${item.accent}0D
                    )`
                  : "transparent",
                color: isActive
                  ? item.accent
                  : theme.colors.textMuted,
                cursor: "pointer",
                WebkitTapHighlightColor:
                  "transparent",
                touchAction: "manipulation",
                transition: `
                  background ${theme.motion.fast},
                  color ${theme.motion.fast},
                  transform ${theme.motion.fast}
                `,
              }}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    width: 24,
                    height: 2,
                    borderRadius:
                      "0 0 999px 999px",
                    background:
                      item.accent,
                    boxShadow: `0 0 13px ${item.accent}99`,
                    transform:
                      "translateX(-50%)",
                  }}
                />
              )}

              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  width: 31,
                  height: 31,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 11,
                  background: isActive
                    ? `${item.accent}16`
                    : "transparent",
                  boxShadow: isActive
                    ? `inset 0 0 0 1px ${item.accent}1C`
                    : "none",
                  transform: isActive
                    ? "translateY(-1px)"
                    : "translateY(0)",
                  transition: `
                    transform ${theme.motion.normal},
                    background ${theme.motion.fast}
                  `,
                }}
              >
                {item.icon}
              </span>

              <span
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: isActive
                    ? 10
                    : 9.5,
                  lineHeight: 1.05,
                  fontWeight: isActive
                    ? 900
                    : 750,
                  letterSpacing: 0.05,
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

const navigationStyle: CSSProperties = {
  position: "fixed",
  left: 10,
  right: 10,
  bottom:
    "calc(7px + env(safe-area-inset-bottom))",
  zIndex: 4000,
  maxWidth: 620,
  margin: "0 auto",
  padding: 6,
  border: `1px solid ${theme.colors.borderStrong}`,
  borderRadius: 25,
  background:
    "linear-gradient(180deg, rgba(8,29,48,0.92), rgba(4,18,32,0.96))",
  boxShadow: `
    ${theme.shadows.floating},
    inset 0 1px 0 rgba(255,255,255,0.055)
  `,
  backdropFilter:
    "blur(24px) saturate(150%)",
  WebkitBackdropFilter:
    "blur(24px) saturate(150%)",
};

type IconProps = {
  size?: number;
};

function IconBase({
  children,
  size = 22,
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