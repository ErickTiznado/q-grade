import React, { useState, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  CodeIcon, 
  Brain, 
  Palette,
  Loader2,
  X 
} from 'lucide-react';
import './ChatInput.css';

export function ChatInput({
  message,
  setMessage,
  onSend,
  onKeyPress,
  isLoading,
  onModelChange,
  isReasoningModel
}) {
  const [files, setFiles] = useState([]); // Estado para almacenar los archivos
  const fileInputRef = useRef(null); // Referencia al input de archivo oculto

  // Tipos de archivo permitidos
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
    const selectedFiles = Array.from(e.target.files).filter(file => 
      allowedFileTypes.includes(file.type)
    );

    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    } else {
      alert('Solo se permiten archivos PDF, Word, Excel, TXT y archivos de código.');
    }
  };

  // Manejador para eliminar un archivo
  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  // Manejador para abrir el selector de archivos
  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="input-area">
      <div className="input-container">
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
              onClick={() => onModelChange('reasoning')}
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
            multiple // Permite seleccionar varios archivos
          />

          {/* Mostrar archivos seleccionados */}
          {files.length > 0 && (
            <div className="file-preview">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <span>{file.name}</span>
                  <button 
                    className="file-remove" 
                    onClick={() => handleRemoveFile(index)}
                    aria-label="Eliminar archivo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

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
            onClick={() => onSend(files)} // Pasar archivos al enviar
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