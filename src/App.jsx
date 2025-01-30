import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login'; // Importa Login desde la carpeta Login
import Register from './components/Login/Register'; // Importa Register desde la misma carpeta

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Otras rutas necesarias */}
      </Routes>
    </Router>
  );
}

export default App;
