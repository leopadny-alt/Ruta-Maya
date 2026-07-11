import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { theme } from "../styles/theme";
import { getTravelerProfile } from "../utils/travelerProfile";

type Currency = "EUR" | "MXN";

type Expense = {
  id: string;
  description: string;
  /**
   * Importo normalizzato in euro, usato per tutti i calcoli.
   * Le vecchie spese già salvate restano compatibili.
   */
  amount: number;
  originalAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  paidBy: string;
  participants: string[];
  createdAt: string;
};

type Settlement = {
  from: string;
  to: string;
  amount: number;
};

const EXPENSES_STORAGE_KEY =
  "ruta-maya-expenses";

const PEOPLE_STORAGE_KEY =
  "ruta-maya-people";

const EXCHANGE_RATE_STORAGE_KEY =
  "ruta-maya-eur-mxn-rate";

const DISPLAY_CURRENCY_STORAGE_KEY =
  "ruta-maya-budget-display-currency";

const DEFAULT_EUR_MXN_RATE = 20;

const defaultPeople = [
  "Leonardo",
  "Amico 2",
  "Amico 3",
  "Amico 4",
  "Amico 5",
];

function formatCurrency(
  valueInEuro: number,
  currency: Currency,
  eurMxnRate: number,
) {
  const value =
    currency === "MXN"
      ? valueInEuro * eurMxnRate
      : valueInEuro;

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseDecimal(value: string) {
  return Number(
    value
      .trim()
      .replace(/\s/g, "")
      .replace(",", "."),
  );
}

function Budget() {
  const traveler = getTravelerProfile();

  const [people, setPeople] =
    useState<string[]>(defaultPeople);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [expenseCurrency, setExpenseCurrency] =
    useState<Currency>("EUR");

  const [displayCurrency, setDisplayCurrency] =
    useState<Currency>(() => {
      const savedCurrency = localStorage.getItem(
        DISPLAY_CURRENCY_STORAGE_KEY,
      );

      return savedCurrency === "MXN"
        ? "MXN"
        : "EUR";
    });

  const [eurMxnRate, setEurMxnRate] =
    useState<number>(() => {
      const savedRate = Number(
        localStorage.getItem(
          EXCHANGE_RATE_STORAGE_KEY,
        ),
      );

      return Number.isFinite(savedRate) &&
        savedRate > 0
        ? savedRate
        : DEFAULT_EUR_MXN_RATE;
    });

  const [rateInput, setRateInput] =
    useState(() =>
      String(
        Number(
          localStorage.getItem(
            EXCHANGE_RATE_STORAGE_KEY,
          ),
        ) || DEFAULT_EUR_MXN_RATE,
      ),
    );

  const [paidBy, setPaidBy] =
    useState(defaultPeople[0]);

  const [participants, setParticipants] =
    useState<string[]>(defaultPeople);

  const [
    showExpenseForm,
    setShowExpenseForm,
  ] = useState(false);

  const [
    showPeopleForm,
    setShowPeopleForm,
  ] = useState(false);

  useEffect(() => {
    const savedPeople =
      localStorage.getItem(
        PEOPLE_STORAGE_KEY,
      );

    const savedExpenses =
      localStorage.getItem(
        EXPENSES_STORAGE_KEY,
      );

    if (savedPeople) {
      try {
        const parsedPeople =
          JSON.parse(savedPeople);

        if (
          Array.isArray(parsedPeople) &&
          parsedPeople.length === 5
        ) {
          setPeople(parsedPeople);
          setPaidBy(parsedPeople[0]);
          setParticipants(parsedPeople);
        }
      } catch {
        localStorage.removeItem(
          PEOPLE_STORAGE_KEY,
        );
      }
    }

    if (savedExpenses) {
      try {
        const parsedExpenses =
          JSON.parse(savedExpenses);

        if (Array.isArray(parsedExpenses)) {
          setExpenses(parsedExpenses);
        }
      } catch {
        localStorage.removeItem(
          EXPENSES_STORAGE_KEY,
        );
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      EXPENSES_STORAGE_KEY,
      JSON.stringify(expenses),
    );
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(
      PEOPLE_STORAGE_KEY,
      JSON.stringify(people),
    );
  }, [people]);

  useEffect(() => {
    localStorage.setItem(
      EXCHANGE_RATE_STORAGE_KEY,
      String(eurMxnRate),
    );
  }, [eurMxnRate]);

  useEffect(() => {
    localStorage.setItem(
      DISPLAY_CURRENCY_STORAGE_KEY,
      displayCurrency,
    );
  }, [displayCurrency]);

  const totalExpenses = useMemo(
    () =>
      expenses.reduce(
        (total, expense) =>
          total + expense.amount,
        0,
      ),
    [expenses],
  );

  const averageExpense =
    expenses.length > 0
      ? totalExpenses / expenses.length
      : 0;

  const averagePerPerson =
    people.length > 0
      ? totalExpenses / people.length
      : 0;

  const displayMoney = (valueInEuro: number) =>
    formatCurrency(
      valueInEuro,
      displayCurrency,
      eurMxnRate,
    );

  const previewAmount = parseDecimal(amount);

  const previewAmountInEuro =
    Number.isFinite(previewAmount) &&
    previewAmount > 0
      ? expenseCurrency === "MXN"
        ? previewAmount / eurMxnRate
        : previewAmount
      : 0;

  const balances = useMemo(() => {
    const result: Record<
      string,
      number
    > = {};

    people.forEach((person) => {
      result[person] = 0;
    });

    expenses.forEach((expense) => {
      if (
        expense.participants.length === 0
      ) {
        return;
      }

      if (!(expense.paidBy in result)) {
        return;
      }

      const individualShare =
        expense.amount /
        expense.participants.length;

      result[expense.paidBy] +=
        expense.amount;

      expense.participants.forEach(
        (person) => {
          if (person in result) {
            result[person] -=
              individualShare;
          }
        },
      );
    });

    return result;
  }, [expenses, people]);

  const settlements = useMemo(
    () => calculateSettlements(balances),
    [balances],
  );

  const latestExpense = expenses[0];

  function toggleParticipant(
    person: string,
  ) {
    setParticipants(
      (currentParticipants) => {
        if (
          currentParticipants.includes(
            person,
          )
        ) {
          return currentParticipants.filter(
            (participant) =>
              participant !== person,
          );
        }

        return [
          ...currentParticipants,
          person,
        ];
      },
    );
  }

  function selectAllParticipants() {
    setParticipants(people);
  }

  function clearParticipants() {
    setParticipants([]);
  }

  function saveExchangeRate() {
    const numericRate = parseDecimal(rateInput);

    if (
      !Number.isFinite(numericRate) ||
      numericRate <= 0
    ) {
      alert(
        "Inserisci un cambio valido, ad esempio 20,00.",
      );
      setRateInput(String(eurMxnRate));
      return;
    }

    setEurMxnRate(numericRate);
    setRateInput(String(numericRate));
  }

  function addExpense() {
    const numericAmount =
      parseDecimal(amount);

    if (
      !description.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      participants.length === 0
    ) {
      alert(
        "Inserisci descrizione, importo e almeno un partecipante.",
      );

      return;
    }

    const amountInEuro =
      expenseCurrency === "MXN"
        ? numericAmount / eurMxnRate
        : numericAmount;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description:
        description.trim(),
      amount: amountInEuro,
      originalAmount: numericAmount,
      currency: expenseCurrency,
      exchangeRate: eurMxnRate,
      paidBy,
      participants,
      createdAt:
        new Date().toISOString(),
    };

    setExpenses(
      (currentExpenses) => [
        newExpense,
        ...currentExpenses,
      ],
    );

    setDescription("");
    setAmount("");
    setPaidBy(people[0]);
    setParticipants(people);
    setShowExpenseForm(false);
  }

  function deleteExpense(id: string) {
    const confirmed =
      window.confirm(
        "Vuoi eliminare questa spesa?",
      );

    if (!confirmed) {
      return;
    }

    setExpenses(
      (currentExpenses) =>
        currentExpenses.filter(
          (expense) =>
            expense.id !== id,
        ),
    );
  }

  function resetExpenses() {
    if (expenses.length === 0) {
      return;
    }

    const confirmed =
      window.confirm(
        "Vuoi eliminare tutte le spese inserite?",
      );

    if (!confirmed) {
      return;
    }

    setExpenses([]);
  }

  function updatePerson(
    index: number,
    value: string,
  ) {
    setPeople((currentPeople) =>
      currentPeople.map(
        (person, personIndex) =>
          personIndex === index
            ? value
            : person,
      ),
    );
  }

  function savePeople() {
    const cleanedPeople =
      people.map((person) =>
        person.trim(),
      );

    if (
      cleanedPeople.some(
        (person) => !person,
      )
    ) {
      alert(
        "Inserisci tutti e cinque i nomi.",
      );

      return;
    }

    if (
      new Set(cleanedPeople).size !==
      cleanedPeople.length
    ) {
      alert(
        "Ogni partecipante deve avere un nome diverso.",
      );

      return;
    }

    const oldPeople = [...people];

    setPeople(cleanedPeople);
    setPaidBy(cleanedPeople[0]);
    setParticipants(cleanedPeople);

    setExpenses(
      (currentExpenses) =>
        currentExpenses.map(
          (expense) => ({
            ...expense,
            paidBy:
              cleanedPeople[
                oldPeople.indexOf(
                  expense.paidBy,
                )
              ] ?? expense.paidBy,
            participants:
              expense.participants.map(
                (participant) =>
                  cleanedPeople[
                    oldPeople.indexOf(
                      participant,
                    )
                  ] ?? participant,
              ),
          }),
        ),
    );

    setShowPeopleForm(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding:
          "calc(23px + env(safe-area-inset-top)) 18px calc(165px + env(safe-area-inset-bottom))",
        background: `
          radial-gradient(
            circle at 92% 4%,
            rgba(244,213,141,0.12),
            transparent 27%
          ),
          radial-gradient(
            circle at 5% 42%,
            rgba(17,197,191,0.09),
            transparent 26%
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
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.6,
                textTransform:
                  "uppercase",
              }}
            >
              Spese condivise
            </p>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize: 34,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              Budget
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                maxWidth: 280,
                color:
                  theme.colors.textSoft,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {traveler
                ? `Conti e rimborsi del gruppo di ${traveler}.`
                : "Conti e rimborsi del gruppo."}
            </p>
          </div>

          <div
            style={{
              width: 55,
              height: 55,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(244,213,141,0.22), rgba(17,197,191,0.17))",
              border:
                "1px solid rgba(255,255,255,0.11)",
              boxShadow:
                "0 14px 32px rgba(0,0,0,0.22)",
              fontSize: 25,
            }}
          >
            💰
          </div>
        </div>
      </header>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: 24,
          padding: 23,
          borderRadius: 28,
          background:
            "linear-gradient(140deg, rgba(17,197,191,0.98), rgba(14,102,126,0.97) 50%, rgba(8,48,78,0.98))",
          border:
            "1px solid rgba(255,255,255,0.13)",
          boxShadow:
            "0 24px 52px rgba(0,0,0,0.28)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -55,
            right: -45,
            width: 170,
            height: 170,
            borderRadius: "50%",
            background:
              "rgba(255,255,255,0.10)",
          }}
        />

        <p
          style={{
            position: "relative",
            margin: 0,
            color:
              "rgba(255,255,255,0.76)",
            fontSize: 11,
            fontWeight: 850,
            letterSpacing: 0.9,
            textTransform: "uppercase",
          }}
        >
          Totale del viaggio
        </p>

        <strong
          style={{
            position: "relative",
            display: "block",
            marginTop: 10,
            fontSize: 43,
            lineHeight: 1,
            letterSpacing: -1.5,
          }}
        >
          {displayMoney(totalExpenses)}
        </strong>

        <p
          style={{
            position: "relative",
            margin: "9px 0 0",
            color:
              "rgba(255,255,255,0.70)",
            fontSize: 12,
          }}
        >
          {expenses.length}{" "}
          {expenses.length === 1
            ? "spesa registrata"
            : "spese registrate"}
        </p>

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 8,
            marginTop: 20,
          }}
        >
          <HeroInfo
            label="Media a persona"
            value={displayMoney(averagePerPerson)}
          />

          <HeroInfo
            label="Media per spesa"
            value={displayMoney(averageExpense)}
          />
        </div>
      </section>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 12,
          padding: 11,
          borderRadius: 17,
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <strong
            style={{
              display: "block",
              fontSize: 12,
            }}
          >
            Valuta visualizzata
          </strong>

          <span
            style={{
              display: "block",
              marginTop: 3,
              color: theme.colors.textSoft,
              fontSize: 9,
            }}
          >
            1 € = {eurMxnRate.toLocaleString("it-IT")} MXN
          </span>
        </div>

        <CurrencyToggle
          value={displayCurrency}
          onChange={setDisplayCurrency}
          compact
        />
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 9,
          marginTop: 15,
        }}
      >
        <button
          type="button"
          onClick={() => {
            setShowExpenseForm(
              (currentValue) =>
                !currentValue,
            );

            setShowPeopleForm(false);
          }}
          style={{
            ...actionButtonStyle,
            background:
              showExpenseForm
                ? "rgba(255,255,255,0.07)"
                : theme.colors.primary,
            color:
              showExpenseForm
                ? theme.colors.text
                : theme.colors.background,
            border: showExpenseForm
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid transparent",
          }}
        >
          {showExpenseForm
            ? "× Chiudi"
            : "+ Nuova spesa"}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowPeopleForm(
              (currentValue) =>
                !currentValue,
            );

            setShowExpenseForm(false);
          }}
          style={{
            ...actionButtonStyle,
            background:
              showPeopleForm
                ? "rgba(17,197,191,0.12)"
                : "rgba(110,212,255,0.10)",
            color:
              showPeopleForm
                ? theme.colors.primary
                : "#D8F4FF",
            border:
              showPeopleForm
                ? "1px solid rgba(17,197,191,0.24)"
                : "1px solid rgba(110,212,255,0.18)",
          }}
        >
          👥 {people.length} partecipanti
        </button>
      </div>

      {showPeopleForm && (
        <section
          style={{
            ...formSectionStyle,
            border:
              "1px solid rgba(110,212,255,0.17)",
          }}
        >
          <SectionHeading
            eyebrow="Gruppo"
            title="Partecipanti"
          />

          <p
            style={{
              margin: "8px 0 0",
              color:
                theme.colors.textSoft,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            Le modifiche verranno
            applicate anche alle spese già
            registrate.
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 17,
            }}
          >
            {people.map(
              (person, index) => (
                <label
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "37px 1fr",
                    alignItems: "center",
                    gap: 11,
                  }}
                >
                  <span
                    style={{
                      width: 37,
                      height: 37,
                      display: "grid",
                      placeItems:
                        "center",
                      borderRadius: 12,
                      background:
                        "rgba(110,212,255,0.12)",
                      color: "#6ED4FF",
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {index + 1}
                  </span>

                  <input
                    value={person}
                    onChange={(event) =>
                      updatePerson(
                        index,
                        event.target.value,
                      )
                    }
                    aria-label={`Partecipante ${
                      index + 1
                    }`}
                    style={inputStyle}
                  />
                </label>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={savePeople}
            style={{
              width: "100%",
              marginTop: 18,
              padding: 13,
              border: 0,
              borderRadius: 15,
              background:
                theme.colors.primary,
              color:
                theme.colors.background,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Salva partecipanti
          </button>
        </section>
      )}

      {showExpenseForm && (
        <section
          style={{
            ...formSectionStyle,
            border:
              "1px solid rgba(244,213,141,0.17)",
          }}
        >
          <SectionHeading
            eyebrow="Nuovo pagamento"
            title="Aggiungi una spesa"
          />

          <label style={labelStyle}>
            Descrizione

            <input
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              placeholder="Es. Cena a Holbox"
              style={inputStyle}
            />
          </label>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span
                style={{
                  color: theme.colors.textSoft,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Importo
              </span>

              <CurrencyToggle
                value={expenseCurrency}
                onChange={setExpenseCurrency}
                compact
              />
            </div>

            <div
              style={{
                position: "relative",
                marginTop: 8,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 14,
                  zIndex: 1,
                  transform: "translateY(-50%)",
                  color: theme.colors.secondary,
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                {expenseCurrency === "EUR"
                  ? "€"
                  : "$"}
              </span>

              <input
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                inputMode="decimal"
                placeholder={
                  expenseCurrency === "EUR"
                    ? "120,00"
                    : "2.400,00"
                }
                aria-label={`Importo in ${expenseCurrency}`}
                style={{
                  ...inputStyle,
                  paddingLeft: 42,
                  paddingTop: 16,
                  paddingBottom: 16,
                  fontSize: 24,
                  fontWeight: 900,
                }}
              />
            </div>

            {previewAmountInEuro > 0 && (
              <p
                style={{
                  margin: "8px 0 0",
                  color: theme.colors.textSoft,
                  fontSize: 10,
                  lineHeight: 1.45,
                }}
              >
                Equivale a{" "}
                <strong
                  style={{
                    color: theme.colors.primary,
                  }}
                >
                  {formatCurrency(
                    previewAmountInEuro,
                    expenseCurrency === "EUR"
                      ? "MXN"
                      : "EUR",
                    eurMxnRate,
                  )}
                </strong>
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "end",
                gap: 8,
                marginTop: 12,
                padding: 12,
                borderRadius: 14,
                background: "rgba(7,26,46,0.40)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <label
                style={{
                  color: theme.colors.textSoft,
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                Cambio usato: 1 € =

                <input
                  value={rateInput}
                  onChange={(event) =>
                    setRateInput(event.target.value)
                  }
                  onBlur={saveExchangeRate}
                  inputMode="decimal"
                  aria-label="Cambio euro peso messicano"
                  style={{
                    ...inputStyle,
                    marginTop: 6,
                    padding: "9px 10px",
                    fontSize: 13,
                  }}
                />
              </label>

              <span
                style={{
                  paddingBottom: 10,
                  color: theme.colors.secondary,
                  fontSize: 11,
                  fontWeight: 900,
                }}
              >
                MXN
              </span>
            </div>
          </div>

          <label style={labelStyle}>
            Pagata da

            <select
              value={paidBy}
              onChange={(event) =>
                setPaidBy(
                  event.target.value,
                )
              }
              style={inputStyle}
            >
              {people.map((person) => (
                <option
                  key={person}
                  value={person}
                >
                  {person}
                </option>
              ))}
            </select>
          </label>

          <div
            style={{
              marginTop: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: 12,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 850,
                }}
              >
                Dividi tra
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 7,
                }}
              >
                <SmallTextButton
                  label="✓ Tutti"
                  onClick={
                    selectAllParticipants
                  }
                />

                <SmallTextButton
                  label="○ Nessuno"
                  onClick={
                    clearParticipants
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 8,
                marginTop: 11,
              }}
            >
              {people.map((person) => {
                const isSelected =
                  participants.includes(
                    person,
                  );

                return (
                  <button
                    key={person}
                    type="button"
                    onClick={() =>
                      toggleParticipant(
                        person,
                      )
                    }
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 11,
                      padding: 12,
                      border:
                        isSelected
                          ? "1px solid rgba(17,197,191,0.27)"
                          : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 15,
                      background:
                        isSelected
                          ? "rgba(17,197,191,0.11)"
                          : "rgba(255,255,255,0.045)",
                      color:
                        theme.colors.text,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        display: "grid",
                        placeItems:
                          "center",
                        flexShrink: 0,
                        borderRadius: 9,
                        background:
                          isSelected
                            ? theme.colors
                                .primary
                            : "rgba(255,255,255,0.055)",
                        color:
                          isSelected
                            ? theme.colors
                                .background
                            : theme.colors
                                .textSoft,
                        fontSize: 12,
                        fontWeight: 950,
                      }}
                    >
                      {isSelected
                        ? "✓"
                        : ""}
                    </span>

                    <span
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontWeight: 750,
                      }}
                    >
                      {person}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={addExpense}
            style={{
              width: "100%",
              marginTop: 19,
              padding: 14,
              border: 0,
              borderRadius: 16,
              background:
                theme.colors.secondary,
              color:
                theme.colors.background,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Salva spesa
          </button>
        </section>
      )}

      <section
        style={{
          marginTop: 27,
        }}
      >
        <SectionHeading
          eyebrow="Rimborsi"
          title="Chi deve pagare chi"
          count={settlements.length}
        />

        <div
          style={{
            marginTop: 14,
          }}
        >
          {expenses.length === 0 ? (
            <EmptyCard
              icon="💸"
              title="Nessun rimborso"
              text="Inserisci una spesa per calcolare automaticamente i conti."
            />
          ) : settlements.length === 0 ? (
            <div
              style={{
                padding: 20,
                borderRadius: 22,
                background:
                  "rgba(17,197,191,0.11)",
                border:
                  "1px solid rgba(17,197,191,0.23)",
                color:
                  theme.colors.primary,
                textAlign: "center",
                fontWeight: 850,
              }}
            >
              ✓ Tutti i conti sono già in
              pari.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {settlements.map(
                (settlement, index) => (
                  <article
                    key={`${settlement.from}-${settlement.to}-${index}`}
                    style={{
                      padding: 16,
                      borderRadius: 21,
                      background:
                        "rgba(255,255,255,0.06)",
                      border:
                        "1px solid rgba(244,213,141,0.18)",
                      boxShadow:
                        "0 9px 24px rgba(0,0,0,0.10)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "45px 1fr auto",
                        alignItems:
                          "center",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          width: 45,
                          height: 45,
                          display: "grid",
                          placeItems:
                            "center",
                          borderRadius: 15,
                          background:
                            "rgba(244,213,141,0.13)",
                          fontSize: 21,
                        }}
                      >
                        💸
                      </span>

                      <div>
                        <strong
                          style={{
                            fontSize: 15,
                          }}
                        >
                          {
                            settlement.from
                          }
                        </strong>

                        <span
                          style={{
                            display: "block",
                            marginTop: 4,
                            color:
                              theme.colors
                                .textSoft,
                            fontSize: 11,
                            lineHeight: 1.4,
                          }}
                        >
                          paga{" "}
                          {settlement.to}
                        </span>
                      </div>

                      <strong
                        style={{
                          color:
                            theme.colors
                              .secondary,
                          fontSize: 17,
                        }}
                      >
                        {displayMoney(
                          settlement.amount,
                        )}
                      </strong>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      <section
        style={{
          marginTop: 28,
        }}
      >
        <SectionHeading
          eyebrow="Gruppo"
          title="Saldi personali"
          count={people.length}
        />

        <div
          style={{
            display: "grid",
            gap: 9,
            marginTop: 14,
          }}
        >
          {people.map((person) => {
            const balance =
              balances[person] ?? 0;

            const isPositive =
              balance > 0.005;

            const isNegative =
              balance < -0.005;

            const balanceColor =
              isPositive
                ? theme.colors.primary
                : isNegative
                  ? "#FF9D9D"
                  : theme.colors.textSoft;

            return (
              <article
                key={person}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr auto",
                  alignItems: "center",
                  gap: 12,
                  padding: 14,
                  borderRadius: 19,
                  background:
                    "rgba(255,255,255,0.055)",
                  border:
                    "1px solid rgba(255,255,255,0.075)",
                }}
              >

                <div>
                  <strong
                    style={{
                      fontSize: 14,
                    }}
                  >
                    {person}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      color:
                        theme.colors.textSoft,
                      fontSize: 10,
                    }}
                  >
                    {isPositive
                      ? "Deve ricevere"
                      : isNegative
                        ? "Deve pagare"
                        : "In pari"}
                  </span>
                </div>

                <strong
                  style={{
                    color: balanceColor,
                    fontSize: 15,
                  }}
                >
                  {isPositive ? "+" : ""}
                  {displayMoney(balance)}
                </strong>
              </article>
            );
          })}
        </div>
      </section>

      {latestExpense && (
        <section
          style={{
            marginTop: 25,
            padding: 18,
            borderRadius: 22,
            background:
              "linear-gradient(135deg, rgba(195,168,255,0.10), rgba(255,255,255,0.045))",
            border:
              "1px solid rgba(195,168,255,0.17)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#C3A8FF",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 0.9,
              textTransform: "uppercase",
            }}
          >
            Ultima spesa
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 14,
              marginTop: 9,
            }}
          >
            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: 17,
                }}
              >
                {latestExpense.description}
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 5,
                  color: theme.colors.textSoft,
                  fontSize: 11,
                  lineHeight: 1.45,
                }}
              >
                Pagata da {latestExpense.paidBy} ·{" "}
                {latestExpense.participants.length} partecipanti
              </span>

              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  color: theme.colors.textSoft,
                  fontSize: 10,
                }}
              >
                {new Date(
                  latestExpense.createdAt,
                ).toLocaleDateString("it-IT")}
              </span>

              {latestExpense.currency &&
                latestExpense.originalAmount !==
                  undefined && (
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    color: theme.colors.textSoft,
                    fontSize: 10,
                  }}
                >
                  Inserita come{" "}
                  {new Intl.NumberFormat("it-IT", {
                    style: "currency",
                    currency:
                      latestExpense.currency,
                  }).format(
                    latestExpense.originalAmount,
                  )}
                </span>
              )}
            </div>

            <strong
              style={{
                color: "#C3A8FF",
                fontSize: 18,
              }}
            >
              {displayMoney(latestExpense.amount)}
            </strong>
          </div>
        </section>
      )}

      <section
        style={{
          marginTop: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent:
              "space-between",
            gap: 14,
          }}
        >
          <SectionHeading
            eyebrow="Cronologia"
            title="Spese inserite"
            count={expenses.length}
          />

          {expenses.length > 0 && (
            <button
              type="button"
              onClick={resetExpenses}
              style={{
                padding: "7px 9px",
                border:
                  "1px solid rgba(255,142,142,0.20)",
                borderRadius: 12,
                background:
                  "rgba(255,142,142,0.055)",
                color: "#FFB4A8",
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Elimina tutte
            </button>
          )}
        </div>

        <div
          style={{
            marginTop: 14,
          }}
        >
          {expenses.length === 0 ? (
            <EmptyCard
              icon="🧾"
              title="Nessuna spesa"
              text="Le spese registrate durante il viaggio appariranno qui."
            />
          ) : (
            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {expenses.map(
                (expense) => (
                  <article
                    key={expense.id}
                    style={{
                      padding: 16,
                      borderRadius: 21,
                      background:
                        "rgba(255,255,255,0.06)",
                      border:
                        "1px solid rgba(255,255,255,0.075)",
                      boxShadow:
                        "0 9px 24px rgba(0,0,0,0.09)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "flex-start",
                        gap: 13,
                      }}
                    >
                      <span
                        style={{
                          width: 44,
                          height: 44,
                          display: "grid",
                          placeItems:
                            "center",
                          flexShrink: 0,
                          borderRadius: 14,
                          background:
                            "rgba(17,197,191,0.12)",
                          fontSize: 20,
                        }}
                      >
                        🧾
                      </span>

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <strong
                          style={{
                            display: "block",
                            fontSize: 15,
                            lineHeight: 1.35,
                          }}
                        >
                          {
                            expense.description
                          }
                        </strong>

                        <span
                          style={{
                            display: "block",
                            marginTop: 5,
                            color:
                              theme.colors
                                .textSoft,
                            fontSize: 11,
                          }}
                        >
                          Pagata da{" "}
                          {expense.paidBy}
                        </span>

                        <span
                          style={{
                            display: "block",
                            marginTop: 5,
                            color:
                              theme.colors
                                .textSoft,
                            fontSize: 10,
                            lineHeight: 1.4,
                          }}
                        >
                          {
                            expense
                              .participants
                              .length
                          }{" "}
                          partecipanti ·{" "}
                          {displayMoney(
                            expense.amount /
                              expense.participants.length,
                          )}{" "}
                          a testa ·{" "}
                          {new Date(
                            expense.createdAt,
                          ).toLocaleDateString(
                            "it-IT",
                          )}
                        </span>
                      </div>

                      <div
                        style={{
                          flexShrink: 0,
                          textAlign: "right",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {displayMoney(
                            expense.amount,
                          )}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            deleteExpense(
                              expense.id,
                            )
                          }
                          style={{
                            display: "block",
                            margin:
                              "10px 0 0 auto",
                            padding: 0,
                            border: 0,
                            background:
                              "transparent",
                            color:
                              "#FFB4A8",
                            fontSize: 10,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function calculateSettlements(
  balances: Record<string, number>,
): Settlement[] {
  const creditors = Object.entries(
    balances,
  )
    .filter(
      ([, balance]) =>
        balance > 0.005,
    )
    .map(([person, balance]) => ({
      person,
      amount: balance,
    }))
    .sort(
      (firstCreditor, secondCreditor) =>
        secondCreditor.amount -
        firstCreditor.amount,
    );

  const debtors = Object.entries(
    balances,
  )
    .filter(
      ([, balance]) =>
        balance < -0.005,
    )
    .map(([person, balance]) => ({
      person,
      amount: Math.abs(balance),
    }))
    .sort(
      (firstDebtor, secondDebtor) =>
        secondDebtor.amount -
        firstDebtor.amount,
    );

  const settlements: Settlement[] =
    [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (
    creditorIndex < creditors.length &&
    debtorIndex < debtors.length
  ) {
    const creditor =
      creditors[creditorIndex];

    const debtor =
      debtors[debtorIndex];

    const amount = Math.min(
      creditor.amount,
      debtor.amount,
    );

    if (amount > 0.005) {
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount:
          Math.round(amount * 100) /
          100,
      });
    }

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (
      creditor.amount <= 0.005
    ) {
      creditorIndex += 1;
    }

    if (debtor.amount <= 0.005) {
      debtorIndex += 1;
    }
  }

  return settlements;
}

function CurrencyToggle({
  value,
  onChange,
  compact = false,
}: {
  value: Currency;
  onChange: (currency: Currency) => void;
  compact?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Seleziona valuta"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 3,
        padding: 3,
        borderRadius: 12,
        background: "rgba(7,26,46,0.56)",
        border:
          "1px solid rgba(255,255,255,0.09)",
      }}
    >
      {(["EUR", "MXN"] as Currency[]).map(
        (currency) => {
          const isActive = value === currency;

          return (
            <button
              key={currency}
              type="button"
              onClick={() =>
                onChange(currency)
              }
              aria-pressed={isActive}
              style={{
                minWidth: compact ? 54 : 70,
                padding: compact
                  ? "7px 8px"
                  : "9px 11px",
                border: 0,
                borderRadius: 9,
                background: isActive
                  ? theme.colors.primary
                  : "transparent",
                color: isActive
                  ? theme.colors.background
                  : theme.colors.textSoft,
                fontSize: compact ? 10 : 11,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {currency === "EUR"
                ? "€ EUR"
                : "$ MXN"}
            </button>
          );
        },
      )}
    </div>
  );
}

function HeroInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 15,
        background:
          "rgba(7,26,46,0.23)",
      }}
    >
      <span
        style={{
          display: "block",
          color:
            "rgba(255,255,255,0.60)",
          fontSize: 10,
          fontWeight: 750,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 6,
          fontSize: 13,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count?: number;
}) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          color: theme.colors.primary,
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1.1,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginTop: 5,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            lineHeight: 1.2,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </h2>

        {typeof count === "number" && (
          <span
            style={{
              padding: "5px 7px",
              borderRadius: 999,
              background:
                "rgba(17,197,191,0.12)",
              color:
                theme.colors.primary,
              fontSize: 9,
              fontWeight: 900,
            }}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

function SmallTextButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 10px",
        border:
          "1px solid rgba(255,255,255,0.09)",
        borderRadius: 10,
        background:
          "rgba(255,255,255,0.045)",
        color:
          theme.colors.textSoft,
        fontSize: 9,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function EmptyCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 22,
        background:
          "rgba(255,255,255,0.055)",
        border:
          "1px solid rgba(255,255,255,0.075)",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontSize: 34,
        }}
      >
        {icon}
      </span>

      <h3
        style={{
          margin: "12px 0 0",
          fontSize: 18,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "7px 0 0",
          color:
            theme.colors.textSoft,
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </div>
  );
}

const actionButtonStyle = {
  minHeight: 49,
  padding: "12px 10px",
  borderRadius: 16,
  fontSize: 13,
  fontWeight: 900,
  cursor: "pointer",
};

const formSectionStyle = {
  marginTop: 16,
  padding: 19,
  borderRadius: 23,
  background:
    "rgba(255,255,255,0.06)",
  boxShadow:
    "0 14px 34px rgba(0,0,0,0.14)",
};

const labelStyle = {
  display: "block",
  marginTop: 16,
  color: theme.colors.textSoft,
  fontSize: 12,
  fontWeight: 800,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: "13px 14px",
  border:
    "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  outline: "none",
  background:
    "rgba(7,26,46,0.68)",
  color: theme.colors.text,
  fontSize: 15,
};

export default Budget;