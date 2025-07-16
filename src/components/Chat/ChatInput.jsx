// ChatInput.jsx - Optimizado para UX/UI con nuevo sistema de documentos
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Send, Paperclip, CodeIcon, Brain, Palette, X, ChevronUp, ChevronDown, FileText } from 'lucide-react';
import DocumentPanel from './DocumentPanel';
import { useDocuments } from './useDocuments';
import './ChatInput.css';

export function ChatInput({
  message,
  setMessage,
  onSend,
  onKeyPress,
  isLoading,
  onModelChange,
  isReasoningModel,
  toggleEditor = () => {},
  onFileLoad = () => {}
}) {
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDocumentPanel, setShowDocumentPanel] = useState(false);

  // Usar el hook de documentos
  const {
    documents,
    isLoading: documentsLoading,
    addDocument,
    addMultipleDocuments,
    toggleDocument,
    removeDocument,
    getActiveContent,
    getStats
  } = useDocuments();

  // Límite de caracteres para evitar problemas de rendimiento
  const MAX_CHARS = 2000;

  // MIME types y extensiones permitidas (organizadas para claridad)
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

  const allowedExtensions = ['.css', '.html', '.js', '.jsx', '.ts', '.tsx', '.py', '.c', '.cs'];

  // Actualizar contador de caracteres
  useEffect(() => {
    setCharCount(message?.length || 0);
  }, [message]);

  // Obtener estadísticas de documentos
  const stats = getStats();

  // Manejar adición de documentos
  const handleDocumentAdd = useCallback(async (file) => {
    try {
      await addDocument(file);
      // Notificar éxito (podrías agregar un toast aquí)
    } catch (error) {
      console.error('Error al agregar documento:', error);
      // Notificar error (podrías agregar un toast aquí)
    }
  }, [addDocument]);

  // Manejar envío del mensaje
  const handleSend = useCallback(() => {
    if ((message?.trim() || stats.active > 0) && !isLoading) {
      // Incluir contenido de documentos activos en el mensaje
      const activeContent = getActiveContent();
      const fullMessage = activeContent ? `${activeContent}\n\n${message}` : message;
      
      onSend(fullMessage);
    }
  }, [message, isLoading, onSend, stats.active, getActiveContent]);

  // Función para manejar archivos (drag & drop y selección)
  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length > 0) {
      console.log('Intentando procesar archivos:', fileArray.map(f => f.name));
      
      try {
        const { results, errors } = await addMultipleDocuments(fileArray);
        
        console.log('Resultados:', { results, errors });
        
        if (results.length > 0) {
          console.log(`✅ ${results.length} archivo(s) procesado(s) exitosamente`);
        }
        
        if (errors.length > 0) {
          console.warn('❌ Algunos archivos no se pudieron procesar:', errors);
          // Mostrar los errores específicos
          errors.forEach(({ file, error }) => {
            console.error(`Error en ${file}: ${error}`);
          });
        }
      } catch (error) {
        console.error('Error general al procesar archivos:', error);
      }
    }
  }, [addMultipleDocuments]);

  // Función optimizada para leer archivos
  const readFileContent = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }, []);

  // Validación mejorada de archivos con feedback claro
  const validateFile = useCallback((file) => {
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const isValidType = allowedMimeTypes.includes(file.type);
    const isValidExtension = allowedExtensions.includes(extension);
    
    if (!isValidType && !isValidExtension) {
      return {
        valid: false,
        error: `Formato no soportado: ${extension || file.type}`
      };
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      return {
        valid: false,
        error: 'Archivo muy grande (máx. 10MB)'
      };
    }
    
    return { valid: true };
  }, [allowedMimeTypes, allowedExtensions]);

  // Manejo mejorado de archivos con mejor UX
  const handleFileChange = useCallback(async (e) => {
    console.log('handleFileChange triggered');
    const selectedFiles = Array.from(e.target.files);
    console.log('Archivos seleccionados:', selectedFiles.length, selectedFiles.map(f => f.name));
    
    if (selectedFiles.length > 0) {
      await handleFiles(selectedFiles);
    }
    
    // Limpiar input
    if (e.target) {
      e.target.value = '';
    }
  }, [handleFiles]);

  // Funciones de manejo optimizadas
  const handleAttachClick = useCallback(() => {
    console.log('handleAttachClick called');
    console.log('fileInputRef.current:', fileInputRef.current);
    fileInputRef.current?.click();
  }, []);

  const handleDocumentManagerToggle = useCallback(() => {
    setShowDocumentPanel(true);
  }, []);

  const handleReasonerToggle = useCallback(() => {
    const newMode = isReasoningModel ? 'standard' : 'reasoning';
    onModelChange(newMode);
    
    // Feedback auditivo opcional para usuarios con discapacidad visual
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Modo ${newMode === 'reasoning' ? 'análisis' : 'estándar'} activado`
      );
      utterance.volume = 0.3;
      speechSynthesis.speak(utterance);
    }
  }, [isReasoningModel, onModelChange]);

  // Manejo mejorado de teclado
  const handleKeyDown = useCallback((e) => {
    // Enviar con Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (message?.trim() || documents.length > 0) {
        onSend();
      }
      return;
    }
    
    // Toggle DocumentManager con Alt + D
    if (e.altKey && e.key === 'd' && documents.length > 0) {
      e.preventDefault();
      setShowDocumentPanel(!showDocumentPanel);
      return;
    }
    
    // Limitar caracteres
    if (message?.length >= MAX_CHARS && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      return;
    }
    
    // Pasar evento al handler original
    onKeyPress?.(e);
  }, [message, documents, onSend, onKeyPress, MAX_CHARS, showDocumentPanel]);

  // Drag and drop mejorado
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [handleFiles]);

  // Enfocar input al hacer clic en el wrapper (mejora UX)
  const handleWrapperClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <>
      <div 
        className="input-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="input-container">
          <div 
            className={`input-wrapper ${isDragOver ? 'drag-over' : ''}`}
            onClick={handleWrapperClick}
            role="textbox"
            aria-label="Área de escritura de mensajes"
          >
            <div className="input-actions" role="toolbar" aria-label="Herramientas de chat">
              {/* Botón del Editor de Código */}
              <button 
                className="input-action" 
                aria-label="Abrir editor de código (Alt+C)"
                type="button"
                onClick={toggleEditor}
                title="Abrir editor de código"
                tabIndex={0}
              >
                <CodeIcon size={20} />
              </button>
              {/* Botón de Documentos */}
              <button 
                className={`input-action ${stats.total > 0 ? 'active-model' : ''}`}
                aria-label="Gestionar documentos"
                type="button"
                onClick={handleDocumentManagerToggle}
                title="Gestionar documentos"
                tabIndex={0}
              >
                <FileText size={20} />
                {stats.total > 0 && (
                  <span className="file-count-badge">{stats.active}</span>
                )}
              </button>

              {/* Botón de Adjuntar Archivos */}
              <button 
                className={`input-action ${documentsLoading ? 'loading' : ''}`}
                aria-label="Adjuntar archivos (Alt+A)"
                type="button"
                onClick={handleAttachClick}
                title="Adjuntar archivos de texto y código"
                tabIndex={0}
                disabled={documentsLoading}
              >
                {documentsLoading ? (
                  <div className="loader-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                ) : (
                  <Paperclip size={20} />
                )}
              </button>

              {/* Botón de Modo de Razonamiento */}
              <button 
                className={`input-action ${isReasoningModel ? 'active-model' : ''}`}
                aria-label={`Modo ${isReasoningModel ? 'análisis activo' : 'estándar'}. Presiona para ${isReasoningModel ? 'desactivar' : 'activar'} análisis avanzado`}
                aria-pressed={isReasoningModel}
                type="button"
                onClick={handleReasonerToggle}
                title={`Modo ${isReasoningModel ? 'análisis' : 'estándar'}`}
                tabIndex={0}
              >
                <Brain 
                  size={20}
                  strokeWidth={isReasoningModel ? 2.5 : 1.8}
                  className={isReasoningModel ? 'text-accent' : ''}
                />
                {isReasoningModel && <div className="active-dot" aria-hidden="true" />}
              </button>

              {/* Botón de Personalización */}
              <button 
                className="input-action" 
                aria-label="Personalizar tema y apariencia (Alt+T)"
                type="button"
                title="Personalizar tema"
                tabIndex={0}
                disabled={true} // Temporalmente deshabilitado
              >
                <Palette size={20} />
              </button>
            </div>

            {/* Input de archivo oculto con mejor accesibilidad */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              multiple
              accept=".txt,.md,.js,.jsx,.ts,.tsx,.py,.css,.html,.json,.xml,.sql,.php,.c,.cpp,.cs,.java"
              aria-label="Seleccionar archivos para adjuntar"
            />

            {/* Campo de entrada principal */}
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Escribe tu mensaje... (${charCount}/${MAX_CHARS} caracteres)`}
              className="input-field"
              disabled={isLoading}
              maxLength={MAX_CHARS}
              aria-label="Escribir mensaje"
              aria-describedby="char-counter send-help"
              autoComplete="off"
              spellCheck="true"
            />

            {/* Botón de Envío */}
            <button
              className="input-send"
              onClick={handleSend}
              disabled={isLoading || (!message?.trim() && stats.active === 0)}
              aria-label={
                isLoading 
                  ? "Enviando mensaje..." 
                  : `Enviar mensaje${message?.trim() ? ` "${message.slice(0, 30)}${message.length > 30 ? '...' : ''}"` : ''}`
              }
              title={isLoading ? "Enviando..." : "Enviar mensaje (Ctrl+Enter)"}
              type="submit"
            >
              {isLoading ? (
                <div className="loader-dots" aria-label="Cargando">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          {/* Información de ayuda oculta para lectores de pantalla */}
          <div id="send-help" className="sr-only">
            Presiona Ctrl+Enter para enviar el mensaje rápidamente
          </div>
          <div id="char-counter" className="sr-only" aria-live="polite">
            {charCount} de {MAX_CHARS} caracteres utilizados
          </div>
          {stats.total > 0 && (
            <div id="document-manager-help" className="sr-only">
              Presiona Alt+D para gestionar documentos adjuntos
            </div>
          )}
        </div>
      </div>

      {/* Panel de Documentos */}
      <DocumentPanel 
        isOpen={showDocumentPanel}
        onClose={() => setShowDocumentPanel(false)}
        documents={documents}
        onDocumentToggle={toggleDocument}
        onDocumentRemove={removeDocument}
        onDocumentAdd={handleDocumentAdd}
        maxDocuments={10}
      />
    </>
  );
}

export default ChatInput;
