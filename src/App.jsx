import React, { useState } from "react";
import Header from "./components/Layout/Header/Header";
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import ChatBox from "./components/ChatBox/ChatBox";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Datos de ejemplo para el historial de chats
  const chats = [
    { id: 1, name: "Chat 1" },
    { id: 2, name: "Chat 2" },
  ];

  const handleSelectChat = (chatId) => {
    console.log("Chat seleccionado:", chatId);
  };

  return (
    <div className="parent">
      {/* Sidebar */}
      <div className="div1">
        <Sidebar chats={chats} onSelectChat={handleSelectChat} />
      </div>

      {/* Header */}
      <div className="div2">
        <Header onOpenModal={handleOpenModal} />
      </div>

      {/* Main Content */}
      <div className="div3">
        <ChatBox />
      </div>
    </div>
  );
}

export default App;
