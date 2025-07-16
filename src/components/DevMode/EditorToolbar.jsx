// EditorToolbar.jsx
import React from 'react';
import { 
  Search, 
  Pencil, 
  Eye, 
  EyeOff, 
  Save, 
  GitCompare, 
  Code, 
  Zap,
  FileCode,
  Braces,
  FileText,
  Hash,
  Settings
} from 'lucide-react';
import './EditorToolbar.css';

const EditorToolbar = ({
  onAnalyze = () => {},
  onApplySuggestions = () => {},
  onToggleAnnotations = () => {},
  onSave = () => {},
  onDiff = () => {},
  annotationsVisible = false,
  language,
  onLanguageChange = () => {},
  isLoading = false,
  hasUnsavedChanges = false
}) => {
  
  const getLanguageIcon = (lang) => {
    switch (lang) {
      case 'javascript':
        return <FileCode size={14} />;
      case 'typescript':
        return <FileCode size={14} />;
      case 'python':
        return <FileText size={14} />;
      case 'c':
        return <Settings size={14} />;
      case 'csharp':
        return <Hash size={14} />;
      case 'html':
        return <Code size={14} />;
      case 'css':
        return <Braces size={14} />;
      case 'json':
        return <Braces size={14} />;
      case 'plaintext':
        return <FileText size={14} />;
      default:
        return <Code size={14} />;
    }
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'plaintext', label: 'Plain Text' }
  ];

  return (
    <div className="editor__toolbar">
      {/* Grupo de análisis */}
      <div className="editor__toolbar-group">
        <button 
          className={`editor__toolbar-button ${isLoading ? 'editor__toolbar-button--loading' : ''}`} 
          onClick={onAnalyze} 
          title="Analizar código con IA"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="editor__toolbar-spinner" />
          ) : (
            <Search size={16} />
          )}
        </button>
        
        <button 
          className="editor__toolbar-button" 
          onClick={onApplySuggestions} 
          title="Aplicar sugerencias automáticas"
          disabled={isLoading}
        >
          <Zap size={16} />
        </button>
      </div>

      <div className="editor__toolbar-separator" />

      {/* Grupo de visualización */}
      <div className="editor__toolbar-group">
        <button 
          className={`editor__toolbar-button ${annotationsVisible ? 'editor__toolbar-button--active' : ''}`} 
          onClick={onToggleAnnotations} 
          title={annotationsVisible ? "Ocultar anotaciones" : "Mostrar anotaciones"}
        >
          {annotationsVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        
        <button 
          className="editor__toolbar-button" 
          onClick={onDiff} 
          title="Comparar versiones"
        >
          <GitCompare size={16} />
        </button>
      </div>

      <div className="editor__toolbar-separator" />

      {/* Selector de lenguaje */}
      <div className="editor__toolbar-group">
        <div className="editor__toolbar-language-wrapper">
          <div className="editor__toolbar-language-icon">
            {getLanguageIcon(language)}
          </div>
          <select
            className="editor__toolbar-language-select"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            title="Seleccionar lenguaje de programación"
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="editor__toolbar-separator" />

      {/* Grupo de acciones */}
      <div className="editor__toolbar-group">
        <button 
          className={`editor__toolbar-button editor__toolbar-save ${hasUnsavedChanges ? 'editor__toolbar-save--modified' : ''}`} 
          onClick={onSave} 
          title={hasUnsavedChanges ? "Guardar cambios" : "Guardar código"}
        >
          <Save size={16} />
          {hasUnsavedChanges && <div className="editor__toolbar-unsaved-dot" />}
        </button>
      </div>

      {/* Indicador de estado */}
      <div className="editor__toolbar-status">
        {isLoading && (
          <div className="editor__toolbar-status-item editor__toolbar-status-item--loading">
            <div className="editor__toolbar-status-dot" />
            <span>Analizando...</span>
          </div>
        )}
        {hasUnsavedChanges && !isLoading && (
          <div className="editor__toolbar-status-item editor__toolbar-status-item--modified">
            <div className="editor__toolbar-status-dot" />
            <span>Sin guardar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;
