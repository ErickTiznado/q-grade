// ContextMenu.jsx
import React from 'react';
import './ContextMenu.css';

const ContextMenu = ({ x, y, onOptionSelect, onClose }) => {
  const options = [
    { label: 'Mejorar selección', value: 'improve' },
    { label: 'Explicar código', value: 'explain' },
    { label: 'Cancelar', value: 'cancel' }
  ];

  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      <ul>
        {options.map((option) => (
          <li key={option.value} onClick={() => onOptionSelect(option.value)}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
