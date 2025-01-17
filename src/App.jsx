import React, { useState } from "react";
import Header from "./components/Layout/Header/Header";
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import ChatBox from "./components/ChatBox/ChatBox";
import Chat from "./components/chat/Chat"; // Asegúrate de importar tu nuevo componente
import "./App.css";
import "./components/chat/Chat";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("ChatBox"); // Estado para controlar el contenido principal
  const [selectedChatName, setSelectedChatName] = useState("");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Datos de ejemplo para el historial de chats
  const chats = [
    { id: 1, name: "Metricas de Calidad" },
    { id: 2, name: "ISO2510" },
  ];

  const handleSelectChat = (chatId) => {
    const selectedChat = chats.find((Chat) => Chat.id == chatId);
    setSelectedChatName(selectedChat ? selectedChat.name : "");
  };

  // Función para cambiar el contenido principal
  const handleNavigateToChat = () => {
    setActiveComponent("Chat");
  };

  return (
    <div className="parent">
      {/* Sidebar */}
      <div className="div1">
        <Sidebar chats={chats} onSelectChat={handleSelectChat} />
      </div>

      {/* Header */}
      <div className="div2">
        <Header chatName={selectedChatName} />
      </div>

      {/* Main Content */}
      <div className="div3">
        {activeComponent === "ChatBox" && (
          <ChatBox onNavigateToChat={handleNavigateToChat} />
        )}
        {activeComponent === "Chat" && <Chat />}
      </div>
    </div>
  );
}

export default App;
