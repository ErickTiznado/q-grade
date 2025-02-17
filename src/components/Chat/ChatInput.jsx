// ChatInput.jsx
import React, { useRef, useState } from 'react';
import { Send, Paperclip, CodeIcon, Brain, Palette, X, ChevronUp, ChevronDown } from 'lucide-react';
import './ChatInput.css';

export function ChatInput({
  message,
  setMessage,
  onSend,
  onKeyPress,
  isLoading,
  onModelChange,
  isReasoningModel,
  files,
  setFiles,
  toggleEditor = () => {},
  onFileLoad = () => {} // Nueva prop para notificar el contenido leído del archivo
}) {
  const fileInputRef = useRef(null);
  const [filesPanelVisible, setFilesPanelVisible] = useState(true);

  // MIME types permitidos
  const allowedMimeTypes = [
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

  // Extensiones permitidas para archivos de código
  const allowedExtensions = ['.css', '.html', '.js', '.jsx', '.ts', '.tsx', '.py', '.c', '.cs'];

  // Función para leer el contenido del archivo usando FileReader (para archivos de código)
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
      .filter(file => {
         const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
         return allowedMimeTypes.includes(file.type) || allowedExtensions.includes(extension);
      })
      .map(file => ({ file, active: true }));
      
    console.log("handleFileChange - Archivos seleccionados:", selectedFiles);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      // Si el archivo es de código (por extensión), leemos su contenido y lo notificamos
      selectedFiles.forEach(async (item) => {
        const extension = item.file.name.substring(item.file.name.lastIndexOf(".")).toLowerCase();
        if (allowedExtensions.includes(extension)) {
          try {
            const content = await readFileContent(item.file);
            console.log(`Contenido leído de ${item.file.name}:`, content);
            onFileLoad(content); // Notificamos al componente padre con el contenido del archivo
          } catch (error) {
            console.error(`Error leyendo ${item.file.name}:`, error);
          }
        }
      });
    } else {
      alert('Solo se permiten archivos PDF, Word, Excel, TXT y archivos de código (CSS, HTML, JS, JSX, TS, TSX, PY, C, C#).');
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
            {/* Botón del CodeIcon que activa el EditorUI */}
            <button 
              className="input-action" 
              aria-label="Mostrar/Ocultar editor de código"
              type="button"
              onClick={toggleEditor}
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
              aria-label="Alternar modo análisis"
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
            onClick={onSend}
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
