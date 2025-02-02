import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Asegúrate de que App esté exportado correctamente

const root = ReactDOM.createRoot(document.getElementById('root'));  // O el id de tu contenedor
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
