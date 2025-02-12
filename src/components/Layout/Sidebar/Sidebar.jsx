import React, { useState } from 'react';
import './Sidebar.css';
import Profile from "../../Profile/Profile.jsx";
import { Logo } from '../../UI/Logo';
import { Q} from '../../UI/Q'
import { faChevronLeft, faChevronRight, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Sidebar({showSidebar, setShowSidebar}){
  const [showProfile, setShowProfile] = useState(false); // Estado para controlar si se muestra el perfil flotante

  const handleProfileClick = () => {
    setShowProfile(!showProfile); // Cambiar el estado de showProfile al hacer clic
  };

  const handleCloseProfile = () => {
    setShowProfile(false); // Cerrar el perfil al hacer clic fuera
  };
  return(
  <aside className={`sidebar ${showSidebar ? 'sidebar--expanded' : 'sidebar--collapsed' }`}>
    <header className='sidebar_header'>
    {showSidebar ? <Logo className='sidebar__logo'/> : <Q className='sidebar__logo' />}
    <button onClick={() => setShowSidebar(!showSidebar)} className='sidebar__toggle' aria-label={showSidebar ? 'Colapsar Sidebar' : 'Expandir Sidebar'}>
      
    {showSidebar ? <FontAwesomeIcon icon={faChevronLeft} color='#77ca9c' /> : <FontAwesomeIcon icon={faChevronRight} color='#77ca9c'/>}
    </button>

    </header>
    <nav className='sidebar__nav'>
      <button className='sidebar__button'>
      <FontAwesomeIcon color='#77ca9c' className={`sidebar__button-icon ${!showSidebar ? 'sidebar__button-collapsed' : ''}`} icon={faMagnifyingGlass} />
      {showSidebar && <span>Buscar</span>}
      </button>
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
          <div className='sidebar__chat-item'>
            <span>Anilisis de calidad</span>
          </div>
          <div className='sidebar__chat-item'>
            <span>Calidad en el Desarrollo</span>
            </div>
          <div className='sidebar__chat-item'><span>Que es calidad?</span></div>
          <div className='sidebar__chat-item'><span>QA</span></div>
        </div>
        <div className='sidebar__section'>
          <h5 className='sidebar__section-title'>
            <span>Ayer</span>
          </h5>
          <div className='sidebar__chat-item'><span>Metricas de Calidad</span></div>
          <div className='sidebar__chat-item'><span>Calidad vs no calidad</span></div>
          <div className='sidebar__chat-item'><span>Importancia de la calidad</span></div>
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

      {/* Mostrar el perfil flotante solo si showProfile es true */}
      {showProfile && (
        <div className='profile-overlay' onClick={handleCloseProfile}>
          <div className='profile-modal' onClick={(e) => e.stopPropagation()}>
            {/* Renderizar el componente Profile.jsx */}
            <Profile />
          </div>
        </div>
      )}
  </aside>
  );
}


export default Sidebar;