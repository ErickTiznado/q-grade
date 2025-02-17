// EditorToolbar.jsx
import React from 'react';
import { Search, Pencil, Eye, EyeOff, Save, GitCompare } from 'lucide-react';
import './EditorToolbar.css';

const EditorToolbar = ({
  onAnalyze = () => {},
  onApplySuggestions = () => {},
  onToggleAnnotations = () => {},
  onSave = () => {},
  onDiff = () => {},
  annotationsVisible = false,
  language,
  onLanguageChange = () => {}
}) => {
  return (
    <div className="editor-toolbar">
      <button className="toolbar-button" onClick={onAnalyze} title="Analizar código">
        <Search size={20} />
      </button>
      <button className="toolbar-button" onClick={onApplySuggestions} title="Aplicar sugerencias">
        <Pencil size={20} />
      </button>
      <button className="toolbar-button" onClick={onToggleAnnotations} title="Mostrar/Ocultar anotaciones">
        {annotationsVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      <button className="toolbar-button" onClick={onSave} title="Guardar código">
        <Save size={20} />
      </button>
      <button className="toolbar-button" onClick={onDiff} title="Comparar versiones">
        <GitCompare size={20} />
      </button>
      {/* Dropdown para seleccionar el lenguaje */}
      <select
        className="toolbar-language-select"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="csharp">C#</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="json">JSON</option>
        <option value="plaintext">Plain Text</option>
      </select>
    </div>
  );
};

export default EditorToolbar;
