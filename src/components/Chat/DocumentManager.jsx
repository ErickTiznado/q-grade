// src/components/DocumentManager.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './DocumentManager.css';

function DocumentManager({ documents, onToggleDocument, onRemoveDocument }) {
  return (
    <div className="document-manager">
      <h3>Documentos Subidos</h3>
      {documents.length === 0 ? (
        <p>No hay documentos subidos.</p>
      ) : (
        <ul className="document-list">
          {documents.map((doc, index) => (
            <li key={index} className="document-item">
              <div className="document-header">
                <span className="document-name">{doc.file.name}</span>
                <div className="document-actions">
                  <button
                    className={`toggle-btn ${doc.active ? 'active' : ''}`}
                    onClick={() => onToggleDocument(index)}
                    aria-label={doc.active ? "Desactivar documento" : "Activar documento"}
                  >
                    {doc.active ? 'Activo' : 'Inactivo'}
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveDocument(index)}
                    aria-label="Eliminar documento"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="document-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {doc.content}
                </ReactMarkdown>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DocumentManager;
