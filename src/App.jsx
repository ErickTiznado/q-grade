import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useChat } from './components/useChat';
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Recuperar from "./components/Login/Recuperar";
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import ChatWelcome from "./components/Chat/ChatWelcome";
import ChatInput from './components/Chat/ChatInput';
import ChatMessage from './components/Chat/ChatMessage';
import ChatLoading from './components/Chat/ChatLoading';
import "./App.css";
import EditorUI from "./components/DevMode/EditorUI";

function App() {
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState('deepseek-chat');
  const messagesEndRef = useRef(null);
  
  const { sendMessage } = useChat(currentModel);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleModelChange = (modelType) => {
    setCurrentModel(modelType === 'reasoning' 
      ? 'deepseek-reasoner' 
      : 'deepseek-chat');
  };

  const handleSend = async (files = []) => {
    if (message.trim() || files.length > 0) {
      const userMessage = { 
        role: 'user', 
        content: message,
        files: files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }))
      };
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setMessage('');

      try {
        setIsBotTyping(true);
        
        // Crear FormData para enviar archivos
        const formData = new FormData();
        formData.append('message', message);
        formData.append('model', currentModel);
        
        files.forEach((file, index) => {
          formData.append(`files`, file, file.name);
        });

        const botResponse = await sendMessage(formData);
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: botResponse 
        }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '¡Ups! Hubo un error al procesar tu solicitud. Intenta nuevamente.'
        }]);
      } finally {
        setIsBotTyping(false);
      }
    }
  };

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
        <Route path="/editorui" element={<EditorUI />} />
        

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