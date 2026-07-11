function PageLoader() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: "30px 20px 110px",
        background:
          "linear-gradient(180deg, #071A2E, #04111F)",
        color: "#FFFFFF",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          className="ruta-page-loader"
          aria-hidden="true"
        />

        <p
          style={{
            margin: "17px 0 0",
            color:
              "rgba(255,255,255,0.62)",
            fontSize: 13,
            fontWeight: 750,
          }}
        >
          Caricamento sezione…
        </p>
      </div>
    </main>
  );
}

export default PageLoader;