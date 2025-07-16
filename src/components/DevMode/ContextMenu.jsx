// ContextMenu.jsx
import React, { useEffect, useRef } from 'react';
import { Lightbulb, MessageSquare, X } from 'lucide-react';
import './ContextMenu.css';

const ContextMenu = ({ x, y, onOptionSelect, onClose }) => {
  const menuRef = useRef(null);

  const options = [
    { 
      label: 'Mejorar selección', 
      value: 'improve',
      icon: <Lightbulb size={14} />,
      description: 'Optimizar código seleccionado'
    },
    { 
      label: 'Explicar código', 
      value: 'explain',
      icon: <MessageSquare size={14} />,
      description: 'Obtener explicación detallada'
    },
    { 
      label: 'Cancelar', 
      value: 'cancel',
      icon: <X size={14} />,
      description: 'Cerrar menú'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Ajustar posición para evitar que se salga de la pantalla
  const adjustPosition = () => {
    if (!menuRef.current) return { top: y, left: x };
    
    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    // Ajustar horizontalmente
    if (x + rect.width > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 10;
    }
    
    // Ajustar verticalmente
    if (y + rect.height > viewportHeight) {
      adjustedY = y - rect.height;
    }
    
    return { top: adjustedY, left: adjustedX };
  };

  return (
    <div 
      ref={menuRef}
      className="editor__context-menu" 
      style={adjustPosition()}
    >
      <ul className="editor__context-menu-list">
        {options.map((option, index) => (
          <li 
            key={option.value} 
            className={`editor__context-menu-item ${option.value === 'cancel' ? 'editor__context-menu-item--danger' : ''}`}
            onClick={() => onOptionSelect(option.value)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOptionSelect(option.value);
              }
            }}
          >
            <div className="editor__context-menu-icon">
              {option.icon}
            </div>
            <div className="editor__context-menu-content">
              <span className="editor__context-menu-label">{option.label}</span>
              <span className="editor__context-menu-description">{option.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
