import React, { useState } from "react";
import "./Chat.css"; // Importa el archivo CSS aquí

function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="chat-app">
      <header className="header">
        <div className="level-label">Nivel 1</div>
        <div className="chart">
          <div className="bar" style={{ width: "68%" }}></div>
          <span>100</span>
        </div>
        <div className="user-icon">
          <i className="fas fa-user"></i>
        </div>
      </header>

      <button className="menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`sidebar ${sidebarOpen ? "show" : "hidden"}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          ✕
        </button>
        <div className="logo">
          <img src="/assets/Q-Grade.svg" alt="Q-Grade Logo" />
        </div>
        <div className="chat-history">
          <div className="chat-history-header">
            <h2>Historial de Chat</h2>
            <div className="chat-actions">
              <i className="fas fa-search" title="Buscar"></i>
              <i className="fas fa-edit" title="Renombrar chats"></i>
            </div>
          </div>
          <ul>
            <li>
              <span>Chat 1</span>
              <span className="options">...</span>
            </li>
          </ul>
        </div>
      </aside>

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
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Chat;
