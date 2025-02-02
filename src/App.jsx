import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Recuperar from "./components/Login/Recuperar";
import Header from "./components/Layout/Header/Header";
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import ChatWelcome from "./components/Chat/ChatWelcome";
import ChatInput from './components/Chat/ChatInput';
import "./App.css";

function App() {
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />

        {/* Ruta principal de la aplicación */}
        <Route 
          path="/app" 
          element={
            <div className="app">
              <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
              <main className="main">
                <div className="chat">
                  <ChatWelcome/>
                </div>
                <ChatInput message={message} setMessage={setMessage}/>
              </main>   
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
