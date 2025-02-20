import React, { useState } from 'react';
import './Sidebar.css';
import Profile from "../../Profile/Profile.jsx";
import { Logo } from '../../UI/Logo';
import { Q } from '../../UI/Q';
import { faChevronLeft, faChevronRight, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Sidebar({ showSidebar, setShowSidebar }) {
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Estado para resaltar la barra de búsqueda

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <aside className={`sidebar ${showSidebar ? 'sidebar--expanded' : 'sidebar--collapsed'}`}>
      <header className='sidebar_header'>
        {showSidebar ? <Logo className='sidebar__logo' /> : <Q className='sidebar__logo' />}
        <button onClick={() => setShowSidebar(!showSidebar)} className='sidebar__toggle' aria-label={showSidebar ? 'Colapsar Sidebar' : 'Expandir Sidebar'}>
          {showSidebar ? <FontAwesomeIcon icon={faChevronLeft} color='#77ca9c' /> : <FontAwesomeIcon icon={faChevronRight} color='#77ca9c' />}
        </button>
      </header>

      <nav className='sidebar__nav'>
        <div className={`sidebar__search ${isSearchFocused ? 'sidebar__search--focused' : ''}`}>
        <FontAwesomeIcon color='#77ca9c' className={`sidebar__button-icon ${!showSidebar ? 'sidebar__button-collapsed' : ''}`} icon={faMagnifyingGlass} />
          {showSidebar && (
            
            <input
            
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sidebar__search-input"
            />
          )}
        </div>
        <button className='sidebar__button'>
          <FontAwesomeIcon color='#77ca9c' className={`sidebar__button-icon ${!showSidebar ? 'sidebar__button-collapsed' : ''}`} icon={faPlus} />
          {showSidebar && <span>Nuevo Chat</span>}
        </button>
      </nav>

      <div className='sidebar__chats'>
        {showSidebar && (
          <>
            <div className='sidebar__section'>
              <h5 className='sidebar__section-title'>
                <span>Hoy</span>
              </h5>
              {['Análisis de calidad', 'Calidad en el Desarrollo', '¿Qué es calidad?', 'QA']
                .filter(chat => chat.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((chat, index) => (
                  <div key={index} className='sidebar__chat-item'>
                    <span>{chat}</span>
                  </div>
                ))}
            </div>


            <div className='sidebar__section'>
              <h5 className='sidebar__section-title'>
                <span>Ayer</span>
              </h5>
              {['Métricas de Calidad', 'Calidad vs No Calidad', 'Importancia de la Calidad']
                .filter(chat => chat.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((chat, index) => (
                  <div key={index} className='sidebar__chat-item'>
                    <span>{chat}</span>
                  </div>
                ))}
            </div>

            <div className='sidebar__section'>
              <h5 className='sidebar__section-title'>
                <span>7 dias anteriores</span>
              </h5>
              {[
  'Métricas de Calidad', 
  'Comparativa Calidad vs No Calidad', 
  'Importancia de la Calidad en el Desarrollo', 
  'Análisis y Evaluación de la Calidad', 
  'La Calidad en el Desarrollo de Software', 
  'Definición de Calidad', 
  'Control de Calidad (QA)', 
  'Indicadores de Calidad', 
  'Diferencias entre Calidad y No Calidad', 
  'Relevancia de la Calidad', 
  'Evaluación de la Eficiencia en Calidad', 
  'Gestión de Calidad en Proyectos', 
  'Cómo medir la Calidad en el Desarrollo', 
  'Optimización de la Calidad del Producto', 
  'Impacto de la Calidad en el Producto Final', 
  'Estrategias de Mejora Continua en Calidad', 
  'Importancia del Control de Calidad', 
  'Cultura de Calidad en el Equipo', 
  'Calidad vs Eficiencia: ¿Cuál es la prioridad?', 
  'El Ciclo de Vida de la Calidad en el Desarrollo', 
  'Mejorando la Calidad a través de la Retroalimentación', 
  'Herramientas para Medir la Calidad', 
  'Técnicas para Evaluar la Calidad en Software', 
  'Integrando la Calidad en el Ciclo de Desarrollo Ágil', 
  'Principios Fundamentales de la Calidad en Software', 
  'La Calidad como Factor de Éxito en Proyectos', 
  'Auditoría y Verificación de Calidad', 
  'Estándares Internacionales de Calidad', 
  'Aseguramiento de Calidad en el Desarrollo', 
  'Riesgos por No Implementar Buenas Prácticas de Calidad', 
  'Benchmarking de Calidad en el Mercado', 
  'Cómo la Calidad Impulsa la Innovación', 
  'El Rol del QA en el Ciclo de Desarrollo Ágil', 
  'La Relación Entre Calidad y Productividad', 
  'Importancia de la Calidad en el Servicio al Cliente', 
  'Estrategias de Testing para Garantizar la Calidad'
]

                .filter(chat => chat.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((chat, index) => (
                  <div key={index} className='sidebar__chat-item'>
                    <span>{chat}</span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      <footer className='sidebar__footer'>
        <button className='sidebar__button' onClick={handleProfileClick}>
          <FontAwesomeIcon color='#77ca9c' className={`sidebar__button-icon ${!showSidebar ? 'sidebar__button-collapsed' : ''}`} icon={faUser} />
          {showSidebar && <span>Perfil</span>}
        </button>
      </footer>

      {showProfile && (
        <div className='profile-overlay' onClick={handleCloseProfile}>
          <div className='profile-modal' onClick={(e) => e.stopPropagation()}>
            <Profile />
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
