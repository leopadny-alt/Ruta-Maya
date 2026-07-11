import { useEffect, useMemo, useState } from "react";
import { theme } from "../styles/theme";

const STORAGE_KEY = "ruta-maya-exchange-rate";
const DEFAULT_RATE = 20;

type CurrencyDirection = "eur-to-mxn" | "mxn-to-eur";

function CurrencyConverter() {
  const [direction, setDirection] =
    useState<CurrencyDirection>("eur-to-mxn");

  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] =
    useState(DEFAULT_RATE.toString());

  useEffect(() => {
    const savedRate = localStorage.getItem(STORAGE_KEY);

    if (savedRate) {
      setExchangeRate(savedRate);
    }
  }, []);

  const numericRate = Number(exchangeRate.replace(",", "."));
  const numericAmount = Number(amount.replace(",", "."));

  const result = useMemo(() => {
    if (
      !Number.isFinite(numericAmount) ||
      !Number.isFinite(numericRate) ||
      numericAmount < 0 ||
      numericRate <= 0
    ) {
      return 0;
    }

    if (direction === "eur-to-mxn") {
      return numericAmount * numericRate;
    }

    return numericAmount / numericRate;
  }, [direction, numericAmount, numericRate]);

  function saveRate() {
    if (!Number.isFinite(numericRate) || numericRate <= 0) {
      alert("Inserisci un cambio valido.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, exchangeRate);
    alert("Cambio salvato sul dispositivo.");
  }

  function invertDirection() {
    setDirection((currentDirection) =>
      currentDirection === "eur-to-mxn"
        ? "mxn-to-eur"
        : "eur-to-mxn",
    );

    setAmount("");
  }

  const inputCurrency =
    direction === "eur-to-mxn" ? "EUR" : "MXN";

  const outputCurrency =
    direction === "eur-to-mxn" ? "MXN" : "EUR";

  const inputSymbol =
    direction === "eur-to-mxn" ? "€" : "$";

  const outputSymbol =
    direction === "eur-to-mxn" ? "$" : "€";

  const formattedResult = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(result);

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
        Pagamenti
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Cambio valuta
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Converti velocemente euro e pesos messicani.
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 22,
          borderRadius: 26,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Risultato
        </p>

        <strong
          style={{
            display: "block",
            marginTop: 10,
            fontSize: 42,
            lineHeight: 1.05,
          }}
        >
          {outputSymbol} {formattedResult}
        </strong>

        <p
          style={{
            margin: "9px 0 0",
            opacity: 0.85,
          }}
        >
          {amount || "0"} {inputCurrency} → {outputCurrency}
        </p>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 20,
          borderRadius: 24,
          background: theme.colors.card,
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: 750,
          }}
        >
          Importo in {inputCurrency}

          <div
            style={{
              position: "relative",
              marginTop: 9,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: 16,
                transform: "translateY(-50%)",
                color: theme.colors.primary,
                fontSize: 20,
                fontWeight: 850,
              }}
            >
              {inputSymbol}
            </span>

            <input
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              inputMode="decimal"
              placeholder="0,00"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px 16px 15px 44px",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                borderRadius: 16,
                outline: "none",
                background: "rgba(7,26,46,0.72)",
                color: theme.colors.text,
                fontSize: 19,
                fontWeight: 750,
              }}
            />
          </div>
        </label>

        <button
          type="button"
          onClick={invertDirection}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "13px 15px",
            border:
              "1px solid rgba(255,255,255,0.13)",
            borderRadius: 16,
            background: "rgba(255,255,255,0.07)",
            color: theme.colors.text,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          ⇄ Inverti: {inputCurrency} → {outputCurrency}
        </button>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 20,
          borderRadius: 24,
          background: theme.colors.card,
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20 }}>
          Tasso di cambio
        </h2>

        <p
          style={{
            margin: "7px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Indica quanti pesos messicani corrispondono a 1 euro.
        </p>

        <label
          style={{
            display: "block",
            marginTop: 16,
            fontWeight: 750,
          }}
        >
          1 EUR =

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 10,
              marginTop: 8,
            }}
          >
            <input
              value={exchangeRate}
              onChange={(event) =>
                setExchangeRate(event.target.value)
              }
              inputMode="decimal"
              placeholder="20,00"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "13px 14px",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                borderRadius: 14,
                outline: "none",
                background: "rgba(7,26,46,0.72)",
                color: theme.colors.text,
                fontSize: 16,
              }}
            />

            <span
              style={{
                display: "grid",
                placeItems: "center",
                padding: "0 14px",
                borderRadius: 14,
                background:
                  "rgba(17,197,191,0.15)",
                color: theme.colors.primary,
                fontWeight: 850,
              }}
            >
              MXN
            </span>
          </div>
        </label>

        <button
          type="button"
          onClick={saveRate}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 13,
            border: 0,
            borderRadius: 15,
            background: theme.colors.secondary,
            color: theme.colors.background,
            fontWeight: 850,
            cursor: "pointer",
          }}
        >
          Salva cambio
        </button>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 19,
          borderRadius: 22,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 19 }}>
          Conversioni rapide
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 14,
          }}
        >
          {[10, 20, 50, 100].map((value) => {
            const quickResult =
              direction === "eur-to-mxn"
                ? value * numericRate
                : value / numericRate;

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setAmount(value.toString())
                }
                style={{
                  padding: 14,
                  border:
                    "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 16,
                  background: theme.colors.card,
                  color: theme.colors.text,
                  cursor: "pointer",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: 16,
                  }}
                >
                  {inputSymbol} {value}
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: 5,
                    color: theme.colors.textSoft,
                    fontSize: 12,
                  }}
                >
                  {outputSymbol}{" "}
                  {Number.isFinite(quickResult)
                    ? quickResult.toFixed(2)
                    : "0.00"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <p
        style={{
          margin: "22px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        Il valore è indicativo. Banche, carte e uffici di
        cambio possono applicare commissioni o tassi diversi.
      </p>
    </main>
  );
}

export default CurrencyConverter;