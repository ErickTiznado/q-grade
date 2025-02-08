import React from 'react';
import { Bot } from 'lucide-react';
import './ChatLoading.css';

function ChatLoading() {
  return (
    <div className="message-container bot-message">
      <div className="message-avatar">
        <Bot size={20} className="icon" color="var(--color-accent)" />
      </div>
      <div className="message-content loading-content">
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}

export default ChatLoading;