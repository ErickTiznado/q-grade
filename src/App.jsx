// App.jsx
import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Recuperar from "./components/Login/Recuperar";
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import ChatWelcome from "./components/Chat/ChatWelcome";
import ChatInput from "./components/Chat/ChatInput";
import ChatMessage from "./components/Chat/ChatMessage";
import ChatLoading from "./components/Chat/ChatLoading";
import "./App.css";
<<<<<<< HEAD
import EditorUI from "./components/DevMode/EditorUI";
=======
import { sendMessage } from "./api/api";
>>>>>>> main

function App() {
  // Estados para mensaje, archivos, historial, etc.
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]); // Estado levantado para archivos
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState('deepseek-chat');
  const messagesEndRef = useRef(null);

  // Función para hacer scroll hasta el final del chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  // Función para cambiar el modelo (deepseek-chat o deepseek-reasoner)
  const handleModelChange = (modelType) => {
    setCurrentModel(modelType === 'reasoning' ? 'deepseek-reasoner' : 'deepseek-chat');
  };

  // Función para enviar el mensaje
  const handleSend = async () => {
    if (message.trim() || files.length > 0) {
      // Guarda el mensaje original para la UI (lo que escribió el usuario)
      const originalUserMsg = message;

      // Actualiza el historial de la UI con el mensaje original
      const userMessage = { role: 'user', content: originalUserMsg };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setMessage(''); // Limpia el input

      try {
        setIsBotTyping(true);

        // Construye el payload para la API.
        // Nota: Usamos files.map(item => item.file) para extraer los objetos File
        const payload = {
          message: originalUserMsg,
          conversation: newMessages,
          modelType: currentModel === 'deepseek-reasoner' ? 'reasoner' : 'standard',
          files: files.map(item => item.file)
        };

        console.log("Payload enviado a la API:", payload);

        // Llama a la función sendMessage definida en src/api/api.js
        const responseObj = await sendMessage(payload);
        const reply = responseObj && responseObj.reply ? responseObj.reply : "";

        // Filtramos (opcional) el contenido extraído (entre <DOCUMENTOADJUNTO>…</DOCUMENTOADJUNTO>) para que no se muestre en la UI
        const filteredBotResponse =
          typeof reply === "string"
            ? reply.replace(/<DOCUMENTOADJUNTO>[\s\S]*<\/DOCUMENTOADJUNTO>/gi, "").trim()
            : reply;

        // Actualiza el historial agregando la respuesta del asistente filtrada
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: filteredBotResponse }
        ]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: '¡Ups! Hubo un error al procesar tu solicitud. Intenta nuevamente.' }
        ]);
      } finally {
        setIsBotTyping(false);
        setFiles([]); // Opcional: limpiar archivos después de enviar
      }
    }
  };

  // Envía el mensaje al presionar Enter (sin shift)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isBotTyping) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
<<<<<<< HEAD
        <Route path="/editorui" element={<EditorUI />} />
        

=======
>>>>>>> main
        <Route 
          path="/app" 
          element={
            <div className="app">
              <Sidebar 
                showSidebar={showSidebar} 
                setShowSidebar={setShowSidebar} 
                onResetChat={() => setMessages([])}
              />
              <main className="main">
                <div className="chat-container">
                  <div className="chat-messages">
                    {messages.length === 0 ? (
                      <ChatWelcome />
                    ) : (
                      messages.map((msg, index) => (
                        <ChatMessage 
                          key={index}
                          message={msg.content}
                          isBot={msg.role === 'assistant'}
                          files={msg.files}  // Si lo necesitas para algún renderizado interno
                        />
                      ))
                    )}
                    {isBotTyping && <ChatLoading />}
                    <div ref={messagesEndRef} />
                  </div>
                  <ChatInput 
                    message={message}
                    setMessage={setMessage}
                    onSend={handleSend}
                    onKeyPress={handleKeyPress}
                    isLoading={isBotTyping}
                    onModelChange={handleModelChange}
                    isReasoningModel={currentModel === 'deepseek-reasoner'}
                    files={files}      // Pasamos el estado de archivos
                    setFiles={setFiles} // Pasamos la función para actualizar archivos
                  />
                </div>
              </main>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
