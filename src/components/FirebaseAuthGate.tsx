import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  auth,
  signInWithGoogle,
  signOutFromFirebase,
} from "../lib/firebase";
import { theme } from "../styles/theme";

type FirebaseAuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isOfflineMode: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const FirebaseAuthContext =
  createContext<FirebaseAuthContextValue | null>(
    null,
  );

type FirebaseAuthGateProps = {
  children: ReactNode;
};

export function useFirebaseAuth(): FirebaseAuthContextValue {
  const context = useContext(
    FirebaseAuthContext,
  );

  if (!context) {
    throw new Error(
      "useFirebaseAuth deve essere usato dentro FirebaseAuthGate.",
    );
  }

  return context;
}

function getLoginErrorMessage(
  error: unknown,
): string {
  if (!(error instanceof FirebaseError)) {
    return "Accesso non riuscito. Riprova.";
  }

  if (
    error.code ===
    "auth/popup-closed-by-user"
  ) {
    return "Accesso annullato prima del completamento.";
  }

  if (
    error.code === "auth/popup-blocked"
  ) {
    return "Il browser ha bloccato la finestra di accesso. Consenti i popup e riprova.";
  }

  if (
    error.code ===
    "auth/unauthorized-domain"
  ) {
    return "Questo dominio non è autorizzato in Firebase Authentication.";
  }

  if (
    error.code ===
    "auth/network-request-failed"
  ) {
    return "Connessione non disponibile. Puoi continuare offline e accedere più tardi.";
  }

  return "Accesso Google non riuscito. Riprova.";
}

function FirebaseAuthGate({
  children,
}: FirebaseAuthGateProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isCheckingAuth, setIsCheckingAuth] =
    useState(true);

  const [isSigningIn, setIsSigningIn] =
    useState(false);

  const [isOfflineMode, setIsOfflineMode] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsCheckingAuth(false);

        if (currentUser) {
          setIsOfflineMode(false);
          setErrorMessage("");
        }
      },
      () => {
        setIsCheckingAuth(false);
        setErrorMessage(
          "Non è stato possibile verificare l’accesso. Puoi continuare offline.",
        );
      },
    );

    return unsubscribe;
  }, []);

  async function handleSignIn() {
    setIsSigningIn(true);
    setErrorMessage("");

    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(
        getLoginErrorMessage(error),
      );
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleSignOut() {
    await signOutFromFirebase();
    setIsOfflineMode(false);
  }

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isOfflineMode,
      signIn: handleSignIn,
      signOut: handleSignOut,
    }),
    [user, isOfflineMode],
  );

  if (isCheckingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding:
            "calc(24px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom))",
          boxSizing: "border-box",
          background: `
            radial-gradient(
              circle at 85% 12%,
              rgba(195,168,255,0.18),
              transparent 30%
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
          textAlign: "center",
        }}
      >
        <div>
          <div
            aria-hidden="true"
            style={{
              width: 68,
              height: 68,
              display: "grid",
              placeItems: "center",
              margin: "0 auto",
              borderRadius: 22,
              background:
                "linear-gradient(135deg, rgba(195,168,255,0.28), rgba(17,197,191,0.20))",
              border:
                "1px solid rgba(255,255,255,0.12)",
              boxShadow:
                "0 18px 44px rgba(0,0,0,0.24)",
              fontSize: 30,
            }}
          >
            ✦
          </div>

          <h1
            style={{
              margin: "18px 0 0",
              fontSize: 25,
            }}
          >
            Ruta Maya
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              color: theme.colors.textSoft,
              fontSize: 14,
            }}
          >
            Verifica dell’accesso…
          </p>
        </div>
      </main>
    );
  }

  return (
    <FirebaseAuthContext.Provider
      value={contextValue}
    >
      {user || isOfflineMode ? (
        children
      ) : (
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding:
              "calc(30px + env(safe-area-inset-top)) 20px calc(30px + env(safe-area-inset-bottom))",
            boxSizing: "border-box",
            background: `
              radial-gradient(
                circle at 88% 8%,
                rgba(195,168,255,0.20),
                transparent 30%
              ),
              radial-gradient(
                circle at 8% 70%,
                rgba(17,197,191,0.14),
                transparent 30%
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
          <section
            style={{
              width: "100%",
              maxWidth: 430,
              padding: 24,
              boxSizing: "border-box",
              borderRadius: 30,
              background:
                "rgba(255,255,255,0.075)",
              border:
                "1px solid rgba(255,255,255,0.12)",
              boxShadow:
                "0 24px 70px rgba(0,0,0,0.28)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter:
                "blur(20px)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 70,
                height: 70,
                display: "grid",
                placeItems: "center",
                borderRadius: 23,
                background:
                  "linear-gradient(135deg, rgba(195,168,255,0.30), rgba(17,197,191,0.22))",
                border:
                  "1px solid rgba(255,255,255,0.13)",
                boxShadow:
                  "0 16px 36px rgba(0,0,0,0.24)",
                fontSize: 31,
              }}
            >
              🌴
            </div>

            <p
              style={{
                margin: "22px 0 0",
                color: theme.colors.primary,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              Ruta Maya 2026
            </p>

            <h1
              style={{
                margin: "7px 0 0",
                fontSize: 34,
                lineHeight: 1.05,
                letterSpacing: -1,
              }}
            >
              Entra nel viaggio
            </h1>

            <p
              style={{
                margin: "13px 0 0",
                color: theme.colors.textSoft,
                fontSize: 15,
                lineHeight: 1.55,
              }}
            >
              Accedi con Google per usare il
              Budget condiviso e sincronizzare
              le attività del gruppo.
            </p>

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn}
              style={{
                width: "100%",
                marginTop: 24,
                padding: "15px 18px",
                border: 0,
                borderRadius: 17,
                background:
                  isSigningIn
                    ? "rgba(255,255,255,0.16)"
                    : theme.colors.primary,
                boxShadow:
                  "0 14px 30px rgba(17,197,191,0.22)",
                color: "#062B35",
                fontSize: 15,
                fontWeight: 900,
                cursor:
                  isSigningIn
                    ? "wait"
                    : "pointer",
              }}
            >
              {isSigningIn
                ? "Accesso in corso…"
                : "Continua con Google"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOfflineMode(true);
                setErrorMessage("");
              }}
              style={{
                width: "100%",
                marginTop: 11,
                padding: "14px 18px",
                border:
                  "1px solid rgba(255,255,255,0.12)",
                borderRadius: 17,
                background:
                  "rgba(255,255,255,0.055)",
                color: theme.colors.text,
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Continua solo offline
            </button>

            {errorMessage && (
              <div
                role="alert"
                style={{
                  marginTop: 15,
                  padding: "12px 14px",
                  borderRadius: 15,
                  background:
                    "rgba(255,142,142,0.12)",
                  border:
                    "1px solid rgba(255,142,142,0.22)",
                  color: "#FFD0D0",
                  fontSize: 13,
                  lineHeight: 1.45,
                }}
              >
                {errorMessage}
              </div>
            )}

            <p
              style={{
                margin: "18px 0 0",
                color: theme.colors.textSoft,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              In modalità offline l’app resta
              utilizzabile, ma le nuove spese
              non vengono condivise finché non
              effettui l’accesso.
            </p>
          </section>
        </main>
      )}
    </FirebaseAuthContext.Provider>
  );
}

export default FirebaseAuthGate;