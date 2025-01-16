import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBox from './ChatBox';
import Men from './Men'; // Importa tu componente Men.jsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatBox />} />
        <Route path="/men" element={<Men />} />
      </Routes>
    </Router>
  );
}

export default App;
