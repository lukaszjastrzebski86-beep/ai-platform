"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const send = async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setReply(data.reply);
    } catch (error) {
      setReply("Błąd połączenia z AI");
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0b0b0b",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        AI Platform 🚀
      </h1>

      <p style={{ marginBottom: "30px" }}>Porozmawiaj z AI</p>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Napisz coś..."
        style={{
          padding: "15px",
          width: "300px",
          borderRadius: "10px",
          border: "none",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={send}
        style={{
          padding: "12px 20px",
          borderRadius: "10px",
          border: "none",
          background: "#6366f1",
          color: "white",
          cursor: "pointer",
        }}
      >
        Wyślij
      </button>

      {reply && (
        <p style={{ marginTop: "20px", maxWidth: "400px", textAlign: "center" }}>
          🤖 {reply}
        </p>
      )}
    </main>
  );
}
