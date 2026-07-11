import { useEffect, useState } from "react";

type ConnectionMessage = "offline" | "restored" | null;

function ConnectionStatus() {
  const [message, setMessage] =
    useState<ConnectionMessage>(
      navigator.onLine ? null : "offline",
    );

  useEffect(() => {
    let restoredTimer: number | undefined;

    function handleOffline() {
      if (restoredTimer) {
        window.clearTimeout(restoredTimer);
      }

      setMessage("offline");
    }

    function handleOnline() {
      setMessage("restored");

      restoredTimer = window.setTimeout(() => {
        setMessage(null);
      }, 3000);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);

      if (restoredTimer) {
        window.clearTimeout(restoredTimer);
      }
    };
  }, []);

  if (!message) {
    return null;
  }

  const isOffline = message === "offline";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "calc(12px + env(safe-area-inset-top))",
        left: 16,
        right: 16,
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        gap: 11,
        maxWidth: 520,
        margin: "0 auto",
        padding: "13px 15px",
        border: isOffline
          ? "1px solid rgba(244,213,141,0.32)"
          : "1px solid rgba(17,197,191,0.32)",
        borderRadius: 17,
        background: isOffline
          ? "rgba(48,39,20,0.96)"
          : "rgba(7,46,53,0.96)",
        color: "#FFFFFF",
        boxShadow: "0 12px 35px rgba(0,0,0,0.32)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <span
        style={{
          width: 38,
          height: 38,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          borderRadius: 13,
          background: isOffline
            ? "rgba(244,213,141,0.16)"
            : "rgba(17,197,191,0.16)",
          fontSize: 19,
        }}
      >
        {isOffline ? "📴" : "✓"}
      </span>

      <span style={{ flex: 1 }}>
        <strong
          style={{
            display: "block",
            fontSize: 14,
          }}
        >
          {isOffline
            ? "Modalità offline"
            : "Connessione ripristinata"}
        </strong>

        <span
          style={{
            display: "block",
            marginTop: 3,
            color: "rgba(255,255,255,0.72)",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          {isOffline
            ? "Itinerario e dati salvati restano disponibili."
            : "Mappa, meteo e collegamenti sono nuovamente disponibili."}
        </span>
      </span>
    </div>
  );
}

export default ConnectionStatus;