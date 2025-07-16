// useDocuments.js - Hook para gestión de documentos
import { useState, useCallback, useRef } from 'react';

export const useDocuments = (maxDocuments = 10) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const idCounter = useRef(0);

  // Generar ID único
  const generateId = () => {
    idCounter.current += 1;
    return `doc_${Date.now()}_${idCounter.current}`;
  };

  // Calcular tokens aproximados (estimación simple)
  const calculateTokens = (text) => {
    // Estimación aproximada: 1 token ≈ 4 caracteres
    return Math.ceil(text.length / 4);
  };

  // Procesar archivo
  const processFile = async (file) => {
    console.log('Procesando archivo:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const tokens = calculateTokens(content);
          
          const document = {
            id: generateId(),
            name: file.name,
            content: content,
            size: file.size,
            type: file.type,
            tokens: tokens,
            active: true,
            lastModified: file.lastModified,
            addedAt: Date.now()
          };
          
          console.log('✅ Archivo procesado exitosamente:', document.name, 'Tokens:', tokens);
          resolve(document);
        } catch (error) {
          console.error('❌ Error al procesar contenido del archivo:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const error = new Error(`Error al leer el archivo: ${file.name}`);
        console.error('❌ Error del FileReader:', error);
        reject(error);
      };
      
      // Determinar cómo leer el archivo según su tipo
      const isTextFile = file.type.startsWith('text/') || 
          file.name.endsWith('.md') || 
          file.name.endsWith('.txt') ||
          file.name.endsWith('.js') ||
          file.name.endsWith('.jsx') ||
          file.name.endsWith('.ts') ||
          file.name.endsWith('.tsx') ||
          file.name.endsWith('.py') ||
          file.name.endsWith('.css') ||
          file.name.endsWith('.html') ||
          file.name.endsWith('.json') ||
          file.name.endsWith('.xml') ||
          file.name.endsWith('.sql') ||
          file.name.endsWith('.php') ||
          file.name.endsWith('.c') ||
          file.name.endsWith('.cpp') ||
          file.name.endsWith('.cs') ||
          file.name.endsWith('.java');
      
      if (isTextFile) {
        console.log('Leyendo como archivo de texto:', file.name);
        reader.readAsText(file);
      } else {
        const error = new Error(`Tipo de archivo no soportado: ${file.type || 'desconocido'} (${file.name})`);
        console.error('❌ Tipo de archivo no soportado:', error);
        reject(error);
      }
    });
  };

  // Agregar documento
  const addDocument = useCallback(async (file) => {
    if (documents.length >= maxDocuments) {
      throw new Error(`Máximo ${maxDocuments} documentos permitidos`);
    }

    // Verificar si ya existe un documento con el mismo nombre
    const existingDoc = documents.find(doc => doc.name === file.name);
    if (existingDoc) {
      throw new Error(`Ya existe un documento con el nombre: ${file.name}`);
    }

    setIsLoading(true);
    
    try {
      const document = await processFile(file);
      setDocuments(prev => [...prev, document]);
      return document;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [documents, maxDocuments]);

  // Agregar múltiples documentos
  const addMultipleDocuments = useCallback(async (files) => {
    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const document = await addDocument(file);
        results.push(document);
      } catch (error) {
        errors.push({ file: file.name, error: error.message });
      }
    }

    return { results, errors };
  }, [addDocument]);

  // Alternar estado activo/inactivo de documento
  const toggleDocument = useCallback((index) => {
    setDocuments(prev => {
      const newDocs = [...prev];
      if (newDocs[index]) {
        newDocs[index] = {
          ...newDocs[index],
          active: !newDocs[index].active
        };
      }
      return newDocs;
    });
  }, []);

  // Eliminar documento
  const removeDocument = useCallback((index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Eliminar todos los documentos
  const clearAllDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  // Obtener documentos activos
  const getActiveDocuments = useCallback(() => {
    return documents.filter(doc => doc.active);
  }, [documents]);

  // Obtener contenido de documentos activos
  const getActiveContent = useCallback(() => {
    return documents
      .filter(doc => doc.active)
      .map(doc => `// Archivo: ${doc.name}\n${doc.content}`)
      .join('\n\n---\n\n');
  }, [documents]);

  // Obtener estadísticas
  const getStats = useCallback(() => {
    const activeCount = documents.filter(doc => doc.active).length;
    const totalTokens = documents.reduce((sum, doc) => sum + doc.tokens, 0);
    const activeTokens = documents
      .filter(doc => doc.active)
      .reduce((sum, doc) => sum + doc.tokens, 0);

    return {
      total: documents.length,
      active: activeCount,
      inactive: documents.length - activeCount,
      totalTokens,
      activeTokens,
      maxDocuments,
      canAddMore: documents.length < maxDocuments
    };
  }, [documents, maxDocuments]);

  // Buscar documentos
  const searchDocuments = useCallback((query) => {
    if (!query.trim()) return documents;
    
    const lowercaseQuery = query.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowercaseQuery) ||
      doc.content.toLowerCase().includes(lowercaseQuery)
    );
  }, [documents]);

  // Ordenar documentos
  const sortDocuments = useCallback((sortBy = 'name', order = 'asc') => {
    return [...documents].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'size':
          valueA = a.size;
          valueB = b.size;
          break;
        case 'tokens':
          valueA = a.tokens;
          valueB = b.tokens;
          break;
        case 'date':
          valueA = a.addedAt;
          valueB = b.addedAt;
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }
      
      if (order === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }, [documents]);

  // Exportar documentos activos
  const exportActiveDocuments = useCallback(() => {
    const activeContent = getActiveContent();
    const blob = new Blob([activeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `documentos_activos_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [getActiveContent]);

  // Importar configuración de documentos
  const importDocuments = useCallback(async (file) => {
    try {
      const content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsText(file);
      });

      const importedDocs = JSON.parse(content);
      
      if (Array.isArray(importedDocs)) {
        setDocuments(prev => {
          const combined = [...prev];
          importedDocs.forEach(doc => {
            if (!combined.find(existing => existing.name === doc.name)) {
              combined.push({
                ...doc,
                id: generateId(),
                addedAt: Date.now()
              });
            }
          });
          return combined.slice(0, maxDocuments);
        });
      }
    } catch (error) {
      throw new Error('Archivo de importación inválido');
    }
  }, [maxDocuments]);

  return {
    // Estado
    documents,
    isLoading,
    
    // Acciones
    addDocument,
    addMultipleDocuments,
    toggleDocument,
    removeDocument,
    clearAllDocuments,
    
    // Consultas
    getActiveDocuments,
    getActiveContent,
    getStats,
    searchDocuments,
    sortDocuments,
    
    // Utilidades
    exportActiveDocuments,
    importDocuments
  };
};
