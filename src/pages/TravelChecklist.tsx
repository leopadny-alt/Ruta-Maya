import { useMemo, useState } from "react";
import {
  travelChecklist,
  type ChecklistCategory,
} from "../data/travelChecklist";
import { getTravelerProfile } from "../utils/travelerProfile";
import { theme } from "../styles/theme";

const STORAGE_KEY = "ruta-maya-travel-checklist";

type ChecklistState = Record<string, boolean>;

const categories: ChecklistCategory[] = [
  "Documenti",
  "Tecnologia",
  "Bagaglio",
  "Auto",
  "Prenotazioni",
];

const categoryIcons: Record<ChecklistCategory, string> = {
  Documenti: "🛂",
  Tecnologia: "📱",
  Bagaglio: "🎒",
  Auto: "🚗",
  Prenotazioni: "🎫",
};

function getSavedChecklist(): ChecklistState {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);

    if (!savedValue) {
      return {};
    }

    return JSON.parse(savedValue) as ChecklistState;
  } catch {
    return {};
  }
}

function TravelChecklist() {
  const traveler = getTravelerProfile();

  const [checkedItems, setCheckedItems] =
    useState<ChecklistState>(getSavedChecklist());

  const completedItems = useMemo(
    () =>
      travelChecklist.filter(
        (item) => checkedItems[item.id],
      ).length,
    [checkedItems],
  );

  const percentage = Math.round(
    (completedItems / travelChecklist.length) * 100,
  );

  function toggleItem(id: string) {
    const updatedState = {
      ...checkedItems,
      [id]: !checkedItems[id],
    };

    setCheckedItems(updatedState);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedState),
    );
  }

  function resetChecklist() {
    const confirmed = window.confirm(
      "Vuoi azzerare tutte le spunte della checklist?",
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    setCheckedItems({});
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
        Preparazione
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Checklist viaggio
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        {traveler
          ? `Checklist personale di ${traveler}.`
          : "Controlla tutto prima della partenza."}
      </p>

      <section
        style={{
          marginTop: 22,
          padding: 21,
          borderRadius: 24,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 15,
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 800,
                opacity: 0.8,
                textTransform: "uppercase",
              }}
            >
              Preparazione
            </span>

            <strong
              style={{
                display: "block",
                marginTop: 5,
                fontSize: 36,
              }}
            >
              {percentage}%
            </strong>
          </div>

          <span
            style={{
              fontSize: 13,
              fontWeight: 750,
              opacity: 0.85,
            }}
          >
            {completedItems}/{travelChecklist.length} completate
          </span>
        </div>

        <div
          style={{
            height: 9,
            marginTop: 17,
            overflow: "hidden",
            borderRadius: 999,
            background: "rgba(0,0,0,0.20)",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              borderRadius: 999,
              background: "#FFFFFF",
              transition: "width 0.25s ease",
            }}
          />
        </div>

        {percentage === 100 && (
          <p
            style={{
              margin: "15px 0 0",
              fontWeight: 800,
            }}
          >
            ✓ Tutto pronto. Si parte.
          </p>
        )}
      </section>

      {categories.map((category) => {
        const items = travelChecklist.filter(
          (item) => item.category === category,
        );

        const completedCategoryItems = items.filter(
          (item) => checkedItems[item.id],
        ).length;

        return (
          <section
            key={category}
            style={{ marginTop: 27 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  margin: 0,
                  fontSize: 21,
                }}
              >
                <span>{categoryIcons[category]}</span>
                {category}
              </h2>

              <span
                style={{
                  padding: "6px 9px",
                  borderRadius: 999,
                  background: "rgba(17,197,191,0.14)",
                  color: theme.colors.primary,
                  fontSize: 11,
                  fontWeight: 850,
                }}
              >
                {completedCategoryItems}/{items.length}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 13,
              }}
            >
              {items.map((item) => {
                const isChecked = Boolean(
                  checkedItems[item.id],
                );

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 13,
                      padding: 16,
                      border: isChecked
                        ? "1px solid rgba(17,197,191,0.28)"
                        : item.important
                          ? "1px solid rgba(244,213,141,0.24)"
                          : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 19,
                      background: isChecked
                        ? "rgba(17,197,191,0.10)"
                        : theme.colors.card,
                      color: theme.colors.text,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        borderRadius: 10,
                        background: isChecked
                          ? theme.colors.primary
                          : "rgba(255,255,255,0.06)",
                        border: isChecked
                          ? "1px solid transparent"
                          : "1px solid rgba(255,255,255,0.12)",
                        color: isChecked
                          ? theme.colors.background
                          : theme.colors.textSoft,
                        fontWeight: 900,
                      }}
                    >
                      {isChecked ? "✓" : ""}
                    </span>

                    <div style={{ flex: 1 }}>
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
                            fontSize: 15,
                            lineHeight: 1.4,
                            textDecoration: isChecked
                              ? "line-through"
                              : "none",
                            opacity: isChecked ? 0.65 : 1,
                          }}
                        >
                          {item.title}
                        </strong>

                        {item.important && !isChecked && (
                          <span
                            style={{
                              padding: "4px 6px",
                              borderRadius: 999,
                              background:
                                "rgba(244,213,141,0.10)",
                              color: theme.colors.secondary,
                              fontSize: 9,
                              fontWeight: 850,
                              textTransform: "uppercase",
                            }}
                          >
                            Importante
                          </span>
                        )}
                      </div>

                      {item.note && (
                        <p
                          style={{
                            margin: "6px 0 0",
                            color: theme.colors.textSoft,
                            fontSize: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.note}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <button
        type="button"
        onClick={resetChecklist}
        style={{
          width: "100%",
          marginTop: 28,
          padding: 13,
          border: "1px solid rgba(255,255,255,0.11)",
          borderRadius: 16,
          background: theme.colors.card,
          color: theme.colors.textSoft,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Azzera checklist
      </button>
    </main>
  );
}

export default TravelChecklist;