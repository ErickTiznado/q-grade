import React, { useState } from "react";
import Header from "./components/Layout/Header/Header";
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import ChatWelcome from "./components/Chat/ChatWelcome";
import ChatInput from './components/Chat/ChatInput'
import "./App.css";

function App() {
const [message, setMessage] =  useState('');
const [showSidebar, setShowSidebar] = useState(true);


  return (
      <div className="app">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
      <main className="main">
        <div className="chat">
          <ChatWelcome/>
        </div>
        <ChatInput message={message} setMessage={setMessage}/>
      </main>   
      </div>


  );
}

export default App;
