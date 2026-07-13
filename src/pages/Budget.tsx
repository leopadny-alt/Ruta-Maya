import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useFirebaseAuth } from "../components/FirebaseAuthGate";
import {
  type BudgetSyncStatus,
  type Currency,
  type Expense,
  useSharedBudget,
} from "../hooks/useSharedBudget";
import { theme } from "../styles/theme";
import { getTravelerProfile } from "../utils/travelerProfile";

type Settlement = {
  from: string;
  to: string;
  amount: number;
};

const EXCHANGE_RATE_STORAGE_KEY =
  "ruta-maya-eur-mxn-rate";

const DISPLAY_CURRENCY_STORAGE_KEY =
  "ruta-maya-budget-display-currency";

const DEFAULT_EUR_MXN_RATE = 20;

const defaultPeople = [
  "Leonardo",
  "Eva",
  "Stefano",
  "Valentina",
  "Maristella",
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

  const {
    user,
    isAuthenticated,
  } = useFirebaseAuth();

  const creatorName =
    traveler ||
    user?.displayName ||
    user?.email ||
    "Partecipante";

  const {
    expenses,
    isSharedMode,
    syncStatus,
    syncError,
    isOnline,
    isImporting,
    localExpensesToImport,
    saveExpense,
    removeExpense,
    resetLocalExpenses,
    importLocalExpenses,
    canDeleteExpense,
  } = useSharedBudget({
    user:
      isAuthenticated && user
        ? user
        : null,
    creatorName,
  });

  const people = defaultPeople;

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

    saveExpense({
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
    });

    setDescription("");
    setAmount("");
    setPaidBy(people[0]);
    setParticipants(people);
    setShowExpenseForm(false);
  }

  function deleteExpense(
    expense: Expense,
  ) {
    const confirmed =
      window.confirm(
        "Vuoi eliminare questa spesa?",
      );

    if (!confirmed) {
      return;
    }

    removeExpense(expense);
  }

  function resetExpenses() {
    if (
      isSharedMode ||
      expenses.length === 0
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Vuoi eliminare tutte le spese salvate su questo telefono?",
      );

    if (!confirmed) {
      return;
    }

    resetLocalExpenses();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding:
          "calc(21px + env(safe-area-inset-top)) 18px calc(168px + env(safe-area-inset-bottom))",
        background: `
          radial-gradient(
            circle at 92% 4%,
            rgba(246,217,144,0.11),
            transparent 27%
          ),
          radial-gradient(
            circle at 5% 42%,
            rgba(32,206,198,0.08),
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
                fontSize:
                  theme.typography.eyebrow,
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
                fontSize:
                  theme.typography.display,
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
                fontSize:
                  theme.typography.body,
                lineHeight: 1.5,
              }}
            >
              {traveler
                ? `Conti e rimborsi del gruppo di ${traveler}.`
                : "Conti e rimborsi del gruppo."}
            </p>
          </div>

          <div
            aria-hidden="true"
            style={{
              width: 54,
              height: 54,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(246,217,144,0.20), rgba(32,206,198,0.14))",
              border:
                `1px solid ${theme.colors.borderStrong}`,
              boxShadow:
                theme.shadows.card,
              color:
                theme.colors.secondary,
            }}
          >
            <WalletIcon size={26} />
          </div>
        </div>
      </header>

      <BudgetSyncCard
        isSharedMode={isSharedMode}
        status={syncStatus}
        error={syncError}
        isOnline={isOnline}
        accountLabel={
          user?.email ??
          user?.displayName ??
          creatorName
        }
      />

      {isSharedMode &&
        localExpensesToImport.length > 0 && (
          <section
            style={{
              marginTop: 12,
              padding: 15,
              borderRadius: 18,
              background:
                "rgba(195,168,255,0.10)",
              border:
                "1px solid rgba(195,168,255,0.20)",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 13,
              }}
            >
              Importa le spese già presenti
            </strong>

            <p
              style={{
                margin: "6px 0 0",
                color:
                  theme.colors.textSoft,
                fontSize: 11,
                lineHeight: 1.5,
              }}
            >
              Hai{" "}
              {localExpensesToImport.length}{" "}
              {localExpensesToImport.length === 1
                ? "spesa locale"
                : "spese locali"}{" "}
              salvate su questo telefono.
              Puoi copiarle nel Budget
              condiviso senza cancellare il
              backup locale.
            </p>

            <button
              type="button"
              onClick={() =>
                void importLocalExpenses()
              }
              disabled={
                isImporting || !isOnline
              }
              style={{
                width: "100%",
                marginTop: 12,
                padding: 12,
                border: 0,
                borderRadius: 14,
                background:
                  isImporting || !isOnline
                    ? "rgba(255,255,255,0.12)"
                    : "#C3A8FF",
                color:
                  isImporting || !isOnline
                    ? theme.colors.textSoft
                    : theme.colors.background,
                fontWeight: 900,
                cursor:
                  isImporting || !isOnline
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isImporting
                ? "Importazione in corso…"
                : isOnline
                  ? "Importa nel Budget condiviso"
                  : "Connettiti per importare"}
            </button>
          </section>
        )}


      <section
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: 20,
          padding: 20,
          borderRadius:
            theme.radius.xl,
          background:
            "linear-gradient(140deg, rgba(32,206,198,0.98), rgba(14,102,126,0.97) 50%, rgba(8,48,78,0.99))",
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
            fontSize:
              "clamp(36px, 11vw, 44px)",
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
          display: "grid",
          gridTemplateColumns:
            "38px 1fr auto",
          alignItems: "center",
          gap: 11,
          marginTop: 12,
          padding: 11,
          borderRadius: 17,
          background:
            theme.colors.cardSoft,
          border:
            `1px solid ${theme.colors.border}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            borderRadius: 12,
            background:
              theme.colors.secondarySoft,
            color:
              theme.colors.secondary,
          }}
        >
          <ExchangeIcon />
        </span>

        <div style={{ minWidth: 0 }}>
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
              color:
                theme.colors.textSoft,
              fontSize: 9,
            }}
          >
            1 € ={" "}
            {eurMxnRate.toLocaleString(
              "it-IT",
            )}{" "}
            MXN
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
          {showExpenseForm ? (
            <>
              <CloseIcon />
              Chiudi
            </>
          ) : (
            <>
              <PlusIcon />
              Nuova spesa
            </>
          )}
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
          <UsersIcon />
          {people.length} partecipanti
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
            Il gruppo condiviso è composto da
            Leonardo, Eva, Stefano, Valentina e
            Maristella.
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 17,
            }}
          >
            {people.map(
              (person) => (
                <div
                  key={person}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "37px 1fr",
                    alignItems: "center",
                    gap: 11,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 37,
                      height: 37,
                      display: "grid",
                      placeItems:
                        "center",
                      borderRadius: 12,
                      background:
                        "rgba(116,215,255,0.12)",
                      color:
                        theme.colors.info,
                      fontSize: 12,
                      fontWeight: 950,
                    }}
                  >
                    {person
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>

                  <div
                    style={{
                      padding: "13px 14px",
                      border:
                        "1px solid rgba(255,255,255,0.09)",
                      borderRadius: 14,
                      background:
                        "rgba(7,26,46,0.45)",
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    {person}
                  </div>
                </div>
              ),
            )}
          </div>
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
              icon={<TransferIcon size={28} />}
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
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <CheckCircleIcon />
                Tutti i conti sono già in pari.
              </span>
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
                        aria-hidden="true"
                        style={{
                          width: 45,
                          height: 45,
                          display: "grid",
                          placeItems:
                            "center",
                          borderRadius: 15,
                          background:
                            theme.colors.secondarySoft,
                          color:
                            theme.colors.secondary,
                        }}
                      >
                        <TransferIcon />
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
          marginTop: 24,
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
            gap: 7,
            marginTop: 12,
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
                  ? theme.colors.danger
                  : theme.colors.textSoft;

            const statusText =
              isPositive
                ? "Deve ricevere"
                : isNegative
                  ? "Deve pagare"
                  : "In pari";

            return (
              <article
                key={person}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "38px minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 16,
                  background:
                    "rgba(255,255,255,0.048)",
                  border: `1px solid ${
                    isPositive
                      ? "rgba(32,206,198,0.16)"
                      : isNegative
                        ? "rgba(255,155,155,0.16)"
                        : theme.colors.border
                  }`,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 38,
                    height: 38,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 13,
                    background:
                      isPositive
                        ? theme.colors.primarySoft
                        : isNegative
                          ? "rgba(255,155,155,0.12)"
                          : "rgba(116,215,255,0.09)",
                    color: balanceColor,
                    fontSize: 13,
                    fontWeight: 950,
                    letterSpacing: 0.2,
                  }}
                >
                  {getPersonInitials(person)}
                </span>

                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      overflow: "hidden",
                      fontSize: 13,
                      lineHeight: 1.25,
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {person}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 3,
                      color: balanceColor,
                      fontSize: 9,
                      fontWeight: 750,
                    }}
                  >
                    {statusText}
                  </span>
                </div>

                <strong
                  style={{
                    color: balanceColor,
                    fontSize: 14,
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
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
              display: "flex",
              alignItems: "center",
              gap: 7,
              margin: 0,
              color: "#C7AEFF",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 0.9,
              textTransform: "uppercase",
            }}
          >
            <ReceiptIcon size={15} />
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
                {latestExpense.createdByName
                  ? ` · Inserita da ${latestExpense.createdByName}`
                  : ""}
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
                color: "#C7AEFF",
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

          {!isSharedMode &&
            expenses.length > 0 && (
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
              icon={<ReceiptIcon size={28} />}
              title="Nessuna spesa"
              text={isSharedMode ? "Le spese inserite dal gruppo appariranno qui in tempo reale." : "Le spese registrate su questo telefono appariranno qui."}
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
                        aria-hidden="true"
                        style={{
                          width: 44,
                          height: 44,
                          display: "grid",
                          placeItems:
                            "center",
                          flexShrink: 0,
                          borderRadius: 14,
                          background:
                            theme.colors.primarySoft,
                          color:
                            theme.colors.primary,
                        }}
                      >
                        <ReceiptIcon />
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
                          {expense.createdByName
                            ? ` · Inserita da ${expense.createdByName}`
                            : ""}
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

                        {canDeleteExpense(
                          expense,
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              deleteExpense(
                                expense,
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
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              <TrashIcon size={13} />
                              Elimina
                            </span>
                          </button>
                        )}
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

function BudgetSyncCard({
  isSharedMode,
  status,
  error,
  isOnline,
  accountLabel,
}: {
  isSharedMode: boolean;
  status: BudgetSyncStatus;
  error: string;
  isOnline: boolean;
  accountLabel: string;
}) {
  const configuration = (() => {
    if (!isSharedMode) {
      return {
        icon: <PhoneIcon />,
        title: "Solo su questo telefono",
        text:
          "Le spese restano locali finché non accedi con Google.",
        color: "#F4D58D",
      };
    }

    if (
      status === "unauthorized"
    ) {
      return {
        icon: <LockIcon />,
        title: "Account non autorizzato",
        text:
          error ||
          "Aggiungi questo account tra i membri del viaggio.",
        color: "#FF9D9D",
      };
    }

    if (status === "error") {
      return {
        icon: <AlertIcon />,
        title: "Errore di sincronizzazione",
        text:
          error ||
          "Controlla la connessione e riprova.",
        color: "#FF9D9D",
      };
    }

    if (
      status === "offline" ||
      !isOnline
    ) {
      return {
        icon: <CloudIcon />,
        title: "Offline — modifiche in coda",
        text:
          "Le spese restano disponibili e verranno sincronizzate al ritorno della connessione.",
        color: "#F4D58D",
      };
    }

    if (
      status === "loading" ||
      status === "syncing"
    ) {
      return {
        icon: <SyncIcon />,
        title:
          status === "loading"
            ? "Caricamento Budget condiviso"
            : "Sincronizzazione in corso",
        text:
          "Stiamo allineando le spese con gli altri dispositivi.",
        color: "#6ED4FF",
      };
    }

    return {
      icon: <CheckCircleIcon />,
      title: "Budget condiviso sincronizzato",
      text: accountLabel,
      color: theme.colors.primary,
    };
  })();

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns:
          "42px 1fr",
        alignItems: "center",
        gap: 12,
        marginTop: 18,
        padding: 14,
        borderRadius: 18,
        background:
          `${configuration.color}12`,
        border:
          `1px solid ${configuration.color}24`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 42,
          height: 42,
          display: "grid",
          placeItems: "center",
          borderRadius: 14,
          background:
            `${configuration.color}17`,
          color:
            configuration.color,
        }}
      >
        {configuration.icon}
      </span>

      <div>
        <strong
          style={{
            display: "block",
            color: configuration.color,
            fontSize: 12,
          }}
        >
          {configuration.title}
        </strong>

        <span
          style={{
            display: "block",
            marginTop: 4,
            color:
              theme.colors.textSoft,
            fontSize: 10,
            lineHeight: 1.45,
            wordBreak: "break-word",
          }}
        >
          {configuration.text}
        </span>
      </div>
    </section>
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

function getPersonInitials(
  name: string,
) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toLocaleUpperCase("it");
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toLocaleUpperCase("it");
}

function EmptyCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "46px minmax(0, 1fr)",
        alignItems: "center",
        gap: 13,
        padding: 15,
        borderRadius: 18,
        background:
          "rgba(255,255,255,0.050)",
        border:
          `1px solid ${theme.colors.border}`,
        textAlign: "left",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 46,
          height: 46,
          display: "grid",
          placeItems: "center",
          borderRadius: 15,
          background:
            theme.colors.primarySoft,
          color:
            theme.colors.primary,
        }}
      >
        {icon}
      </span>

      <div
        style={{
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            color:
              theme.colors.textSoft,
            fontSize: 11,
            lineHeight: 1.45,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

const actionButtonStyle = {
  minHeight: 49,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
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
    theme.colors.cardSoft,
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
    `1px solid ${theme.colors.borderStrong}`,
  borderRadius: 14,
  outline: "none",
  background:
    "rgba(5,24,39,0.72)",
  color: theme.colors.text,
  fontSize: 15,
};

type IconProps = {
  size?: number;
};

function IconBase({
  children,
  size = 18,
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

function ExchangeIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="M7 7h12" />
      <path d="m16 4 3 3-3 3" />
      <path d="M17 17H5" />
      <path d="m8 20-3-3 3-3" />
    </IconBase>
  );
}

function PlusIcon() {
  return (
    <IconBase size={16}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}

function CloseIcon() {
  return (
    <IconBase size={16}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </IconBase>
  );
}

function UsersIcon() {
  return (
    <IconBase size={17}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  );
}

function TransferIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="3" />
      <path d="M9 9h6" />
      <path d="m13 7 2 2-2 2" />
      <path d="M15 15H9" />
      <path d="m11 13-2 2 2 2" />
    </IconBase>
  );
}

function ReceiptIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </IconBase>
  );
}

function TrashIcon(
  props: IconProps,
) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m6 7 1 14h10l1-14" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconBase>
  );
}

function PhoneIcon() {
  return (
    <IconBase>
      <rect
        x="7"
        y="2.5"
        width="10"
        height="19"
        rx="2"
      />
      <path d="M10 5h4" />
      <path d="M11.5 18.5h1" />
    </IconBase>
  );
}

function LockIcon() {
  return (
    <IconBase>
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </IconBase>
  );
}

function AlertIcon() {
  return (
    <IconBase>
      <path d="M12 3 2.5 20h19Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </IconBase>
  );
}

function CloudIcon() {
  return (
    <IconBase>
      <path d="M6 18h11a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 8.2 4.9 4.9 0 0 0 6 18Z" />
      <path d="M9 14h6" />
    </IconBase>
  );
}

function SyncIcon() {
  return (
    <IconBase>
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M6.1 8a7 7 0 0 1 11.6-2L20 8" />
      <path d="M17.9 16a7 7 0 0 1-11.6 2L4 16" />
    </IconBase>
  );
}

function CheckCircleIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </IconBase>
  );
}

export default Budget;