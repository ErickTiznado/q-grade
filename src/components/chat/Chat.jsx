import React, { useState } from "react";
import "./Chat.css"; // Importa el archivo CSS aquí
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="chat-app">
      <main className="chat-container">
        <div className="chat-box">
          <div className="message user-message">Hola</div>
          <div className="message bot-message">
            ¡Hola! ¿En qué puedo ayudarte hoy?
          </div>
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Escribe tu mensaje aquí..."
          />
          <button>
          <img src="/src/assets/images/Q-grade-Send.svg" alt="" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default Chat;
