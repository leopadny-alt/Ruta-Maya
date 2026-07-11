import { useMemo, useState } from "react";
import {
  bookings,
  type Booking,
  type BookingCategory,
} from "../data/bookings";
import { getPrivateBookingReference } from "../utils/privateTravelData";
import { theme } from "../styles/theme";

type CategoryFilter = BookingCategory | "all";

const travelers = [
  "Tutti",
  "Leonardo",
  "Eva",
  "Stefano",
  "Valentina",
  "Maristella",
] as const;

type TravelerFilter = (typeof travelers)[number];

const categoryFilters: {
  id: CategoryFilter;
  label: string;
  icon: string;
}[] = [
  {
    id: "all",
    label: "Tutte",
    icon: "✨",
  },
  {
    id: "flight",
    label: "Voli",
    icon: "✈️",
  },
  {
    id: "ferry",
    label: "Traghetti",
    icon: "⛴️",
  },
  {
    id: "car",
    label: "Auto",
    icon: "🚗",
  },
  {
    id: "insurance",
    label: "Assicurazione",
    icon: "🛡️",
  },
];

const categoryInfo: Record<
  BookingCategory,
  {
    label: string;
    icon: string;
    color: string;
    background: string;
  }
> = {
  flight: {
    label: "Volo",
    icon: "✈️",
    color: "#6ED4FF",
    background: "rgba(72,184,232,0.14)",
  },
  ferry: {
    label: "Traghetto",
    icon: "⛴️",
    color: "#62E4D9",
    background: "rgba(17,197,191,0.14)",
  },
  car: {
    label: "Auto",
    icon: "🚗",
    color: "#FFB86B",
    background: "rgba(255,184,107,0.14)",
  },
  insurance: {
    label: "Assicurazione",
    icon: "🛡️",
    color: "#C3A8FF",
    background: "rgba(195,168,255,0.14)",
  },
};

function Bookings() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");

  const [selectedTraveler, setSelectedTraveler] =
    useState<TravelerFilter>("Tutti");

  const [expandedBookings, setExpandedBookings] = useState<
    number[]
  >([1]);

  const [copiedReference, setCopiedReference] = useState<
    number | null
  >(null);

  const visibleBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesCategory =
        selectedCategory === "all" ||
        booking.category === selectedCategory;

      const matchesTraveler =
        selectedTraveler === "Tutti" ||
        booking.travelers.includes(selectedTraveler);

      return matchesCategory && matchesTraveler;
    });
  }, [selectedCategory, selectedTraveler]);

  function toggleBooking(id: number) {
    setExpandedBookings((currentBookings) => {
      if (currentBookings.includes(id)) {
        return currentBookings.filter(
          (bookingId) => bookingId !== id,
        );
      }

      return [...currentBookings, id];
    });
  }

  async function copyReference(
    bookingId: number,
    privateReference: string,
  ) {
    if (!privateReference) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        privateReference,
      );

      setCopiedReference(bookingId);

      window.setTimeout(() => {
        setCopiedReference(null);
      }, 1800);
    } catch {
      window.prompt(
        "Copia manualmente il codice:",
        privateReference,
      );
    }
  }

  async function shareBooking(
    booking: Booking,
    privateReference: string,
  ) {
    const text = [
      booking.title,
      booking.date,
      privateReference
        ? `Riferimento: ${privateReference}`
        : "",
      ...booking.details,
      booking.alert
        ? `Attenzione: ${booking.alert}`
        : "",
      `Viaggiatori: ${booking.travelers.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: booking.title,
          text,
        });

        return;
      }

      await navigator.clipboard.writeText(text);
      alert("Dettagli copiati.");
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      window.prompt(
        "Copia i dettagli della prenotazione:",
        text,
      );
    }
  }

  const flightCount = visibleBookings.filter(
    (booking) => booking.category === "flight",
  ).length;

  const ferryCount = visibleBookings.filter(
    (booking) => booking.category === "ferry",
  ).length;

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
        Documenti di viaggio
      </p>

      <h1
        style={{
          margin: "8px 0 6px",
          fontSize: 34,
        }}
      >
        Prenotazioni
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Voli, traghetti, noleggio e assicurazione in
        un’unica schermata.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginTop: 23,
        }}
      >
        <SummaryCard
          value={visibleBookings.length}
          label="prenotazioni"
          icon="🎫"
        />

        <SummaryCard
          value={flightCount}
          label="voli"
          icon="✈️"
        />

        <SummaryCard
          value={ferryCount}
          label="traghetti"
          icon="⛴️"
        />
      </section>

      <section style={{ marginTop: 23 }}>
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 18,
          }}
        >
          Filtra per persona
        </h2>

        <div
          style={{
            display: "flex",
            gap: 9,
            paddingBottom: 6,
            overflowX: "auto",
          }}
        >
          {travelers.map((traveler) => {
            const isActive =
              selectedTraveler === traveler;

            return (
              <button
                key={traveler}
                type="button"
                onClick={() =>
                  setSelectedTraveler(traveler)
                }
                style={{
                  flexShrink: 0,
                  padding: "10px 14px",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 999,
                  background: isActive
                    ? theme.colors.primary
                    : theme.colors.card,
                  color: isActive
                    ? theme.colors.background
                    : theme.colors.text,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {traveler === "Tutti"
                  ? "👥 Tutti"
                  : traveler}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: 17 }}>
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 18,
          }}
        >
          Categoria
        </h2>

        <div
          style={{
            display: "flex",
            gap: 9,
            paddingBottom: 6,
            overflowX: "auto",
          }}
        >
          {categoryFilters.map((category) => {
            const isActive =
              selectedCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(category.id)
                }
                style={{
                  flexShrink: 0,
                  padding: "10px 14px",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 999,
                  background: isActive
                    ? theme.colors.secondary
                    : theme.colors.card,
                  color: isActive
                    ? theme.colors.background
                    : theme.colors.text,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {category.icon} {category.label}
              </button>
            );
          })}
        </div>
      </section>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 24,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 21,
          }}
        >
          Documenti disponibili
        </h2>

        <span
          style={{
            padding: "7px 10px",
            borderRadius: 999,
            background: "rgba(17,197,191,0.15)",
            color: theme.colors.primary,
            fontSize: 13,
            fontWeight: 850,
          }}
        >
          {visibleBookings.length}
        </span>
      </div>

      <section
        style={{
          display: "grid",
          gap: 14,
          marginTop: 14,
        }}
      >
        {visibleBookings.map((booking) => {
          const info = categoryInfo[booking.category];

          const isExpanded =
            expandedBookings.includes(booking.id);

          const isCopied =
            copiedReference === booking.id;

          const privateReference =
            getPrivateBookingReference(booking.id);

          return (
            <article
              key={booking.id}
              style={{
                overflow: "hidden",
                borderRadius: 24,
                background: theme.colors.card,
                border: isExpanded
                  ? `1px solid ${info.color}55`
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: isExpanded
                  ? "0 17px 38px rgba(0,0,0,0.22)"
                  : "none",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  toggleBooking(booking.id)
                }
                aria-expanded={isExpanded}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: 18,
                  border: 0,
                  background: "transparent",
                  color: theme.colors.text,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 51,
                    height: 51,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 17,
                    background: info.background,
                    color: info.color,
                    fontSize: 24,
                  }}
                >
                  {info.icon}
                </span>

                <span style={{ flex: 1 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 8px",
                      borderRadius: 999,
                      background: info.background,
                      color: info.color,
                      fontSize: 10,
                      fontWeight: 850,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {info.label}
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: 8,
                      fontSize: 18,
                      lineHeight: 1.3,
                    }}
                  >
                    {booking.title}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 5,
                      color: theme.colors.textSoft,
                      fontSize: 13,
                    }}
                  >
                    {booking.date}
                  </span>

                  <span
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: theme.colors.textSoft,
                      fontSize: 11,
                      lineHeight: 1.4,
                    }}
                  >
                    👥 {booking.travelers.join(", ")}
                  </span>
                </span>

                <span
                  style={{
                    color: info.color,
                    fontSize: 25,
                    transform: isExpanded
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 180ms ease",
                  }}
                >
                  ›
                </span>
              </button>

              {isExpanded && (
                <div
                  style={{
                    padding: "0 18px 19px",
                  }}
                >
                  <div
                    style={{
                      paddingTop: 17,
                      borderTop:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {privateReference ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          gap: 12,
                          padding: 14,
                          borderRadius: 16,
                          background:
                            "rgba(255,255,255,0.055)",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display: "block",
                              color:
                                theme.colors.textSoft,
                              fontSize: 11,
                              textTransform:
                                "uppercase",
                              letterSpacing: 0.6,
                            }}
                          >
                            Codice prenotazione
                          </span>

                          <strong
                            style={{
                              display: "block",
                              marginTop: 5,
                              color: info.color,
                              fontSize: 18,
                              letterSpacing: 0.7,
                            }}
                          >
                            {privateReference}
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            copyReference(
                              booking.id,
                              privateReference,
                            )
                          }
                          style={{
                            padding: "10px 12px",
                            border: `1px solid ${info.color}45`,
                            borderRadius: 13,
                            background: isCopied
                              ? info.color
                              : info.background,
                            color: isCopied
                              ? theme.colors.background
                              : info.color,
                            fontSize: 12,
                            fontWeight: 850,
                            cursor: "pointer",
                          }}
                        >
                          {isCopied
                            ? "✓ Copiato"
                            : "Copia"}
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: 14,
                          borderRadius: 16,
                          background:
                            "rgba(244,213,141,0.08)",
                          border:
                            "1px solid rgba(244,213,141,0.18)",
                          color:
                            theme.colors.secondary,
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}
                      >
                        🔒 Codice non ancora salvato su questo
                        dispositivo. Inseriscilo dalla sezione
                        “Codici privati”.
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gap: 9,
                        marginTop: 14,
                      }}
                    >
                      {booking.details.map(
                        (detail, index) => (
                          <div
                            key={`${booking.id}-${detail}`}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 11,
                              padding: 12,
                              borderRadius: 15,
                              background:
                                "rgba(255,255,255,0.045)",
                            }}
                          >
                            <span
                              style={{
                                width: 24,
                                height: 24,
                                display: "grid",
                                placeItems: "center",
                                flexShrink: 0,
                                borderRadius: 8,
                                background:
                                  info.background,
                                color: info.color,
                                fontSize: 11,
                                fontWeight: 900,
                              }}
                            >
                              {index + 1}
                            </span>

                            <span
                              style={{
                                color:
                                  theme.colors.textSoft,
                                fontSize: 14,
                                lineHeight: 1.45,
                              }}
                            >
                              {detail}
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    {booking.alert && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 11,
                          marginTop: 14,
                          padding: 14,
                          borderRadius: 16,
                          background:
                            "rgba(244,213,141,0.10)",
                          border:
                            "1px solid rgba(244,213,141,0.20)",
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            fontSize: 19,
                          }}
                        >
                          ⚠️
                        </span>

                        <p
                          style={{
                            margin: 0,
                            color:
                              theme.colors.secondary,
                            fontSize: 13,
                            fontWeight: 700,
                            lineHeight: 1.5,
                          }}
                        >
                          {booking.alert}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        shareBooking(
                          booking,
                          privateReference,
                        )
                      }
                      style={{
                        width: "100%",
                        marginTop: 15,
                        padding: 13,
                        border: `1px solid ${info.color}45`,
                        borderRadius: 15,
                        background: info.background,
                        color: info.color,
                        fontWeight: 850,
                        cursor: "pointer",
                      }}
                    >
                      Condividi dettagli
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {visibleBookings.length === 0 && (
          <div
            style={{
              padding: 23,
              borderRadius: 21,
              background: theme.colors.card,
              border:
                "1px solid rgba(255,255,255,0.08)",
              color: theme.colors.textSoft,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Nessuna prenotazione corrisponde ai filtri
            selezionati.
          </div>
        )}
      </section>

      <section
        style={{
          marginTop: 22,
          padding: 19,
          borderRadius: 21,
          background: "rgba(244,213,141,0.08)",
          border:
            "1px solid rgba(244,213,141,0.18)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: theme.colors.secondary,
            fontSize: 18,
          }}
        >
          Documenti originali
        </h2>

        <p
          style={{
            margin: "9px 0 0",
            color: theme.colors.textSoft,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          Questa schermata contiene un riepilogo offline.
          Conserva anche voucher, polizze e conferme originali
          sul telefono.
        </p>
      </section>
    </main>
  );
}

function SummaryCard({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon: string;
}) {
  return (
    <article
      style={{
        padding: "15px 7px",
        borderRadius: 18,
        background: theme.colors.card,
        border:
          "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 21,
        }}
      >
        {icon}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 8,
          fontSize: 23,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 4,
          color: theme.colors.textSoft,
          fontSize: 10,
        }}
      >
        {label}
      </span>
    </article>
  );
}

export default Bookings;