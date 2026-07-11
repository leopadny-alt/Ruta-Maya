import { useEffect, useMemo, useState } from "react";
import { theme } from "../styles/theme";

type Expense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  createdAt: string;
};

type Settlement = {
  from: string;
  to: string;
  amount: number;
};

const EXPENSES_STORAGE_KEY = "ruta-maya-expenses";
const PEOPLE_STORAGE_KEY = "ruta-maya-people";

const defaultPeople = [
  "Leonardo",
  "Amico 2",
  "Amico 3",
  "Amico 4",
  "Amico 5",
];

function Budget() {
  const [people, setPeople] = useState<string[]>(defaultPeople);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(defaultPeople[0]);
  const [participants, setParticipants] =
    useState<string[]>(defaultPeople);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showPeopleForm, setShowPeopleForm] = useState(false);

  useEffect(() => {
    const savedPeople = localStorage.getItem(PEOPLE_STORAGE_KEY);
    const savedExpenses = localStorage.getItem(
      EXPENSES_STORAGE_KEY,
    );

    if (savedPeople) {
      try {
        const parsedPeople = JSON.parse(savedPeople);

        if (
          Array.isArray(parsedPeople) &&
          parsedPeople.length === 5
        ) {
          setPeople(parsedPeople);
          setPaidBy(parsedPeople[0]);
          setParticipants(parsedPeople);
        }
      } catch {
        localStorage.removeItem(PEOPLE_STORAGE_KEY);
      }
    }

    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch {
        localStorage.removeItem(EXPENSES_STORAGE_KEY);
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

  const totalExpenses = useMemo(
    () =>
      expenses.reduce(
        (total, expense) => total + expense.amount,
        0,
      ),
    [expenses],
  );

  const balances = useMemo(() => {
    const result: Record<string, number> = {};

    people.forEach((person) => {
      result[person] = 0;
    });

    expenses.forEach((expense) => {
      if (expense.participants.length === 0) {
        return;
      }

      if (!(expense.paidBy in result)) {
        return;
      }

      const individualShare =
        expense.amount / expense.participants.length;

      result[expense.paidBy] += expense.amount;

      expense.participants.forEach((person) => {
        if (person in result) {
          result[person] -= individualShare;
        }
      });
    });

    return result;
  }, [expenses, people]);

  const settlements = useMemo(
    () => calculateSettlements(balances),
    [balances],
  );

  function toggleParticipant(person: string) {
    setParticipants((currentParticipants) => {
      if (currentParticipants.includes(person)) {
        return currentParticipants.filter(
          (participant) => participant !== person,
        );
      }

      return [...currentParticipants, person];
    });
  }

  function addExpense() {
    const numericAmount = Number(amount.replace(",", "."));

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

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: numericAmount,
      paidBy,
      participants,
      createdAt: new Date().toISOString(),
    };

    setExpenses((currentExpenses) => [
      newExpense,
      ...currentExpenses,
    ]);

    setDescription("");
    setAmount("");
    setPaidBy(people[0]);
    setParticipants(people);
    setShowExpenseForm(false);
  }

  function deleteExpense(id: string) {
    const confirmed = window.confirm(
      "Vuoi eliminare questa spesa?",
    );

    if (!confirmed) {
      return;
    }

    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id),
    );
  }

  function resetExpenses() {
    if (expenses.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Vuoi eliminare tutte le spese inserite?",
    );

    if (!confirmed) {
      return;
    }

    setExpenses([]);
  }

  function updatePerson(index: number, value: string) {
    setPeople((currentPeople) =>
      currentPeople.map((person, personIndex) =>
        personIndex === index ? value : person,
      ),
    );
  }

  function savePeople() {
    const cleanedPeople = people.map((person) => person.trim());

    if (cleanedPeople.some((person) => !person)) {
      alert("Inserisci tutti e cinque i nomi.");
      return;
    }

    if (new Set(cleanedPeople).size !== cleanedPeople.length) {
      alert("Ogni partecipante deve avere un nome diverso.");
      return;
    }

    const oldPeople = [...people];

    setPeople(cleanedPeople);
    setPaidBy(cleanedPeople[0]);
    setParticipants(cleanedPeople);

    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) => ({
        ...expense,
        paidBy:
          cleanedPeople[oldPeople.indexOf(expense.paidBy)] ??
          expense.paidBy,
        participants: expense.participants.map(
          (participant) =>
            cleanedPeople[oldPeople.indexOf(participant)] ??
            participant,
        ),
      })),
    );

    setShowPeopleForm(false);
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
        Spese condivise
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Budget
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
        }}
      >
        Registra chi paga e calcola automaticamente i rimborsi.
      </p>

      <section
        style={{
          marginTop: 25,
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
            fontSize: 14,
            opacity: 0.85,
          }}
        >
          Totale spese inserite
        </p>

        <strong
          style={{
            display: "block",
            marginTop: 7,
            fontSize: 40,
          }}
        >
          € {totalExpenses.toFixed(2)}
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            opacity: 0.84,
          }}
        >
          {expenses.length}{" "}
          {expenses.length === 1 ? "spesa" : "spese"}
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 17,
        }}
      >
        <button
          type="button"
          onClick={() =>
            setShowExpenseForm(!showExpenseForm)
          }
          style={primaryButtonStyle}
        >
          {showExpenseForm ? "Chiudi" : "+ Nuova spesa"}
        </button>

        <button
          type="button"
          onClick={() => setShowPeopleForm(!showPeopleForm)}
          style={secondaryButtonStyle}
        >
          👥 Partecipanti
        </button>
      </div>

      {showPeopleForm && (
        <section style={formSectionStyle}>
          <h2 style={{ margin: 0, fontSize: 20 }}>
            Nomi del gruppo
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color: theme.colors.textSoft,
              fontSize: 13,
            }}
          >
            Le modifiche verranno applicate anche alle spese già
            registrate.
          </p>

          {people.map((person, index) => (
            <label key={index} style={labelStyle}>
              Partecipante {index + 1}
              <input
                value={person}
                onChange={(event) =>
                  updatePerson(index, event.target.value)
                }
                style={inputStyle}
              />
            </label>
          ))}

          <button
            type="button"
            onClick={savePeople}
            style={{
              ...primaryButtonStyle,
              width: "100%",
              marginTop: 20,
            }}
          >
            Salva nomi
          </button>
        </section>
      )}

      {showExpenseForm && (
        <section style={formSectionStyle}>
          <label style={labelStyle}>
            Descrizione
            <input
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Es. Cena a Holbox"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Importo in euro
            <input
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              inputMode="decimal"
              placeholder="Es. 120"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Pagata da
            <select
              value={paidBy}
              onChange={(event) =>
                setPaidBy(event.target.value)
              }
              style={inputStyle}
            >
              {people.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </label>

          <div style={{ marginTop: 18 }}>
            <p
              style={{
                margin: "0 0 10px",
                fontWeight: 750,
              }}
            >
              Dividi tra
            </p>

            <div style={{ display: "grid", gap: 9 }}>
              {people.map((person) => {
                const isSelected =
                  participants.includes(person);

                return (
                  <label
                    key={person}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      padding: 12,
                      borderRadius: 14,
                      background: isSelected
                        ? "rgba(17,197,191,0.15)"
                        : "rgba(255,255,255,0.06)",
                      border: isSelected
                        ? "1px solid rgba(17,197,191,0.28)"
                        : "1px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        toggleParticipant(person)
                      }
                    />

                    {person}
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={addExpense}
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
            Salva spesa
          </button>
        </section>
      )}

      <section style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 22 }}>
          Chi deve pagare chi
        </h2>

        {expenses.length === 0 ? (
          <EmptyCard text="Inserisci una spesa per calcolare i rimborsi." />
        ) : settlements.length === 0 ? (
          <div
            style={{
              padding: 20,
              borderRadius: 21,
              background: "rgba(17,197,191,0.14)",
              border: "1px solid rgba(17,197,191,0.25)",
              color: theme.colors.primary,
              textAlign: "center",
              fontWeight: 800,
            }}
          >
            ✓ Tutti i conti sono già in pari.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 11 }}>
            {settlements.map((settlement, index) => (
              <article
                key={`${settlement.from}-${settlement.to}-${index}`}
                style={{
                  padding: 17,
                  borderRadius: 20,
                  background: theme.colors.card,
                  border: "1px solid rgba(244,213,141,0.22)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      width: 43,
                      height: 43,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      borderRadius: 14,
                      background: "rgba(244,213,141,0.15)",
                      fontSize: 20,
                    }}
                  >
                    💸
                  </span>

                  <div style={{ flex: 1 }}>
                    <strong>
                      {settlement.from}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: theme.colors.textSoft,
                        fontSize: 13,
                      }}
                    >
                      deve pagare {settlement.to}
                    </span>
                  </div>

                  <strong
                    style={{
                      color: theme.colors.secondary,
                      fontSize: 18,
                    }}
                  >
                    € {settlement.amount.toFixed(2)}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 22 }}>
          Saldi del gruppo
        </h2>

        <div style={{ display: "grid", gap: 10 }}>
          {people.map((person) => {
            const balance = balances[person] ?? 0;

            return (
              <article
                key={person}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 14,
                  padding: 16,
                  borderRadius: 18,
                  background: theme.colors.card,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontWeight: 750 }}>
                  {person}
                </span>

                <span
                  style={{
                    fontWeight: 850,
                    color:
                      balance > 0.005
                        ? theme.colors.primary
                        : balance < -0.005
                          ? "#FFB4A8"
                          : theme.colors.textSoft,
                  }}
                >
                  {balance > 0.005 ? "+" : ""}
                  {balance.toFixed(2)} €
                </span>
              </article>
            );
          })}
        </div>

        <p
          style={{
            margin: "12px 3px 0",
            color: theme.colors.textSoft,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          Un saldo positivo indica che la persona deve ricevere
          denaro; un saldo negativo indica che deve pagare.
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 22 }}>
            Spese inserite
          </h2>

          {expenses.length > 0 && (
            <button
              type="button"
              onClick={resetExpenses}
              style={{
                padding: "8px 11px",
                border: "1px solid rgba(255,180,168,0.28)",
                borderRadius: 12,
                background: "transparent",
                color: "#FFB4A8",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Elimina tutte
            </button>
          )}
        </div>

        {expenses.length === 0 ? (
          <EmptyCard text="Non hai ancora inserito nessuna spesa." />
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {expenses.map((expense) => (
              <article
                key={expense.id}
                style={{
                  padding: 18,
                  borderRadius: 20,
                  background: theme.colors.card,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>
                      {expense.description}
                    </h3>

                    <p
                      style={{
                        margin: "7px 0 0",
                        color: theme.colors.textSoft,
                        fontSize: 14,
                      }}
                    >
                      Pagata da {expense.paidBy}
                    </p>

                    <p
                      style={{
                        margin: "5px 0 0",
                        color: theme.colors.textSoft,
                        fontSize: 13,
                        lineHeight: 1.45,
                      }}
                    >
                      Divisa tra:{" "}
                      {expense.participants.join(", ")}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <strong style={{ fontSize: 18 }}>
                      € {expense.amount.toFixed(2)}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        deleteExpense(expense.id)
                      }
                      style={{
                        display: "block",
                        margin: "11px 0 0 auto",
                        border: 0,
                        background: "transparent",
                        color: "#FFB4A8",
                        cursor: "pointer",
                      }}
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function calculateSettlements(
  balances: Record<string, number>,
): Settlement[] {
  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > 0.005)
    .map(([person, balance]) => ({
      person,
      amount: balance,
    }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < -0.005)
    .map(([person, balance]) => ({
      person,
      amount: Math.abs(balance),
    }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (
    creditorIndex < creditors.length &&
    debtorIndex < debtors.length
  ) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const amount = Math.min(
      creditor.amount,
      debtor.amount,
    );

    if (amount > 0.005) {
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: Math.round(amount * 100) / 100,
      });
    }

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount <= 0.005) {
      creditorIndex += 1;
    }

    if (debtor.amount <= 0.005) {
      debtorIndex += 1;
    }
  }

  return settlements;
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 20,
        background: theme.colors.card,
        color: theme.colors.textSoft,
        lineHeight: 1.5,
      }}
    >
      {text}
    </div>
  );
}

const formSectionStyle = {
  marginTop: 16,
  padding: 20,
  borderRadius: 24,
  background: theme.colors.card,
  border: "1px solid rgba(255,255,255,0.10)",
};

const labelStyle = {
  display: "block",
  marginTop: 16,
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

const primaryButtonStyle = {
  padding: "14px 16px",
  border: 0,
  borderRadius: 17,
  background: theme.colors.primary,
  color: theme.colors.background,
  fontSize: 15,
  fontWeight: 850,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "14px 16px",
  border: "1px solid rgba(255,255,255,0.13)",
  borderRadius: 17,
  background: theme.colors.card,
  color: theme.colors.text,
  fontSize: 15,
  fontWeight: 750,
  cursor: "pointer",
};

export default Budget;