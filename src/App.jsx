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
import EditorUI from "./components/DevMode/EditorUI"; // Ahora EditorUI incluye la toolbar y el menú contextual
import "./App.css";
import { sendMessage } from "./api/api";

function App() {
  // Estados para el chat
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState('deepseek-chat');
  const [showEditor, setShowEditor] = useState(false); // Controla la visibilidad del editor

  // Estado para el contenido del editor (controlado)
  const [editorContent, setEditorContent] = useState("// Escribe o pega tu código aquí...");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleModelChange = (modelType) => {
    setCurrentModel(modelType === 'reasoning' ? 'deepseek-reasoner' : 'deepseek-chat');
  };

  const handleSend = async () => {
    if (message.trim() || files.length > 0) {
      const originalUserMsg = message;
      const userMessage = { role: 'user', content: originalUserMsg };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setMessage('');

      try {
        setIsBotTyping(true);
        const payload = {
          message: originalUserMsg,
          conversation: newMessages,
          modelType: currentModel === 'deepseek-reasoner' ? 'reasoner' : 'standard',
          files: files.map(item => item.file)
        };

        console.log("Payload enviado a la API:", payload);
        const responseObj = await sendMessage(payload);
        const reply = responseObj && responseObj.reply ? responseObj.reply : "";
        const filteredBotResponse =
          typeof reply === "string"
            ? reply.replace(/<DOCUMENTOADJUNTO>[\s\S]*<\/DOCUMENTOADJUNTO>/gi, "").trim()
            : reply;
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
        setFiles([]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isBotTyping) {
      e.preventDefault();
      handleSend();
    }
  };

  // Alterna la visibilidad del editor (EditorUI)
  const toggleEditor = () => {
    setShowEditor(prev => !prev);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
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
                <div className="split-screen">
                  <div className={`chat-section ${!showEditor ? "full-width" : ""}`}>
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
                              files={msg.files}
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
                        files={files}
                        setFiles={setFiles}
                        toggleEditor={toggleEditor}
                        onFileLoad={setEditorContent}  // Actualiza el contenido del editor al cargar un archivo
                      />
                    </div>
                  </div>
                  <div className={`editor-section ${showEditor ? "visible" : "hidden"}`}>
                    <EditorUI code={editorContent} setCode={setEditorContent} />
                  </div>
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
