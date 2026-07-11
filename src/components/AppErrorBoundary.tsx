import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError(
    error: Error,
  ): AppErrorBoundaryState {
    return {
      hasError: true,
      errorMessage:
        error.message ||
        "Si è verificato un errore imprevisto.",
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo,
  ) {
    console.error(
      "Errore Ruta Maya:",
      error,
      errorInfo,
    );
  }

  private reloadApp = () => {
    window.location.reload();
  };

  private returnHome = () => {
    window.location.href =
      import.meta.env.BASE_URL;
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          padding:
            "calc(28px + env(safe-area-inset-top)) 22px calc(28px + env(safe-area-inset-bottom))",
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,142,142,0.12), transparent 30%), linear-gradient(180deg, #071A2E, #04111F)",
          color: "#FFFFFF",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: 390,
            padding: 24,
            borderRadius: 26,
            background:
              "rgba(255,255,255,0.075)",
            border:
              "1px solid rgba(255,142,142,0.22)",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.32)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              width: 66,
              height: 66,
              display: "grid",
              placeItems: "center",
              margin: "0 auto",
              borderRadius: 22,
              background:
                "rgba(255,142,142,0.13)",
              fontSize: 32,
            }}
          >
            🛠️
          </span>

          <p
            style={{
              margin: "20px 0 0",
              color: "#FFB4A8",
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: 1.1,
              textTransform: "uppercase",
            }}
          >
            Recupero applicazione
          </p>

          <h1
            style={{
              margin: "9px 0 0",
              fontSize: 28,
              lineHeight: 1.2,
            }}
          >
            Ruta Maya ha incontrato un problema
          </h1>

          <p
            style={{
              margin: "13px 0 0",
              color:
                "rgba(255,255,255,0.66)",
              fontSize: 14,
              lineHeight: 1.55,
            }}
          >
            I dati salvati sul dispositivo non sono
            stati cancellati. Prova prima a ricaricare
            l’app.
          </p>

          {this.state.errorMessage && (
            <div
              style={{
                marginTop: 17,
                padding: 13,
                borderRadius: 15,
                background:
                  "rgba(255,142,142,0.08)",
                color: "#FFB4A8",
                fontSize: 12,
                lineHeight: 1.45,
                overflowWrap: "anywhere",
              }}
            >
              {this.state.errorMessage}
            </div>
          )}

          <button
            type="button"
            onClick={this.reloadApp}
            style={{
              width: "100%",
              marginTop: 19,
              padding: 14,
              border: 0,
              borderRadius: 16,
              background: "#11C5BF",
              color: "#071A2E",
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            Ricarica Ruta Maya
          </button>

          <button
            type="button"
            onClick={this.returnHome}
            style={{
              width: "100%",
              marginTop: 10,
              padding: 13,
              border:
                "1px solid rgba(255,255,255,0.13)",
              borderRadius: 16,
              background:
                "rgba(255,255,255,0.06)",
              color: "#FFFFFF",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Torna alla pagina iniziale
          </button>

          <p
            style={{
              margin: "18px 0 0",
              color:
                "rgba(255,255,255,0.40)",
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            Se il problema continua, apri
            Aggiornamenti app e pulisci i file
            temporanei.
          </p>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;