// DocumentPanel.jsx - Sistema de documentos estilo ChatGPT
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FileText, 
  X, 
  Eye, 
  EyeOff, 
  Upload, 
  Search, 
  Filter,
  MoreVertical,
  Download,
  Copy,
  Trash2,
  File,
  FileCode,
  FileImage,
  ChevronDown,
  ChevronRight,
  Paperclip
} from 'lucide-react';
import './DocumentPanel.css';

const DocumentPanel = ({ 
  isOpen, 
  onClose, 
  documents = [], 
  onDocumentToggle, 
  onDocumentRemove,
  onDocumentAdd,
  onDocumentPreview,
  maxDocuments = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [expandedDocs, setExpandedDocs] = useState(new Set());
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const panelRef = useRef(null);

  // Función para obtener el tipo de archivo por extensión
  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const typeMap = {
      'txt': 'Texto',
      'md': 'Markdown',
      'js': 'JavaScript',
      'jsx': 'React JSX',
      'ts': 'TypeScript',
      'tsx': 'React TSX',
      'py': 'Python',
      'css': 'CSS',
      'html': 'HTML',
      'json': 'JSON',
      'xml': 'XML',
      'sql': 'SQL',
      'php': 'PHP',
      'c': 'C',
      'cpp': 'C++',
      'cs': 'C#',
      'java': 'Java'
    };
    return typeMap[extension] || 'Archivo';
  };

  // Filtrar documentos según búsqueda y filtro
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && doc.active) ||
                         (filter === 'inactive' && !doc.active);
    
    return matchesSearch && matchesFilter;
  });

  // Estadísticas
  const activeCount = documents.filter(doc => doc.active).length;
  const totalTokens = documents.reduce((sum, doc) => sum + (doc.tokens || 0), 0);

  // Manejar drag & drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!panelRef.current?.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => onDocumentAdd(file));
  }, [onDocumentAdd]);

  // Expansión/colapso de documentos
  const toggleExpanded = (docId) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocs(newExpanded);
  };

  // Selección múltiple
  const toggleSelected = (docId) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  // Acciones masivas
  const handleBulkAction = (action) => {
    selectedDocs.forEach(docId => {
      const docIndex = documents.findIndex(doc => doc.id === docId);
      if (docIndex !== -1) {
        if (action === 'toggle') {
          onDocumentToggle(docIndex);
        } else if (action === 'remove') {
          onDocumentRemove(docIndex);
        }
      }
    });
    setSelectedDocs(new Set());
  };

  // Obtener icono según tipo de archivo
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'css', 'html'].includes(ext)) {
      return <FileCode className="file-icon code" />;
    }
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
      return <FileImage className="file-icon image" />;
    }
    return <FileText className="file-icon document" />;
  };

  // Cerrar panel con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="document-panel-overlay" onClick={onClose}>
      <div 
        className={`document-panel ${dragOver ? 'drag-over' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        ref={panelRef}
      >
        {/* Header */}
        <div className="document-panel-header">
          <div className="header-title">
            <Paperclip className="header-icon" />
            <h2>Documentos</h2>
            <span className="document-count">
              {activeCount}/{documents.length}
            </span>
          </div>
          
          <div className="header-actions">
            <button 
              className="icon-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Subir archivo"
            >
              <Upload />
            </button>
            <button 
              className="icon-btn"
              onClick={onClose}
              title="Cerrar"
            >
              <X />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="document-stats">
          <div className="stat">
            <span className="stat-label">Activos:</span>
            <span className="stat-value">{activeCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{documents.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Tokens:</span>
            <span className="stat-value">{totalTokens.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Límite:</span>
            <span className="stat-value">{maxDocuments}</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="document-controls">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <Filter className="filter-icon" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDocs.size > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              {selectedDocs.size} seleccionados
            </span>
            <div className="bulk-buttons">
              <button 
                onClick={() => handleBulkAction('toggle')}
                className="bulk-btn"
              >
                Alternar
              </button>
              <button 
                onClick={() => handleBulkAction('remove')}
                className="bulk-btn danger"
              >
                Eliminar
              </button>
              <button 
                onClick={() => setSelectedDocs(new Set())}
                className="bulk-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Document List */}
        <div className="document-list">
          {filteredDocuments.length === 0 ? (
            <div className="empty-state">
              {documents.length === 0 ? (
                <>
                  <Upload className="empty-icon" />
                  <p>No hay documentos</p>
                  <p className="empty-subtitle">
                    Arrastra archivos aquí o haz clic en subir
                  </p>
                  <button 
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload />
                    Subir archivo
                  </button>
                </>
              ) : (
                <>
                  <Search className="empty-icon" />
                  <p>No se encontraron documentos</p>
                  <p className="empty-subtitle">
                    Intenta con otros términos de búsqueda
                  </p>
                </>
              )}
            </div>
          ) : (
            filteredDocuments.map((doc, index) => {
              const originalIndex = documents.findIndex(d => d.id === doc.id);
              const isExpanded = expandedDocs.has(doc.id);
              const isSelected = selectedDocs.has(doc.id);
              
              return (
                <div 
                  key={doc.id || index}
                  className={`document-item ${doc.active ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                >
                  <div className="document-header">
                    <div className="document-info">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(doc.id)}
                        className="document-checkbox"
                      />
                      
                      <button
                        onClick={() => toggleExpanded(doc.id)}
                        className="expand-btn"
                      >
                        {isExpanded ? <ChevronDown /> : <ChevronRight />}
                      </button>
                      
                      {getFileIcon(doc.name)}
                      
                      <div className="document-details">
                        <span className="document-name" title={doc.name}>
                          {doc.name}
                        </span>
                        <div className="document-meta">
                          <span className="document-size">
                            {doc.size ? `${(doc.size / 1024).toFixed(1)}KB` : 'N/A'}
                          </span>
                          <span className="document-tokens">
                            {doc.tokens || 0} tokens
                          </span>
                          <span className="document-type">
                            {doc.type || getFileType(doc.name)}
                          </span>
                          {doc.lastModified && (
                            <span className="document-date">
                              {new Date(doc.lastModified).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                          {doc.addedAt && (
                            <span className="document-added">
                              Agregado: {new Date(doc.addedAt).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                        <div className="document-stats">
                          <span className="document-lines">
                            {doc.content ? `${doc.content.split('\n').length} líneas` : '0 líneas'}
                          </span>
                          <span className="document-chars">
                            {doc.content ? `${doc.content.length} caracteres` : '0 caracteres'}
                          </span>
                          <span className="document-status">
                            {doc.active ? '✓ Activo' : '○ Inactivo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="document-actions">
                      <button
                        onClick={() => onDocumentToggle(originalIndex)}
                        className={`toggle-btn ${doc.active ? 'active' : ''}`}
                        title={doc.active ? 'Desactivar' : 'Activar'}
                      >
                        {doc.active ? <Eye /> : <EyeOff />}
                      </button>
                      
                      <div className="dropdown">
                        <button className="dropdown-trigger">
                          <MoreVertical />
                        </button>
                        <div className="dropdown-menu">
                          <button 
                            onClick={() => onDocumentPreview?.(doc)}
                            className="dropdown-item"
                          >
                            <Eye />
                            Vista previa
                          </button>
                          <button 
                            onClick={() => navigator.clipboard.writeText(doc.content)}
                            className="dropdown-item"
                          >
                            <Copy />
                            Copiar contenido
                          </button>
                          <button className="dropdown-item">
                            <Download />
                            Descargar
                          </button>
                          <hr className="dropdown-divider" />
                          <button 
                            onClick={() => onDocumentRemove(originalIndex)}
                            className="dropdown-item danger"
                          >
                            <Trash2 />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="document-preview">
                      <div className="preview-header">
                        <h4>Vista previa del contenido</h4>
                        <div className="preview-stats">
                          <span>Primeras {Math.min(500, doc.content.length)} de {doc.content.length} caracteres</span>
                        </div>
                      </div>
                      <div className="preview-content">
                        <pre>{doc.content.substring(0, 500)}</pre>
                        {doc.content.length > 500 && (
                          <div className="preview-truncated">
                            <span>... y {doc.content.length - 500} caracteres más</span>
                            <button 
                              onClick={() => onDocumentPreview?.(doc)}
                              className="view-full-btn"
                            >
                              Ver completo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drag Overlay */}
        {dragOver && (
          <div className="drag-overlay">
            <div className="drag-content">
              <Upload className="drag-icon" />
              <p>Suelta los archivos aquí</p>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => {
            Array.from(e.target.files).forEach(file => onDocumentAdd(file));
            e.target.value = '';
          }}
          style={{ display: 'none' }}
          accept=".txt,.md,.pdf,.doc,.docx,.json,.js,.jsx,.ts,.tsx,.py,.css,.html"
        />
      </div>
    </div>,
    document.body
  );
};

export default DocumentPanel;
