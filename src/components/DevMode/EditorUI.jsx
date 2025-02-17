// EditorUI.jsx
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import EditorToolbar from "./EditorToolbar";
import MonacoEditorUI from "./MonacoEditorUI";
import ContextMenu from "./ContextMenu";
import "./EditorUI.css";

const EditorUI = ({ code, setCode, language, onLanguageChange, annotationsVisible }) => {
  const [contextMenuData, setContextMenuData] = useState(null);

  // Callback que se dispara cuando se termina una selección en el editor
  const handleSelection = (coords, selection, selectedText) => {
    // Guarda la posición y datos de la selección
    setContextMenuData({
      x: coords.x,
      y: coords.y,
      selection,
      text: selectedText,
    });
  };

  // Función para encapsular la selección en etiquetas especiales para mejorarla
  const improveSelection = () => {
    if (contextMenuData && contextMenuData.text) {
      const improvedText = `<CODIGO_SELECCIONADO>\n${contextMenuData.text}\n</CODIGO_SELECCIONADO>`;
      // Nota: Este reemplazo es simple; en una implementación robusta se usaría la API de Monaco para editar el rango exacto.
      const newCode = code.replace(contextMenuData.text, improvedText);
      setCode(newCode);
    }
    setContextMenuData(null);
  };

  // Función para encapsular la selección para explicar el código
  const explainSelection = () => {
    if (contextMenuData && contextMenuData.text) {
      const explainedText = `<CODIGO_EXPLICADO>\n${contextMenuData.text}\n</CODIGO_EXPLICADO>`;
      const newCode = code.replace(contextMenuData.text, explainedText);
      setCode(newCode);
    }
    setContextMenuData(null);
  };

  return (
    <div className="editor-ui-container">
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: "100%",
          height: "100%",
        }}
        minWidth={300}
        minHeight={200}
        bounds="parent"
        dragHandleClassName="editor-navbar"
        className="floating-window"
      >
        <div className="editor-container">
          <div className="editor-navbar">
            <EditorToolbar 
              onAnalyze={() => console.log("Analizando el código:", code)}
              onApplySuggestions={() => console.log("Aplicando sugerencias...")}
              onToggleAnnotations={() => console.log("Alternando anotaciones...")}
              onSave={() => console.log("Guardando el código...")}
              onDiff={() => console.log("Comparando versiones...")}
              annotationsVisible={annotationsVisible}
              language={language}
              onLanguageChange={onLanguageChange}
            />
          </div>
          <div className="editor-content">
            <MonacoEditorUI 
              value={code}
              onCodeChange={setCode}
              language={language}
              onSelection={handleSelection}
              decorations={[]}
            />
          </div>
        </div>
      </Rnd>
      {contextMenuData && (
        <ContextMenu
          x={contextMenuData.x}
          y={contextMenuData.y}
          onOptionSelect={(option) => {
            if (option === "improve") {
              improveSelection();
            } else if (option === "explain") {
              explainSelection();
            } else {
              setContextMenuData(null);
            }
          }}
          onClose={() => setContextMenuData(null)}
        />
      )}
    </div>
  );
};

export default EditorUI;
