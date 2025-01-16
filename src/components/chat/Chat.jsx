import React, { useState, useEffect } from "react";
import "./Chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Chat() {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatbotResponses, setChatbotResponses] = useState(1);
  const [isRegistered, setIsRegistered] = useState(false);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    const storedResponses = parseInt(localStorage.getItem('chatbotResponses')) || 0;
    const registered = localStorage.getItem('isRegistered') === 'true';

    setMessages(storedMessages);
    setChatbotResponses(storedResponses);
    setIsRegistered(registered);

    // Si no hay mensajes guardados, añadir el mensaje inicial del bot
    if (storedMessages.length === 0) {
      const initialMessage = { text: '¡Hola! ¿En qué puedo ayudarte hoy?', sender: 'chatbot' };
      setMessages([initialMessage]);
      localStorage.setItem('messages', JSON.stringify([initialMessage]));
    }
  }, []);

  // Guardar datos en localStorage cuando cambian los mensajes o el número de respuestas
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
    localStorage.setItem('chatbotResponses', chatbotResponses);
  }, [messages, chatbotResponses]);

  const handleSend = () => {
    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) {
      alert("Por favor, escribe un mensaje antes de enviar.");
      return;
    }

    // Agregar el mensaje del usuario al estado
    const userMessageObject = { text: trimmedMessage, sender: 'usuario' };
    setMessages((prevMessages) => [...prevMessages, userMessageObject]);
    setUserMessage(''); // Limpiar el input del usuario

    // Simular respuesta del chatbot después de 1 segundo
    setTimeout(() => {
      const botMessage = { text: "¡Hola! ¿Cómo puedo ayudarte?", sender: 'chatbot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setChatbotResponses((prevCount) => prevCount + 1);
    }, 1000);
  };

  const handleRegister = () => {
    setIsRegistered(true);
    localStorage.setItem('isRegistered', 'true');
    alert("¡Gracias por registrarte!");
  };

  return (
    <div className="chat-app">
      <main className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'usuario' ? 'user-message' : 'bot-message'}`}
            >
              {msg.text}
            </div>
          ))}
          {chatbotResponses >= 3 && !isRegistered && (
            <div className="message bot-message">
              Por favor, regístrate para continuar usando el servicio.
              <button onClick={handleRegister} className="register-button">Registrarse</button>
            </div>
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Escribe tu mensaje aquí..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            disabled={chatbotResponses >= 3 && !isRegistered} // Deshabilitar si no está registrado y supera el límite
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={chatbotResponses >= 3 && !isRegistered}
          >
            <FontAwesomeIcon icon="paper-plane" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default Chat;
