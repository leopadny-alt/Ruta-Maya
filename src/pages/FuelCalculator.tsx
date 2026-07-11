import { useEffect, useMemo, useState } from "react";
import { theme } from "../styles/theme";

const STORAGE_KEY = "ruta-maya-fuel-calculator";
const EXCHANGE_RATE_KEY = "ruta-maya-exchange-rate";

type SavedFuelData = {
  distance: string;
  consumption: string;
  fuelPrice: string;
  peopleCount: string;
};

const defaultData: SavedFuelData = {
  distance: "1000",
  consumption: "7",
  fuelPrice: "24",
  peopleCount: "5",
};

function parseNumber(value: string) {
  return Number(value.replace(",", "."));
}

function FuelCalculator() {
  const [distance, setDistance] = useState(
    defaultData.distance,
  );

  const [consumption, setConsumption] = useState(
    defaultData.consumption,
  );

  const [fuelPrice, setFuelPrice] = useState(
    defaultData.fuelPrice,
  );

  const [peopleCount, setPeopleCount] = useState(
    defaultData.peopleCount,
  );

  const [exchangeRate, setExchangeRate] = useState(20);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedRate = localStorage.getItem(EXCHANGE_RATE_KEY);

    if (savedData) {
      try {
        const parsedData = JSON.parse(
          savedData,
        ) as SavedFuelData;

        setDistance(parsedData.distance);
        setConsumption(parsedData.consumption);
        setFuelPrice(parsedData.fuelPrice);
        setPeopleCount(parsedData.peopleCount);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (savedRate) {
      const numericRate = parseNumber(savedRate);

      if (
        Number.isFinite(numericRate) &&
        numericRate > 0
      ) {
        setExchangeRate(numericRate);
      }
    }
  }, []);

  useEffect(() => {
    const data: SavedFuelData = {
      distance,
      consumption,
      fuelPrice,
      peopleCount,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data),
    );
  }, [
    consumption,
    distance,
    fuelPrice,
    peopleCount,
  ]);

  const calculation = useMemo(() => {
    const numericDistance = parseNumber(distance);
    const numericConsumption = parseNumber(consumption);
    const numericFuelPrice = parseNumber(fuelPrice);
    const numericPeopleCount = parseNumber(peopleCount);

    const hasValidValues =
      Number.isFinite(numericDistance) &&
      Number.isFinite(numericConsumption) &&
      Number.isFinite(numericFuelPrice) &&
      Number.isFinite(numericPeopleCount) &&
      numericDistance >= 0 &&
      numericConsumption > 0 &&
      numericFuelPrice > 0 &&
      numericPeopleCount > 0;

    if (!hasValidValues) {
      return {
        liters: 0,
        totalMxn: 0,
        totalEur: 0,
        perPersonMxn: 0,
        perPersonEur: 0,
      };
    }

    const liters =
      (numericDistance * numericConsumption) / 100;

    const totalMxn = liters * numericFuelPrice;
    const totalEur = totalMxn / exchangeRate;

    return {
      liters,
      totalMxn,
      totalEur,
      perPersonMxn: totalMxn / numericPeopleCount,
      perPersonEur: totalEur / numericPeopleCount,
    };
  }, [
    consumption,
    distance,
    exchangeRate,
    fuelPrice,
    peopleCount,
  ]);

  function resetCalculator() {
    const confirmed = window.confirm(
      "Vuoi ripristinare i valori iniziali?",
    );

    if (!confirmed) {
      return;
    }

    setDistance(defaultData.distance);
    setConsumption(defaultData.consumption);
    setFuelPrice(defaultData.fuelPrice);
    setPeopleCount(defaultData.peopleCount);
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
        Road trip
      </p>

      <h1
        style={{
          margin: "8px 0 6px",
          fontSize: 34,
        }}
      >
        Carburante
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Stima il consumo e dividi il costo tra i cinque
        partecipanti.
      </p>

      <section
        style={{
          marginTop: 24,
          padding: 22,
          borderRadius: 26,
          background:
            "linear-gradient(135deg, rgba(17,197,191,0.96), rgba(14,79,111,0.94))",
          boxShadow:
            "0 18px 40px rgba(0,0,0,0.24)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            opacity: 0.86,
          }}
        >
          Costo stimato totale
        </p>

        <strong
          style={{
            display: "block",
            marginTop: 9,
            fontSize: 39,
            lineHeight: 1.05,
          }}
        >
          € {calculation.totalEur.toFixed(2)}
        </strong>

        <p
          style={{
            margin: "9px 0 0",
            opacity: 0.86,
          }}
        >
          $ {calculation.totalMxn.toFixed(2)} MXN
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 20,
          }}
        >
          <ResultStat
            label="Litri necessari"
            value={`${calculation.liters.toFixed(1)} L`}
          />

          <ResultStat
            label="Costo a persona"
            value={`€ ${calculation.perPersonEur.toFixed(
              2,
            )}`}
          />
        </div>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 20,
          borderRadius: 24,
          background: theme.colors.card,
          border:
            "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <NumberInput
          label="Distanza totale"
          value={distance}
          onChange={setDistance}
          suffix="km"
          placeholder="1000"
        />

        <NumberInput
          label="Consumo dell’auto"
          value={consumption}
          onChange={setConsumption}
          suffix="L/100 km"
          placeholder="7"
        />

        <NumberInput
          label="Prezzo carburante"
          value={fuelPrice}
          onChange={setFuelPrice}
          suffix="MXN/L"
          placeholder="24"
        />

        <NumberInput
          label="Numero di partecipanti"
          value={peopleCount}
          onChange={setPeopleCount}
          suffix="persone"
          placeholder="5"
        />

        <button
          type="button"
          onClick={resetCalculator}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 13,
            border:
              "1px solid rgba(255,255,255,0.13)",
            borderRadius: 15,
            background: "rgba(255,255,255,0.07)",
            color: theme.colors.text,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Ripristina valori
        </button>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 20,
          borderRadius: 23,
          background: theme.colors.card,
          border:
            "1px solid rgba(244,213,141,0.20)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
          }}
        >
          Riepilogo per il gruppo
        </h2>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 16,
          }}
        >
          <SummaryRow
            label="Costo totale in pesos"
            value={`$ ${calculation.totalMxn.toFixed(
              2,
            )}`}
          />

          <SummaryRow
            label="Costo totale in euro"
            value={`€ ${calculation.totalEur.toFixed(
              2,
            )}`}
          />

          <SummaryRow
            label="Quota a persona in pesos"
            value={`$ ${calculation.perPersonMxn.toFixed(
              2,
            )}`}
          />

          <SummaryRow
            label="Quota a persona in euro"
            value={`€ ${calculation.perPersonEur.toFixed(
              2,
            )}`}
          />
        </div>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 19,
          borderRadius: 22,
          background: "rgba(255,255,255,0.07)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 19,
          }}
        >
          Cambio utilizzato
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            color: theme.colors.textSoft,
            lineHeight: 1.5,
          }}
        >
          1 EUR = {exchangeRate.toFixed(2)} MXN
        </p>

        <p
          style={{
            margin: "7px 0 0",
            color: theme.colors.textSoft,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          Il valore viene letto dalla sezione Cambio valuta. Per
          aggiornarlo, modifica e salva il tasso in quella pagina.
        </p>
      </section>

      <p
        style={{
          margin: "22px 4px 0",
          color: theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        Il risultato è una stima. Il consumo reale può cambiare
        in base a traffico, aria condizionata, percorso e tipo di
        veicolo.
      </p>
    </main>
  );
}

type NumberInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
  placeholder: string;
};

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  placeholder,
}: NumberInputProps) {
  return (
    <label
      style={{
        display: "block",
        marginTop: 16,
        fontWeight: 750,
      }}
    >
      {label}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 9,
          marginTop: 8,
        }}
      >
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          inputMode="decimal"
          placeholder={placeholder}
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
            minWidth: 64,
            display: "grid",
            placeItems: "center",
            padding: "0 12px",
            borderRadius: 14,
            background: "rgba(17,197,191,0.14)",
            color: theme.colors.primary,
            fontSize: 12,
            fontWeight: 850,
            textAlign: "center",
          }}
        >
          {suffix}
        </span>
      </div>
    </label>
  );
}

function ResultStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 13,
        borderRadius: 15,
        background: "rgba(7,26,46,0.25)",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 11,
          opacity: 0.78,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 6,
          fontSize: 16,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
        padding: 13,
        borderRadius: 15,
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          color: theme.colors.textSoft,
          fontSize: 13,
        }}
      >
        {label}
      </span>

      <strong>{value}</strong>
    </div>
  );
}

export default FuelCalculator;