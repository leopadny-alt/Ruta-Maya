import { useMemo, useState } from "react";
import { theme } from "../styles/theme";

type PhraseCategory =
  | "Essenziali"
  | "Ristorante"
  | "Alloggio"
  | "Trasporti"
  | "Acquisti"
  | "Emergenze";

type Phrase = {
  id: number;
  category: PhraseCategory;
  italian: string;
  spanish: string;
};

const phrases: Phrase[] = [
  {
    id: 1,
    category: "Essenziali",
    italian: "Buongiorno",
    spanish: "Buenos días",
  },
  {
    id: 2,
    category: "Essenziali",
    italian: "Buonasera",
    spanish: "Buenas tardes",
  },
  {
    id: 3,
    category: "Essenziali",
    italian: "Per favore",
    spanish: "Por favor",
  },
  {
    id: 4,
    category: "Essenziali",
    italian: "Grazie",
    spanish: "Gracias",
  },
  {
    id: 5,
    category: "Essenziali",
    italian: "Mi scusi",
    spanish: "Disculpe",
  },
  {
    id: 6,
    category: "Essenziali",
    italian: "Non capisco",
    spanish: "No entiendo",
  },
  {
    id: 7,
    category: "Essenziali",
    italian: "Parla inglese?",
    spanish: "¿Habla inglés?",
  },
  {
    id: 8,
    category: "Essenziali",
    italian: "Può parlare più lentamente?",
    spanish: "¿Puede hablar más despacio?",
  },

  {
    id: 9,
    category: "Ristorante",
    italian: "Un tavolo per cinque, per favore",
    spanish: "Una mesa para cinco, por favor",
  },
  {
    id: 10,
    category: "Ristorante",
    italian: "Possiamo vedere il menu?",
    spanish: "¿Podemos ver el menú?",
  },
  {
    id: 11,
    category: "Ristorante",
    italian: "Che cosa ci consiglia?",
    spanish: "¿Qué nos recomienda?",
  },
  {
    id: 12,
    category: "Ristorante",
    italian: "Senza piccante, per favore",
    spanish: "Sin picante, por favor",
  },
  {
    id: 13,
    category: "Ristorante",
    italian: "Sono allergico a...",
    spanish: "Soy alérgico a...",
  },
  {
    id: 14,
    category: "Ristorante",
    italian: "Acqua in bottiglia, per favore",
    spanish: "Agua embotellada, por favor",
  },
  {
    id: 15,
    category: "Ristorante",
    italian: "Il conto, per favore",
    spanish: "La cuenta, por favor",
  },
  {
    id: 16,
    category: "Ristorante",
    italian: "Possiamo pagare separatamente?",
    spanish: "¿Podemos pagar por separado?",
  },

  {
    id: 17,
    category: "Alloggio",
    italian: "Abbiamo una prenotazione",
    spanish: "Tenemos una reservación",
  },
  {
    id: 18,
    category: "Alloggio",
    italian: "A che ora è il check-in?",
    spanish: "¿A qué hora es el check-in?",
  },
  {
    id: 19,
    category: "Alloggio",
    italian: "A che ora è il check-out?",
    spanish: "¿A qué hora es el check-out?",
  },
  {
    id: 20,
    category: "Alloggio",
    italian: "Qual è la password del Wi-Fi?",
    spanish: "¿Cuál es la contraseña del Wi-Fi?",
  },
  {
    id: 21,
    category: "Alloggio",
    italian: "Non c'è acqua calda",
    spanish: "No hay agua caliente",
  },
  {
    id: 22,
    category: "Alloggio",
    italian: "Possiamo lasciare qui i bagagli?",
    spanish: "¿Podemos dejar aquí el equipaje?",
  },

  {
    id: 23,
    category: "Trasporti",
    italian: "Dov'è il terminal dei traghetti?",
    spanish: "¿Dónde está la terminal de ferris?",
  },
  {
    id: 24,
    category: "Trasporti",
    italian: "Quanto costa il biglietto?",
    spanish: "¿Cuánto cuesta el boleto?",
  },
  {
    id: 25,
    category: "Trasporti",
    italian: "A che ora parte?",
    spanish: "¿A qué hora sale?",
  },
  {
    id: 26,
    category: "Trasporti",
    italian: "Dove possiamo parcheggiare?",
    spanish: "¿Dónde podemos estacionar?",
  },
  {
    id: 27,
    category: "Trasporti",
    italian: "Il pieno, per favore",
    spanish: "Lleno, por favor",
  },
  {
    id: 28,
    category: "Trasporti",
    italian: "Questa strada è sicura?",
    spanish: "¿Esta carretera es segura?",
  },
  {
    id: 29,
    category: "Trasporti",
    italian: "Ci porti a questo indirizzo",
    spanish: "Llévenos a esta dirección",
  },

  {
    id: 30,
    category: "Acquisti",
    italian: "Quanto costa?",
    spanish: "¿Cuánto cuesta?",
  },
  {
    id: 31,
    category: "Acquisti",
    italian: "Accettate carte di credito?",
    spanish: "¿Aceptan tarjetas de crédito?",
  },
  {
    id: 32,
    category: "Acquisti",
    italian: "Posso pagare in contanti?",
    spanish: "¿Puedo pagar en efectivo?",
  },
  {
    id: 33,
    category: "Acquisti",
    italian: "Avete una taglia più grande?",
    spanish: "¿Tiene una talla más grande?",
  },
  {
    id: 34,
    category: "Acquisti",
    italian: "È troppo caro",
    spanish: "Es demasiado caro",
  },

  {
    id: 35,
    category: "Emergenze",
    italian: "Abbiamo bisogno di aiuto",
    spanish: "Necesitamos ayuda",
  },
  {
    id: 36,
    category: "Emergenze",
    italian: "Chiami un'ambulanza",
    spanish: "Llame a una ambulancia",
  },
  {
    id: 37,
    category: "Emergenze",
    italian: "Dov'è l'ospedale più vicino?",
    spanish: "¿Dónde está el hospital más cercano?",
  },
  {
    id: 38,
    category: "Emergenze",
    italian: "Ho perso il passaporto",
    spanish: "He perdido mi pasaporte",
  },
  {
    id: 39,
    category: "Emergenze",
    italian: "Mi hanno rubato il portafoglio",
    spanish: "Me robaron la cartera",
  },
  {
    id: 40,
    category: "Emergenze",
    italian: "Ho bisogno di un medico",
    spanish: "Necesito un médico",
  },
  {
    id: 41,
    category: "Emergenze",
    italian: "Non mi sento bene",
    spanish: "No me siento bien",
  },
];

const categories: PhraseCategory[] = [
  "Essenziali",
  "Ristorante",
  "Alloggio",
  "Trasporti",
  "Acquisti",
  "Emergenze",
];

const categoryIcons: Record<PhraseCategory, string> = {
  Essenziali: "💬",
  Ristorante: "🍽️",
  Alloggio: "🏨",
  Trasporti: "🚗",
  Acquisti: "🛍️",
  Emergenze: "🆘",
};

function Phrasebook() {
  const [selectedCategory, setSelectedCategory] = useState<
    PhraseCategory | "Tutte"
  >("Tutte");

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const visiblePhrases = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLocaleLowerCase("it");

    return phrases.filter((phrase) => {
      const matchesCategory =
        selectedCategory === "Tutte" ||
        phrase.category === selectedCategory;

      const matchesSearch =
        !normalizedQuery ||
        phrase.italian
          .toLocaleLowerCase("it")
          .includes(normalizedQuery) ||
        phrase.spanish
          .toLocaleLowerCase("es")
          .includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  async function copyPhrase(phrase: Phrase) {
    try {
      await navigator.clipboard.writeText(phrase.spanish);
      setCopiedId(phrase.id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch {
      window.prompt(
        "Copia manualmente questa frase:",
        phrase.spanish,
      );
    }
  }

  function speakPhrase(phrase: Phrase) {
    if (!("speechSynthesis" in window)) {
      alert(
        "La lettura vocale non è disponibile su questo dispositivo.",
      );
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      phrase.spanish,
    );

    utterance.lang = "es-MX";
    utterance.rate = 0.85;

    window.speechSynthesis.speak(utterance);
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
        Comunicazione
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Frasario spagnolo
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Frasi utili da mostrare, copiare o ascoltare durante il
        viaggio.
      </p>

      <input
        type="search"
        value={searchQuery}
        onChange={(event) =>
          setSearchQuery(event.target.value)
        }
        placeholder="Cerca una frase..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: 22,
          padding: "14px 16px",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 17,
          outline: "none",
          background: theme.colors.card,
          color: theme.colors.text,
          fontSize: 16,
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 9,
          marginTop: 15,
          paddingBottom: 5,
          overflowX: "auto",
        }}
      >
        {(["Tutte", ...categories] as const).map(
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
                {category === "Tutte"
                  ? "✨"
                  : categoryIcons[category]}{" "}
                {category}
              </button>
            );
          },
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 21 }}>
          Frasi disponibili
        </h2>

        <span
          style={{
            padding: "7px 10px",
            borderRadius: 999,
            background: "rgba(17,197,191,0.16)",
            color: theme.colors.primary,
            fontSize: 13,
            fontWeight: 850,
          }}
        >
          {visiblePhrases.length}
        </span>
      </div>

      <section
        style={{
          display: "grid",
          gap: 12,
          marginTop: 14,
        }}
      >
        {visiblePhrases.map((phrase) => (
          <article
            key={phrase.id}
            style={{
              padding: 18,
              borderRadius: 21,
              background: theme.colors.card,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 13,
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  borderRadius: 15,
                  background: "rgba(17,197,191,0.15)",
                  fontSize: 21,
                }}
              >
                {categoryIcons[phrase.category]}
              </span>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    color: theme.colors.textSoft,
                    fontSize: 14,
                    lineHeight: 1.4,
                  }}
                >
                  {phrase.italian}
                </p>

                <h2
                  style={{
                    margin: "7px 0 0",
                    color: theme.colors.secondary,
                    fontSize: 20,
                    lineHeight: 1.3,
                  }}
                >
                  {phrase.spanish}
                </h2>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 9,
                marginTop: 16,
              }}
            >
              <button
                type="button"
                onClick={() => speakPhrase(phrase)}
                style={{
                  padding: "12px 13px",
                  border:
                    "1px solid rgba(255,255,255,0.13)",
                  borderRadius: 15,
                  background: "rgba(255,255,255,0.07)",
                  color: theme.colors.text,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                🔊 Ascolta
              </button>

              <button
                type="button"
                onClick={() => copyPhrase(phrase)}
                style={{
                  padding: "12px 13px",
                  border: 0,
                  borderRadius: 15,
                  background:
                    copiedId === phrase.id
                      ? theme.colors.secondary
                      : theme.colors.primary,
                  color: theme.colors.background,
                  fontWeight: 850,
                  cursor: "pointer",
                }}
              >
                {copiedId === phrase.id
                  ? "✓ Copiata"
                  : "Copia"}
              </button>
            </div>
          </article>
        ))}

        {visiblePhrases.length === 0 && (
          <div
            style={{
              padding: 22,
              borderRadius: 20,
              background: theme.colors.card,
              color: theme.colors.textSoft,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Nessuna frase corrisponde alla ricerca.
          </div>
        )}
      </section>

      <p
        style={{
          margin: "22px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        La pronuncia vocale dipende dalle voci installate sul
        dispositivo. Il testo del frasario resta disponibile
        offline.
      </p>
    </main>
  );
}

export default Phrasebook;