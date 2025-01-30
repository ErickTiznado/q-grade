import React, { useState } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sidebar({ chats, onSelectChat }) {
  // Estado para controlar si la sidebar se muestra en dispositivos móviles
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar la visibilidad de la sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Función para mostrar/ocultar el menú desplegable en cada chat
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Evita que se active el evento del li
    // Se asume que el elemento dropdown es el siguiente hermano del botón de opciones
    const dropdown = e.currentTarget.parentNode.querySelector('.dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  };

  return (
    <>
      {/* Botón de menú para vista móvil */}
      <button className="menu-toggle hover-bounce" onClick={toggleSidebar}>
        <FontAwesomeIcon icon="bars" />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
        {/* Botón de cierre para móvil */}
        <button className="close-sidebar hover-bounce" onClick={toggleSidebar}>
          <FontAwesomeIcon icon="xmark" />
        </button>

        {/* LOGO */}
        <div className="logo">
          <img src="/imag/Q-Grade.svg" alt="Q-Grade Logo" />
        </div>

        {/* Historial de Chat */}
        <div className="chat-history fade-in-section">
          <h2>
            <FontAwesomeIcon icon="comments" /> Historial de Chat
          </h2>
          <ul>
            {chats.map((chat) => (
              <li
                key={chat.id}
                className="hover-scale"
                onClick={() => onSelectChat(chat.id)}
              >
                <span>{chat.name}</span>
                <span className="options" onClick={toggleDropdown}>
                  <FontAwesomeIcon icon="ellipsis-vertical" />
                </span>
                {/* Menú desplegable */}
                <div className="dropdown-menu">
                  <div className="menu-item hover-scale">
                    <FontAwesomeIcon icon="pen" /> Cambiar el nombre
                  </div>
                  <div className="menu-item delete hover-scale">
                    <FontAwesomeIcon icon="trash" /> Eliminar
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
