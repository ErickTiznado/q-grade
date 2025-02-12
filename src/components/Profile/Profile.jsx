import React from 'react';
import { FaUser, FaMedal, FaSignOutAlt } from "react-icons/fa";
import { Card } from "../UI/Card.jsx";
import { motion } from "framer-motion";

export default function Profile() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white p-6 rounded-2xl shadow-lg w-80"
    >
      <Card className="mb-[2%] cursor-pointer hover:bg-gray-100 p-2 flex items-center gap-3">
        <FaUser className="text-blue-600 text-lg" />
        <span> Ajustes del perfil</span>
      </Card>
      <Card className="mb-[2%] cursor-pointer hover:bg-gray-100 p-2 flex items-center gap-3">
        <FaMedal className="text-yellow-500 text-lg" />
        <span> Estadísticas de aprendizaje</span>
      </Card>
      <Card className="cursor-pointer hover:bg-gray-100 p-2 flex items-center gap-3 text-red-600">
        <FaSignOutAlt className="text-lg" />
        <span> Cerrar sesión</span>
      </Card>
    </motion.div>
  );
}
