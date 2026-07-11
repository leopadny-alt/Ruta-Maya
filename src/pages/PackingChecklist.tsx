import { useEffect, useMemo, useState } from "react";
import { theme } from "../styles/theme";

type ChecklistCategory =
  | "Documenti"
  | "Abbigliamento"
  | "Tecnologia"
  | "Salute"
  | "Mare"
  | "Altro";

type ChecklistItem = {
  id: string;
  label: string;
  category: ChecklistCategory;
  completed: boolean;
  custom?: boolean;
};

const STORAGE_KEY = "ruta-maya-packing-checklist";

const defaultItems: ChecklistItem[] = [
  {
    id: "passport",
    label: "Passaporto",
    category: "Documenti",
    completed: false,
  },
  {
    id: "esta",
    label: "ESTA e documenti per gli Stati Uniti",
    category: "Documenti",
    completed: false,
  },
  {
    id: "flight-documents",
    label: "Biglietti aerei e prenotazioni",
    category: "Documenti",
    completed: false,
  },
  {
    id: "driving-license",
    label: "Patente e documenti noleggio auto",
    category: "Documenti",
    completed: false,
  },
  {
    id: "insurance",
    label: "Assicurazione di viaggio",
    category: "Documenti",
    completed: false,
  },
  {
    id: "cards",
    label: "Carte di pagamento e contanti",
    category: "Documenti",
    completed: false,
  },
  {
    id: "tshirts",
    label: "Magliette leggere",
    category: "Abbigliamento",
    completed: false,
  },
  {
    id: "shorts",
    label: "Pantaloncini",
    category: "Abbigliamento",
    completed: false,
  },
  {
    id: "evening-clothes",
    label: "Abbigliamento per la sera",
    category: "Abbigliamento",
    completed: false,
  },
  {
    id: "rain-jacket",
    label: "Giacca impermeabile leggera",
    category: "Abbigliamento",
    completed: false,
  },
  {
    id: "comfortable-shoes",
    label: "Scarpe comode",
    category: "Abbigliamento",
    completed: false,
  },
  {
    id: "sandals",
    label: "Sandali o infradito",
    category: "Abbigliamento",
    completed: false,
  },
  {
    id: "phone",
    label: "Telefono",
    category: "Tecnologia",
    completed: false,
  },
  {
    id: "chargers",
    label: "Caricabatterie",
    category: "Tecnologia",
    completed: false,
  },
  {
    id: "powerbank",
    label: "Power bank",
    category: "Tecnologia",
    completed: false,
  },
  {
    id: "adapter",
    label: "Adattatore prese USA/Messico",
    category: "Tecnologia",
    completed: false,
  },
  {
    id: "headphones",
    label: "Cuffie",
    category: "Tecnologia",
    completed: false,
  },
  {
    id: "medicines",
    label: "Medicinali personali",
    category: "Salute",
    completed: false,
  },
  {
    id: "first-aid",
    label: "Piccolo kit di primo soccorso",
    category: "Salute",
    completed: false,
  },
  {
    id: "sunscreen",
    label: "Protezione solare",
    category: "Salute",
    completed: false,
  },
  {
    id: "repellent",
    label: "Repellente per insetti",
    category: "Salute",
    completed: false,
  },
  {
    id: "swimsuit",
    label: "Costume da bagno",
    category: "Mare",
    completed: false,
  },
  {
    id: "beach-towel",
    label: "Telo mare",
    category: "Mare",
    completed: false,
  },
  {
    id: "water-shoes",
    label: "Scarpette da scoglio o cenote",
    category: "Mare",
    completed: false,
  },
  {
    id: "dry-bag",
    label: "Borsa impermeabile",
    category: "Mare",
    completed: false,
  },
  {
    id: "sunglasses",
    label: "Occhiali da sole",
    category: "Altro",
    completed: false,
  },
  {
    id: "hat",
    label: "Cappello",
    category: "Altro",
    completed: false,
  },
  {
    id: "water-bottle",
    label: "Borraccia",
    category: "Altro",
    completed: false,
  },
];

const categoryIcons: Record<ChecklistCategory, string> = {
  Documenti: "📄",
  Abbigliamento: "👕",
  Tecnologia: "🔌",
  Salute: "🩺",
  Mare: "🌊",
  Altro: "🎒",
};

const categories: ChecklistCategory[] = [
  "Documenti",
  "Abbigliamento",
  "Tecnologia",
  "Salute",
  "Mare",
  "Altro",
];

function PackingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);
  const [selectedCategory, setSelectedCategory] =
    useState<ChecklistCategory | "Tutti">("Tutti");
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemCategory, setNewItemCategory] =
    useState<ChecklistCategory>("Altro");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (!savedItems) {
      return;
    }

    try {
      setItems(JSON.parse(savedItems));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const visibleItems = useMemo(() => {
    if (selectedCategory === "Tutti") {
      return items;
    }

    return items.filter(
      (item) => item.category === selectedCategory,
    );
  }, [items, selectedCategory]);

  const completedCount = items.filter(
    (item) => item.completed,
  ).length;

  const progress =
    items.length === 0
      ? 0
      : Math.round((completedCount / items.length) * 100);

  function toggleItem(id: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item,
      ),
    );
  }

  function addItem() {
    const trimmedLabel = newItemLabel.trim();

    if (!trimmedLabel) {
      alert("Inserisci il nome dell'oggetto.");
      return;
    }

    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      label: trimmedLabel,
      category: newItemCategory,
      completed: false,
      custom: true,
    };

    setItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    setNewItemLabel("");
    setNewItemCategory("Altro");
    setShowForm(false);
  }

  function deleteItem(id: string) {
    const confirmed = window.confirm(
      "Vuoi eliminare questo elemento?",
    );

    if (!confirmed) {
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  }

  function resetChecklist() {
    const confirmed = window.confirm(
      "Vuoi deselezionare tutti gli elementi?",
    );

    if (!confirmed) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => ({
        ...item,
        completed: false,
      })),
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
        Preparazione
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Checklist valigia
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
        }}
      >
        Tutto quello che serve prima della partenza
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 21,
          borderRadius: 24,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.95), rgba(14,79,111,0.94))",
          boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                opacity: 0.85,
              }}
            >
              Preparazione completata
            </p>

            <strong
              style={{
                display: "block",
                marginTop: 6,
                fontSize: 38,
              }}
            >
              {progress}%
            </strong>
          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 22,
              }}
            >
              {completedCount}/{items.length}
            </strong>

            <span
              style={{
                display: "block",
                marginTop: 5,
                fontSize: 13,
                opacity: 0.85,
              }}
            >
              elementi pronti
            </span>
          </div>
        </div>

        <div
          style={{
            height: 9,
            marginTop: 18,
            overflow: "hidden",
            borderRadius: 999,
            background: "rgba(7,26,46,0.27)",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 999,
              background: theme.colors.secondary,
              transition: "width 300ms ease",
            }}
          />
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 10,
          marginTop: 17,
        }}
      >
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "14px 16px",
            border: 0,
            borderRadius: 17,
            background: theme.colors.primary,
            color: theme.colors.background,
            fontSize: 15,
            fontWeight: 850,
            cursor: "pointer",
          }}
        >
          {showForm ? "Chiudi" : "+ Aggiungi elemento"}
        </button>

        <button
          type="button"
          onClick={resetChecklist}
          style={{
            padding: "14px 16px",
            border: "1px solid rgba(255,255,255,0.13)",
            borderRadius: 17,
            background: theme.colors.card,
            color: theme.colors.text,
            fontWeight: 750,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      {showForm && (
        <section
          style={{
            marginTop: 15,
            padding: 19,
            borderRadius: 22,
            background: theme.colors.card,
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <label style={labelStyle}>
            Elemento
            <input
              value={newItemLabel}
              onChange={(event) =>
                setNewItemLabel(event.target.value)
              }
              placeholder="Es. Maschera da snorkeling"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Categoria
            <select
              value={newItemCategory}
              onChange={(event) =>
                setNewItemCategory(
                  event.target.value as ChecklistCategory,
                )
              }
              style={inputStyle}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={addItem}
            style={{
              width: "100%",
              marginTop: 20,
              padding: 14,
              border: 0,
              borderRadius: 16,
              background: theme.colors.secondary,
              color: theme.colors.background,
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            Salva elemento
          </button>
        </section>
      )}

      <div
        style={{
          display: "flex",
          gap: 9,
          marginTop: 22,
          paddingBottom: 5,
          overflowX: "auto",
        }}
      >
        {(["Tutti", ...categories] as const).map(
          (category) => {
            const isActive =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
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
                {category === "Tutti"
                  ? "✨"
                  : categoryIcons[category]}{" "}
                {category}
              </button>
            );
          },
        )}
      </div>

      <section
        style={{
          display: "grid",
          gap: 10,
          marginTop: 18,
        }}
      >
        {visibleItems.map((item) => (
          <article
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              padding: 15,
              borderRadius: 19,
              background: theme.colors.card,
              border: item.completed
                ? "1px solid rgba(17,197,191,0.28)"
                : "1px solid rgba(255,255,255,0.08)",
              opacity: item.completed ? 0.72 : 1,
            }}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-label={
                item.completed
                  ? "Segna come da preparare"
                  : "Segna come pronto"
              }
              style={{
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                border: item.completed
                  ? `2px solid ${theme.colors.primary}`
                  : "2px solid rgba(255,255,255,0.32)",
                borderRadius: 10,
                background: item.completed
                  ? theme.colors.primary
                  : "transparent",
                color: theme.colors.background,
                fontSize: 18,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {item.completed ? "✓" : ""}
            </button>

            <span
              style={{
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                borderRadius: 14,
                background: "rgba(17,197,191,0.14)",
                fontSize: 21,
              }}
            >
              {categoryIcons[item.category]}
            </span>

            <span style={{ flex: 1 }}>
              <strong
                style={{
                  display: "block",
                  fontSize: 15,
                  textDecoration: item.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {item.label}
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  color: theme.colors.textSoft,
                  fontSize: 12,
                }}
              >
                {item.category}
              </span>
            </span>

            {item.custom && (
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                style={{
                  padding: 6,
                  border: 0,
                  background: "transparent",
                  color: "#FFB4A8",
                  fontSize: 18,
                  cursor: "pointer",
                }}
                aria-label="Elimina elemento"
              >
                ×
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginTop: 15,
  fontWeight: 750,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: "13px 14px",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 14,
  outline: "none",
  background: "rgba(7,26,46,0.72)",
  color: "#FFFFFF",
  fontSize: 16,
};

export default PackingChecklist;