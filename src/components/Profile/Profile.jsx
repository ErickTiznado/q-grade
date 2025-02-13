import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faMedal, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./Profile.css";

export default function Profile() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="profile-container"
    >
      <button className="profile-button">
        <FontAwesomeIcon icon={faUser} className="icon user-icon" />
        <span>Ajustes del perfil</span>
      </button>

      <button className="profile-button">
        <FontAwesomeIcon icon={faMedal} className="icon medal-icon" />
        <span>Estadísticas de aprendizaje</span>
      </button>

      <button className="profile-button logout">
        <FontAwesomeIcon icon={faRightFromBracket} className="icon logout-icon" />
        <span>Cerrar sesión</span>
      </button>
    </motion.div>
  );
}
