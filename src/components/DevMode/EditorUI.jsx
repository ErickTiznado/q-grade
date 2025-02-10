import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faCopy } from "@fortawesome/free-solid-svg-icons"; 
import "./EditorUI.css"; 
import ChatInput from "../Chat/ChatInput"; 
import Sidebar from "../Layout/Sidebar/Sidebar"; // 🔥 Importamos Sidebar sin modificarlo
import rotateIcon from "/src/assets/Vector.svg"; 
import arrowRightIcon from "/src/assets/siguiente.svg"; 
import starIcon from "/src/assets/star.svg";
import gearIcon from "/src/assets/imagen.svg";

const EditorUI = () => {
    const [text, setText] = useState("");

    const handleInput = (e) => {
      setText(e.target.value);
      e.target.style.height = "auto"; 
      e.target.style.height = e.target.scrollHeight + "px"; 
    };

    return (
      <div className="app-container"> {/* 🔥 Contenedor principal */}
        <Sidebar /> {/* 🔥 Sidebar se mantiene sin cambios */}

        <div className="editor-wrapper"> {/* 🔥 Contenedor del editor */}
          <Rnd
            default={{
              x: 1070,
              y: 2,
              width: 550,
              height: 820,
            }}
            minWidth={300}
            minHeight={200}
            bounds="window"
            dragHandleClassName="toolbar"
            className="floating-window"
          >
            <div className="editor-container">
              <div className="toolbar">
                <button className="image-button1">
                  <img src={rotateIcon} alt="Rotar" />
                </button>
                <button className="image-button">
                  <img src={arrowRightIcon} alt="Flecha derecha" />
                </button>

                <div className="right-buttons">
                  <button className="image-button2">
                    <img src={starIcon} alt="Star" />
                  </button>
                  <button><FontAwesomeIcon icon={faHistory} /></button>
                  <button><FontAwesomeIcon icon={faCopy} /></button>
                  <button className="image-button3">
                    <img src={gearIcon} alt="Configuración" />
                  </button>
                </div>
              </div>

              <textarea
                className="textarea"
                placeholder="Empieza a escribir o pega tu contenido aquí..."
                value={text}
                onChange={handleInput} 
              />
            </div>
          </Rnd>

          <div className="chat-input-wrapper">
            <ChatInput text={text} setText={setText} />
          </div>
        </div>
      </div>
    );
};

export default EditorUI;
