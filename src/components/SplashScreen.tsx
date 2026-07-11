import { useEffect, useState } from "react";

type SplashScreenProps = {
  onComplete: () => void;
};

function SplashScreen({
  onComplete,
}: SplashScreenProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, 1800);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <>
      <style>
        {`
          @keyframes rutaSplashIconEnter {
            from {
              opacity: 0;
              transform: translateY(18px) scale(0.82);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes rutaSplashTextEnter {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes rutaSplashLoader {
            from {
              transform: scaleX(0);
            }

            to {
              transform: scaleX(1);
            }
          }

          @keyframes rutaSplashGlow {
            from {
              opacity: 0.45;
              transform: translate(-50%, -50%) scale(0.88);
            }

            to {
              opacity: 0.9;
              transform: translate(-50%, -50%) scale(1.12);
            }
          }
        `}
      </style>

      <div
        role="status"
        aria-label="Caricamento di Ruta Maya"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          width: "100%",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxSizing: "border-box",
          padding:
            "calc(28px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom))",
          background:
            "radial-gradient(circle at 50% 38%, rgba(17,197,191,0.18), transparent 30%), linear-gradient(180deg, #071D31 0%, #04111F 100%)",
          color: "#FFFFFF",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
          opacity: isLeaving ? 0 : 1,
          transform: isLeaving ? "scale(1.025)" : "scale(1)",
          transition:
            "opacity 500ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: isLeaving ? "none" : "auto",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(17,197,191,0.14)",
            filter: "blur(75px)",
            animation:
              "rutaSplashGlow 1800ms ease-in-out infinite alternate",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 330,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 122,
              height: 122,
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: 31,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "#062036",
              boxShadow:
                "0 26px 58px rgba(0,0,0,0.42), 0 0 35px rgba(17,197,191,0.12)",
              animation:
                "rutaSplashIconEnter 850ms cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}ruta-maya-icon-512.png`}
              alt=""
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            style={{
              animation:
                "rutaSplashTextEnter 750ms 180ms cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <p
              style={{
                margin: "27px 0 0",
                color: "#45DDD6",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: 2.2,
                textTransform: "uppercase",
              }}
            >
              Yucatán 2026
            </p>

            <h1
              style={{
                margin: "9px 0 0",
                color: "#FFFFFF",
                fontSize: 44,
                fontWeight: 780,
                lineHeight: 1,
                letterSpacing: -1.5,
              }}
            >
              Ruta Maya
            </h1>

            <p
              style={{
                margin: "13px 0 0",
                color: "rgba(255,255,255,0.65)",
                fontSize: 15,
                lineHeight: 1.45,
              }}
            >
              Il vostro viaggio nello Yucatán
            </p>
          </div>

          <div
            style={{
              width: 130,
              height: 4,
              marginTop: 32,
              overflow: "hidden",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, #11C5BF, #6CE6DF, #F4D58D)",
                transformOrigin: "left",
                animation:
                  "rutaSplashLoader 1900ms cubic-bezier(0.22,1,0.36,1) both",
              }}
            />
          </div>

          <p
            style={{
              margin: "24px 0 0",
              color: "rgba(255,255,255,0.35)",
              fontSize: 11,
              fontWeight: 750,
              letterSpacing: 1.3,
              textTransform: "uppercase",
            }}
          >
            06–15 agosto 2026
          </p>
        </div>
      </div>
    </>
  );
}

export default SplashScreen;