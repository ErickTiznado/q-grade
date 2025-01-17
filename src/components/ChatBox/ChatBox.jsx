import React, { useState } from "react";
import "./ChatBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ChatBox({ onNavigateToChat }) {
  const [userMessage, setUserMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) {
      alert("Por favor, escribe un mensaje antes de enviar.");
      return;
    }
    // Aquí puedes integrar lógica adicional
    onNavigateToChat(); // Cambiar al componente Chat
  };

  return (
    <main className="main-content fade-in-section">
      <h1 className="hover-bounce" data-anim="pulse-on-hover">
        ¿Qué abordarás hoy?
      </h1>

      <div className="message-box hover-scale">
        <input
          type="text"
          placeholder="Escribe tu mensaje aquí..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSend}>
          <img src="/src/assets/images/Q-grade-Send.svg" alt="" />
        </button>
      </div>
    </main>
  );
}

export default ChatBox;
