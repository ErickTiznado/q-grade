// DocumentDemo.jsx - Demostración del nuevo sistema de documentos
import React, { useState } from 'react';
import { FileText, Upload, Search, Eye, Trash2 } from 'lucide-react';
import DocumentPanel from './DocumentPanel';
import { useDocuments } from './useDocuments';

const DocumentDemo = () => {
  const [showPanel, setShowPanel] = useState(false);
  
  const {
    documents,
    isLoading,
    addDocument,
    toggleDocument,
    removeDocument,
    getStats,
    getActiveContent
  } = useDocuments();

  const stats = getStats();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await addDocument(file);
      } catch (error) {
        alert(error.message);
      }
    }
    event.target.value = '';
  };

  const createSampleDocument = async () => {
    const sampleContent = `# Documento de Ejemplo

Este es un documento de muestra para demostrar el nuevo sistema de gestión de documentos estilo ChatGPT.

## Características principales:

1. **Gestión visual**: Panel modal con interfaz moderna
2. **Búsqueda integrada**: Buscar por nombre o contenido
3. **Filtros**: Ver todos, activos o inactivos
4. **Vista previa**: Expandir documentos para ver contenido
5. **Acciones masivas**: Seleccionar múltiples documentos
6. **Drag & Drop**: Arrastrar archivos directamente
7. **Estadísticas**: Conteo de tokens y documentos

## Tipos de archivo soportados:
- Documentos de texto (.txt, .md)
- Código fuente (.js, .jsx, .ts, .tsx, .py, .css, .html)
- Documentos de oficina (.pdf, .doc, .docx)
- Datos estructurados (.json)

¡Prueba todas las funcionalidades disponibles!`;

    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const file = new File([blob], 'documento-ejemplo.md', { type: 'text/plain' });
    
    try {
      await addDocument(file);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        color: '#1b5083', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <FileText size={28} />
        Sistema de Documentos - Demo
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Estadísticas */}
        <div style={{
          background: 'linear-gradient(135deg, #1b5083 0%, #2d6fa1 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} />
            Estadísticas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div>Total: <strong>{stats.total}</strong></div>
            <div>Activos: <strong>{stats.active}</strong></div>
            <div>Tokens: <strong>{stats.totalTokens.toLocaleString()}</strong></div>
            <div>Límite: <strong>{stats.maxDocuments}</strong></div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#495057' }}>Acciones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setShowPanel(true)}
              style={{
                background: '#77ca9c',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <Eye size={16} />
              Abrir Panel
            </button>
            
            <label style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <Upload size={16} />
              Subir Archivo
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".txt,.md,.js,.jsx,.ts,.tsx,.py,.css,.html,.json"
              />
            </label>
            
            <button
              onClick={createSampleDocument}
              style={{
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <FileText size={16} />
              Crear Ejemplo
            </button>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      {documents.length > 0 && (
        <div style={{
          background: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '16px',
            borderBottom: '1px solid #e9ecef',
            fontWeight: '600',
            color: '#495057'
          }}>
            Documentos Cargados ({documents.length})
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {documents.map((doc, index) => (
              <div
                key={doc.id || index}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f1f3f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: doc.active ? '#f0f9f4' : 'white'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '500', 
                    color: doc.active ? '#22c55e' : '#6b7280',
                    marginBottom: '4px'
                  }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {doc.tokens} tokens • {(doc.size / 1024).toFixed(1)}KB
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => toggleDocument(index)}
                    style={{
                      background: doc.active ? '#dc3545' : '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {doc.active ? 'Desactivar' : 'Activar'}
                  </button>
                  
                  <button
                    onClick={() => removeDocument(index)}
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido activo */}
      {stats.active > 0 && (
        <div style={{
          marginTop: '20px',
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <h3 style={{ margin: '0 0 12px', color: '#495057' }}>
            Contenido que se enviará al chat:
          </h3>
          <pre style={{
            background: 'white',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px',
            border: '1px solid #e9ecef',
            color: '#6b7280'
          }}>
            {getActiveContent() || 'No hay documentos activos'}
          </pre>
        </div>
      )}

      {/* Panel de documentos */}
      <DocumentPanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        documents={documents}
        onDocumentToggle={toggleDocument}
        onDocumentRemove={removeDocument}
        onDocumentAdd={addDocument}
        maxDocuments={10}
      />

      {isLoading && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#17a2b8',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          Procesando archivo...
        </div>
      )}
    </div>
  );
};

export default DocumentDemo;
