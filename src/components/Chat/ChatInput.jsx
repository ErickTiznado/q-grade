// ChatInput.jsx
import React, { useRef, useState } from 'react';
import { 
  Send, 
  Paperclip, 
  CodeIcon, 
  Brain, 
  Palette,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import './ChatInput.css';

export function ChatInput({
  message,
  setMessage,
  onSend,
  onKeyPress,
  isLoading,
  onModelChange,
  isReasoningModel,
  files,      // estado levantado desde App.jsx
  setFiles    // setter levantado desde App.jsx
}) {
  const fileInputRef = useRef(null);
  
  // Para mostrar/ocultar el panel de archivos, mantenemos este estado local
  const [filesPanelVisible, setFilesPanelVisible] = useState(true);
  
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/x-python',
    'application/json',
    'text/javascript',
    'text/html',
    'text/css'
  ];

  // Manejador para seleccionar archivos
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
      .filter(file => allowedFileTypes.includes(file.type))
      .map(file => ({ file, active: true }));
    console.log("handleFileChange - Archivos seleccionados:", selectedFiles);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    } else {
      alert('Solo se permiten archivos PDF, Word, Excel, TXT y archivos de código.');
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    console.log("handleRemoveFile - Nuevos archivos:", newFiles);
    setFiles(newFiles);
  };

  const toggleActive = (index) => {
    const newFiles = files.map((item, i) =>
      i === index ? { ...item, active: !item.active } : item
    );
    console.log("toggleActive - Archivos actualizados:", newFiles);
    setFiles(newFiles);
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleReasonerToggle = () => {
    const newMode = isReasoningModel ? 'standard' : 'reasoning';
    console.log("handleReasonerToggle - Nuevo modo:", newMode);
    onModelChange(newMode);
  };

  const toggleFilesPanel = () => {
    setFilesPanelVisible(prev => !prev);
  };

  return (
    <div className="input-area">
      <div className="input-container">
        {/* Panel de archivos colapsable */}
        {files.length > 0 && (
          <div className="files-panel">
            <div className="files-panel-toggle" onClick={toggleFilesPanel}>
              <span>Documentos Adjuntos</span>
              {filesPanelVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {filesPanelVisible && (
              <div className="file-preview">
                {files.map((item, index) => (
                  <div key={index} className="file-item">
                    <span className="file-name">{item.file.name}</span>
                    {item.tokens && <span className="file-tokens">Tokens: {item.tokens}</span>}
                    <div className="file-actions">
                      <button 
                        className={`file-toggle ${item.active ? 'active' : ''}`}
                        onClick={() => toggleActive(index)}
                        aria-label={item.active ? "Desmarcar documento" : "Marcar documento"}
                      >
                        {item.active ? 'Activo' : 'Inactivo'}
                      </button>
                      <button 
                        className="file-remove" 
                        onClick={() => handleRemoveFile(index)}
                        aria-label="Eliminar archivo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="input-wrapper">
          <div className="input-actions">
            <button 
              className="input-action" 
              aria-label="Insertar código"
              type="button"
            >
              <CodeIcon size={20} />
            </button>
            
            <button 
              className="input-action" 
              aria-label="Adjuntar archivo"
              type="button"
              onClick={handleAttachClick}
            >
              <Paperclip size={20} />
            </button>

            <button 
              className={`input-action ${isReasoningModel ? 'active-model' : ''}`}
              aria-label="Modo análisis"
              type="button"
              onClick={handleReasonerToggle}
            >
              <Brain 
                size={20}
                strokeWidth={isReasoningModel ? 2.5 : 1.8}
                className={isReasoningModel ? 'text-accent' : ''}
              />
              {isReasoningModel && <div className="active-dot" />}
            </button>

            <button 
              className="input-action" 
              aria-label="Personalizar tema"
              type="button"
            >
              <Palette size={20} />
            </button>
          </div>

          {/* Input de archivo oculto */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="Escribe tu mensaje..."
            className="input-field"
            disabled={isLoading}
          />

          <button
            className="input-send"
            onClick={onSend} // Llama a onSend sin parámetros; el estado de archivos ya se levantó
            disabled={isLoading || (!message?.trim() && files.length === 0)}
            aria-label={isLoading ? "Enviando mensaje" : "Enviar"}
          >
            {isLoading ? (
              <div className="loader-dots">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
