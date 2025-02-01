import React, { useState } from 'react';
import './ChatBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ChatBox() {
  const [userMessage, setUserMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) {
      alert("Por favor, escribe un mensaje antes de enviar.");
      return;
    }
    // Aquí podrías integrar la lógica para enviar el mensaje a la API u otra función
    alert('¡Mensaje enviado o acción realizada!');
    setUserMessage('');
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
          <FontAwesomeIcon icon="paper-plane" />
        </button>
      </div>
    </main>
  );
}

export default ChatBox;
