export default function Home() {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0b0b0b",
      color: "white",
      fontFamily: "Arial"
    }}>
      
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        AI Platform 🚀
      </h1>

      <p style={{ marginBottom: "30px" }}>
        Porozmawiaj z AI
      </p>

      <input 
        placeholder="Napisz coś..."
        style={{
          padding: "15px",
          width: "300px",
          borderRadius: "10px",
          border: "none",
          marginBottom: "10px"
        }}
      />

      <button style={{
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        background: "#6366f1",
        color: "white",
        cursor: "pointer"
      }}>
        Wyślij
      </button>

    </main>
  );
}
