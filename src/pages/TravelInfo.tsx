import { useEffect, useState } from "react";
import { theme } from "../styles/theme";

type PersonalContact = {
  insurance: string;
  insurancePolicy: string;
  carRental: string;
  bank: string;
  emergencyContact: string;
};

const STORAGE_KEY = "ruta-maya-personal-contacts";

const defaultContacts: PersonalContact = {
  insurance: "",
  insurancePolicy: "",
  carRental: "",
  bank: "",
  emergencyContact: "",
};

const travelTips = [
  {
    icon: "📄",
    title: "Documenti",
    items: [
      "Passaporto e copie digitali",
      "Patente e documenti del noleggio",
      "Polizza assicurativa",
      "Prenotazioni salvate anche offline",
    ],
  },
  {
    icon: "💳",
    title: "Pagamenti",
    items: [
      "Tenere una carta di riserva separata",
      "Conservare una piccola quantità di contanti",
      "Controllare l’importo prima di confermare",
      "Avvisare subito la banca in caso di furto",
    ],
  },
  {
    icon: "🚗",
    title: "Spostamenti",
    items: [
      "Fotografare l’auto al momento del ritiro",
      "Verificare carburante e condizioni delle gomme",
      "Evitare di lasciare oggetti visibili in auto",
      "Scaricare il percorso prima delle tratte lunghe",
    ],
  },
  {
    icon: "🩺",
    title: "Salute",
    items: [
      "Portare medicinali personali e prescrizioni",
      "Bere acqua confezionata quando necessario",
      "Usare protezione solare e repellente",
      "Salvare i dati dell’assicurazione sanitaria",
    ],
  },
];

function TravelInfo() {
  const [contacts, setContacts] =
    useState<PersonalContact>(defaultContacts);

  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const savedContacts = localStorage.getItem(STORAGE_KEY);

    if (!savedContacts) {
      return;
    }

    try {
      setContacts(JSON.parse(savedContacts));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function updateContact(
    field: keyof PersonalContact,
    value: string,
  ) {
    setContacts((currentContacts) => ({
      ...currentContacts,
      [field]: value,
    }));
  }

  function saveContacts() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(contacts),
    );

    setIsEditing(false);
    setSavedMessage(true);

    window.setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
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
        Assistenza
      </p>

      <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
        Info Messico
      </h1>

      <p
        style={{
          marginTop: 0,
          color: theme.colors.textSoft,
          lineHeight: 1.5,
        }}
      >
        Numeri importanti, contatti personali e promemoria utili.
      </p>

      <section
        style={{
          marginTop: 25,
          padding: 22,
          borderRadius: 25,
          background:
            "linear-gradient(135deg, #FF6868, #A92E4B)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 850,
            letterSpacing: 1,
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          Emergenza nazionale
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            marginTop: 12,
          }}
        >
          <div>
            <strong
              style={{
                display: "block",
                fontSize: 48,
                lineHeight: 1,
              }}
            >
              911
            </strong>

            <span
              style={{
                display: "block",
                marginTop: 8,
                lineHeight: 1.4,
                opacity: 0.9,
              }}
            >
              Polizia, ambulanza e vigili del fuoco
            </span>
          </div>

          <a
            href="tel:911"
            style={{
              width: 62,
              height: 62,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              borderRadius: 21,
              background: "#FFFFFF",
              color: "#A92E4B",
              textDecoration: "none",
              fontSize: 28,
              boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
            }}
            aria-label="Chiama il 911"
          >
            ☎
          </a>
        </div>
      </section>

      <section style={{ marginTop: 25 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 22 }}>
              I vostri contatti
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: theme.colors.textSoft,
                fontSize: 13,
              }}
            >
              Restano salvati su questo dispositivo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              background: theme.colors.card,
              color: theme.colors.primary,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {isEditing ? "Annulla" : "Modifica"}
          </button>
        </div>

        {savedMessage && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 14,
              background: "rgba(17,197,191,0.16)",
              color: theme.colors.primary,
              textAlign: "center",
              fontWeight: 750,
            }}
          >
            Contatti salvati.
          </div>
        )}

        {isEditing ? (
          <div
            style={{
              marginTop: 16,
              padding: 20,
              borderRadius: 23,
              background: theme.colors.card,
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <ContactInput
              label="Assicurazione viaggio"
              placeholder="Numero assistenza"
              value={contacts.insurance}
              onChange={(value) =>
                updateContact("insurance", value)
              }
            />

            <ContactInput
              label="Numero polizza"
              placeholder="Codice della polizza"
              value={contacts.insurancePolicy}
              onChange={(value) =>
                updateContact("insurancePolicy", value)
              }
            />

            <ContactInput
              label="Noleggio auto"
              placeholder="Numero assistenza"
              value={contacts.carRental}
              onChange={(value) =>
                updateContact("carRental", value)
              }
            />

            <ContactInput
              label="Blocco carte / banca"
              placeholder="Numero della banca"
              value={contacts.bank}
              onChange={(value) =>
                updateContact("bank", value)
              }
            />

            <ContactInput
              label="Contatto di emergenza"
              placeholder="Nome e numero"
              value={contacts.emergencyContact}
              onChange={(value) =>
                updateContact("emergencyContact", value)
              }
            />

            <button
              type="button"
              onClick={saveContacts}
              style={{
                width: "100%",
                marginTop: 20,
                padding: 14,
                border: 0,
                borderRadius: 16,
                background: theme.colors.primary,
                color: theme.colors.background,
                fontWeight: 850,
                cursor: "pointer",
              }}
            >
              Salva contatti
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 11,
              marginTop: 16,
            }}
          >
            <ContactCard
              icon="🛡️"
              label="Assicurazione viaggio"
              value={contacts.insurance}
              phone
            />

            <ContactCard
              icon="📋"
              label="Numero polizza"
              value={contacts.insurancePolicy}
            />

            <ContactCard
              icon="🚗"
              label="Noleggio auto"
              value={contacts.carRental}
              phone
            />

            <ContactCard
              icon="💳"
              label="Blocco carte / banca"
              value={contacts.bank}
              phone
            />

            <ContactCard
              icon="👤"
              label="Contatto di emergenza"
              value={contacts.emergencyContact}
              phone
            />
          </div>
        )}
      </section>

      <section style={{ marginTop: 29 }}>
        <h2 style={{ margin: "0 0 15px", fontSize: 22 }}>
          Promemoria di viaggio
        </h2>

        <div style={{ display: "grid", gap: 13 }}>
          {travelTips.map((section) => (
            <article
              key={section.title}
              style={{
                padding: 19,
                borderRadius: 22,
                background: theme.colors.card,
                border: "1px solid rgba(255,255,255,0.08)",
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
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 15,
                    background: "rgba(17,197,191,0.15)",
                    fontSize: 22,
                  }}
                >
                  {section.icon}
                </span>

                <h3 style={{ margin: 0, fontSize: 18 }}>
                  {section.title}
                </h3>
              </div>

              <div
                style={{
                  marginTop: 15,
                  paddingTop: 12,
                  borderTop:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {section.items.map((item) => (
                  <p
                    key={item}
                    style={{
                      display: "flex",
                      gap: 9,
                      margin: "9px 0",
                      color: theme.colors.textSoft,
                      lineHeight: 1.45,
                    }}
                  >
                    <span
                      style={{
                        color: theme.colors.primary,
                      }}
                    >
                      ●
                    </span>

                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

type ContactInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function ContactInput({
  label,
  placeholder,
  value,
  onChange,
}: ContactInputProps) {
  return (
    <label
      style={{
        display: "block",
        marginTop: 15,
        fontWeight: 750,
      }}
    >
      {label}

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: 8,
          padding: "13px 14px",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 14,
          outline: "none",
          background: "rgba(7,26,46,0.72)",
          color: "#FFFFFF",
          fontSize: 16,
        }}
      />
    </label>
  );
}

type ContactCardProps = {
  icon: string;
  label: string;
  value: string;
  phone?: boolean;
};

function ContactCard({
  icon,
  label,
  value,
  phone = false,
}: ContactCardProps) {
  const content = (
    <>
      <span
        style={{
          width: 44,
          height: 44,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          borderRadius: 15,
          background: "rgba(17,197,191,0.15)",
          fontSize: 21,
        }}
      >
        {icon}
      </span>

      <span style={{ flex: 1 }}>
        <span
          style={{
            display: "block",
            color: theme.colors.textSoft,
            fontSize: 12,
          }}
        >
          {label}
        </span>

        <strong
          style={{
            display: "block",
            marginTop: 5,
            fontSize: 16,
          }}
        >
          {value || "Da inserire"}
        </strong>
      </span>

      {phone && value && (
        <span
          style={{
            color: theme.colors.primary,
            fontSize: 20,
          }}
        >
          ☎
        </span>
      )}
    </>
  );

  const sharedStyle = {
    display: "flex",
    alignItems: "center",
    gap: 13,
    padding: 15,
    borderRadius: 19,
    background: theme.colors.card,
    border: "1px solid rgba(255,255,255,0.08)",
    color: theme.colors.text,
    textDecoration: "none",
  };

  if (phone && value) {
    return (
      <a
        href={`tel:${value.replace(/[^\d+]/g, "")}`}
        style={sharedStyle}
      >
        {content}
      </a>
    );
  }

  return <div style={sharedStyle}>{content}</div>;
}

export default TravelInfo;