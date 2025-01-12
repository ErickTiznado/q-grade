import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header({ onOpenModal }) {
  return (
    <header className="header">
      {/* Tooltip para el nivel */}
      <div className="tooltip">
        <div className="level-label hover-bounce" data-anim="pulse-on-hover">
          Nivel 1
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

      {/* Ícono de usuario que al hacer clic abre el modal */}
      <div
        className="user-icon hover-bounce"
        data-anim="pulse-on-hover"
        onClick={onOpenModal}
      >
        <FontAwesomeIcon icon="user-circle" />
      </div>
    </header>
  );
}

export default Header;
