import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type Currency = "EUR" | "MXN";

export type Expense = {
  id: string;
  description: string;
  /**
   * Importo normalizzato in euro, usato per tutti i calcoli.
   */
  amount: number;
  originalAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  paidBy: string;
  participants: string[];
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
};

export type NewExpense = Omit<
  Expense,
  "id" | "createdBy" | "createdByName"
>;

export type BudgetSyncStatus =
  | "local"
  | "loading"
  | "synced"
  | "syncing"
  | "offline"
  | "unauthorized"
  | "error";

const TRIP_ID = "ruta-maya-2026";

const EXPENSES_STORAGE_KEY =
  "ruta-maya-expenses";

const LEGACY_PERSON_NAMES: Record<
  string,
  string
> = {
  "Amico 2": "Eva",
  "Amico 3": "Stefano",
  "Amico 4": "Valentina",
  "Amico 5": "Maristella",
};

function normalizePersonName(
  person: string,
) {
  return (
    LEGACY_PERSON_NAMES[person] ??
    person
  );
}

function normalizeLocalExpense(
  expense: Expense,
): Expense {
  return {
    ...expense,
    paidBy: normalizePersonName(
      expense.paidBy,
    ),
    participants:
      expense.participants.map(
        normalizePersonName,
      ),
  };
}

function readLocalExpenses(): Expense[] {
  const savedExpenses =
    localStorage.getItem(
      EXPENSES_STORAGE_KEY,
    );

  if (!savedExpenses) {
    return [];
  }

  try {
    const parsedExpenses =
      JSON.parse(savedExpenses);

    return Array.isArray(parsedExpenses)
      ? parsedExpenses.map(
          (expense) =>
            normalizeLocalExpense(
              expense as Expense,
            ),
        )
      : [];
  } catch {
    localStorage.removeItem(
      EXPENSES_STORAGE_KEY,
    );

    return [];
  }
}

function getMigrationStorageKey(
  userId: string,
) {
  return `ruta-maya-shared-budget-migrated:${TRIP_ID}:${userId}`;
}

function normalizeExpense(
  expenseId: string,
  data: Record<string, unknown>,
): Expense {
  const participants =
    Array.isArray(data.participants)
      ? data.participants.filter(
          (
            participant,
          ): participant is string =>
            typeof participant === "string",
        )
      : [];

  const currency =
    data.currency === "MXN"
      ? "MXN"
      : "EUR";

  return {
    id: expenseId,
    description:
      typeof data.description === "string"
        ? data.description
        : "Spesa",
    amount:
      typeof data.amount === "number"
        ? data.amount
        : 0,
    originalAmount:
      typeof data.originalAmount ===
      "number"
        ? data.originalAmount
        : undefined,
    currency,
    exchangeRate:
      typeof data.exchangeRate === "number"
        ? data.exchangeRate
        : undefined,
    paidBy:
      typeof data.paidBy === "string"
        ? data.paidBy
        : "",
    participants,
    createdAt:
      typeof data.createdAt === "string"
        ? data.createdAt
        : new Date(0).toISOString(),
    createdBy:
      typeof data.createdBy === "string"
        ? data.createdBy
        : undefined,
    createdByName:
      typeof data.createdByName ===
      "string"
        ? data.createdByName
        : undefined,
  };
}

type UseSharedBudgetOptions = {
  user: User | null;
  creatorName: string;
};

export function useSharedBudget({
  user,
  creatorName,
}: UseSharedBudgetOptions) {
  const isSharedMode = Boolean(user);

  const [
    localExpenses,
    setLocalExpenses,
  ] = useState<Expense[]>(
    readLocalExpenses,
  );

  const [
    sharedExpenses,
    setSharedExpenses,
  ] = useState<Expense[]>([]);

  const [
    syncStatus,
    setSyncStatus,
  ] = useState<BudgetSyncStatus>(
    isSharedMode ? "loading" : "local",
  );

  const [
    syncError,
    setSyncError,
  ] = useState("");

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);

  const [
    isImporting,
    setIsImporting,
  ] = useState(false);

  const [
    hasImportedLocalExpenses,
    setHasImportedLocalExpenses,
  ] = useState(() =>
    user
      ? localStorage.getItem(
          getMigrationStorageKey(
            user.uid,
          ),
        ) === "true"
      : false,
  );

  useEffect(() => {
    localStorage.setItem(
      EXPENSES_STORAGE_KEY,
      JSON.stringify(localExpenses),
    );
  }, [localExpenses]);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);

      if (user) {
        setSyncStatus("syncing");
      }
    }

    function handleOffline() {
      setIsOnline(false);

      if (user) {
        setSyncStatus("offline");
      }
    }

    window.addEventListener(
      "online",
      handleOnline,
    );

    window.addEventListener(
      "offline",
      handleOffline,
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline,
      );

      window.removeEventListener(
        "offline",
        handleOffline,
      );
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSyncStatus("local");
      setSyncError("");
      return;
    }

    setSyncStatus(
      navigator.onLine
        ? "loading"
        : "offline",
    );

    const expensesQuery = query(
      collection(
        db,
        "trips",
        TRIP_ID,
        "expenses",
      ),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(
      expensesQuery,
      {
        includeMetadataChanges: true,
      },
      (snapshot) => {
        const nextExpenses =
          snapshot.docs.map(
            (expenseDocument) =>
              normalizeExpense(
                expenseDocument.id,
                expenseDocument.data(),
              ),
          );

        setSharedExpenses(nextExpenses);
        setSyncError("");

        if (
          snapshot.metadata
            .hasPendingWrites
        ) {
          setSyncStatus(
            navigator.onLine
              ? "syncing"
              : "offline",
          );

          return;
        }

        if (
          snapshot.metadata.fromCache &&
          !navigator.onLine
        ) {
          setSyncStatus("offline");
          return;
        }

        setSyncStatus("synced");
      },
      (error) => {
        if (
          error.code ===
          "permission-denied"
        ) {
          setSyncStatus(
            "unauthorized",
          );
          setSyncError(
            "Questo account Google non è ancora autorizzato per il viaggio.",
          );

          return;
        }

        setSyncStatus("error");
        setSyncError(
          "Non è stato possibile sincronizzare il Budget.",
        );
      },
    );
  }, [user]);

  useEffect(() => {
    if (!user) {
      setHasImportedLocalExpenses(
        false,
      );
      return;
    }

    setHasImportedLocalExpenses(
      localStorage.getItem(
        getMigrationStorageKey(
          user.uid,
        ),
      ) === "true",
    );
  }, [user]);

  const expenses = isSharedMode
    ? sharedExpenses
    : localExpenses;

  const localExpensesToImport =
    useMemo(
      () =>
        hasImportedLocalExpenses
          ? []
          : localExpenses,
      [
        hasImportedLocalExpenses,
        localExpenses,
      ],
    );

  function createSharedPayload(
    expense: NewExpense,
  ) {
    if (!user) {
      throw new Error(
        "Utente non autenticato.",
      );
    }

    return {
      description:
        expense.description,
      amount: expense.amount,
      originalAmount:
        expense.originalAmount ??
        expense.amount,
      currency:
        expense.currency ?? "EUR",
      exchangeRate:
        expense.exchangeRate ?? 1,
      paidBy: expense.paidBy,
      participants:
        expense.participants,
      createdAt: expense.createdAt,
      createdBy: user.uid,
      createdByName:
        creatorName ||
        user.displayName ||
        user.email ||
        "Partecipante",
      updatedAt: serverTimestamp(),
    };
  }

  function saveExpense(
    expense: NewExpense,
  ) {
    const expenseId =
      crypto.randomUUID();

    if (!user) {
      setLocalExpenses(
        (currentExpenses) => [
          {
            ...expense,
            id: expenseId,
          },
          ...currentExpenses,
        ],
      );

      return;
    }

    setSyncStatus(
      navigator.onLine
        ? "syncing"
        : "offline",
    );

    void setDoc(
      doc(
        db,
        "trips",
        TRIP_ID,
        "expenses",
        expenseId,
      ),
      createSharedPayload(expense),
    ).catch(() => {
      setSyncStatus("error");
      setSyncError(
        "La spesa non è stata salvata. Riprova.",
      );
    });
  }

  function removeExpense(
    expense: Expense,
  ) {
    if (!user) {
      setLocalExpenses(
        (currentExpenses) =>
          currentExpenses.filter(
            (currentExpense) =>
              currentExpense.id !==
              expense.id,
          ),
      );

      return;
    }

    if (
      expense.createdBy !== user.uid
    ) {
      setSyncError(
        "Puoi eliminare soltanto le spese che hai inserito tu.",
      );
      return;
    }

    setSyncStatus(
      navigator.onLine
        ? "syncing"
        : "offline",
    );

    void deleteDoc(
      doc(
        db,
        "trips",
        TRIP_ID,
        "expenses",
        expense.id,
      ),
    ).catch(() => {
      setSyncStatus("error");
      setSyncError(
        "La spesa non è stata eliminata. Riprova.",
      );
    });
  }

  function resetLocalExpenses() {
    if (user) {
      return;
    }

    setLocalExpenses([]);
  }

  async function importLocalExpenses() {
    if (
      !user ||
      localExpensesToImport.length ===
        0
    ) {
      return;
    }

    if (!navigator.onLine) {
      setSyncError(
        "Collegati a internet per importare le spese locali.",
      );
      return;
    }

    setIsImporting(true);
    setSyncStatus("syncing");
    setSyncError("");

    try {
      await Promise.all(
        localExpensesToImport.map(
          (expense) =>
            setDoc(
              doc(
                db,
                "trips",
                TRIP_ID,
                "expenses",
                expense.id,
              ),
              createSharedPayload({
                description:
                  expense.description,
                amount: expense.amount,
                originalAmount:
                  expense.originalAmount ??
                  expense.amount,
                currency:
                  expense.currency ??
                  "EUR",
                exchangeRate:
                  expense.exchangeRate ??
                  1,
                paidBy:
                  expense.paidBy,
                participants:
                  expense.participants,
                createdAt:
                  expense.createdAt,
              }),
            ),
        ),
      );

      localStorage.setItem(
        getMigrationStorageKey(
          user.uid,
        ),
        "true",
      );

      setHasImportedLocalExpenses(
        true,
      );
      setSyncStatus("synced");
    } catch {
      setSyncStatus("error");
      setSyncError(
        "Importazione non riuscita. Le spese locali non sono state cancellate.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  function canDeleteExpense(
    expense: Expense,
  ) {
    return (
      !user ||
      expense.createdBy === user.uid
    );
  }

  return {
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
  };
}