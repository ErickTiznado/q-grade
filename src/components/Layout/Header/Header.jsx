import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header({ onOpenModal, chatName }) {
  return (
    <header className="header">
      <div className="container">
        {/* Nombre del Chat */}
        <div className="chat-name">
          <h3>{chatName || "QGrade"}</h3> {/* Nombre dinámico o valor predeterminado */}
        </div>

        {/* Contenedor de progreso */}
        <div className="progres-container">
          <div className="tooltip">
            <div className="level-label hover-bounce" data-anim="pulse-on-hover">
              Nivel Básico
            </div>
            <div className="tooltiptext">
              ¡Estás en el Nivel 1! Completa más lecciones para avanzar.
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="chart progress-slide-in">
            <div className="bar" id="progressBar"></div>
            <span id="value1">100</span>
          </div>
        </div>

        {/* Contenedor de íconos */}
        <div className="icon-container">
          {/* Ícono de usuario */}
          <div
            className="user-icon hover-bounce"
            data-anim="pulse-on-hover"
            onClick={onOpenModal}
          >
            <FontAwesomeIcon icon="user-circle" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
