// MonacoEditorUI.jsx
import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const MonacoEditorUI = ({ value, onCodeChange, onSelection, decorations, language }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    console.log("Editor montado.");
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Definición del tema personalizado "qgrade" usando la paleta de colores de tu app
    monaco.editor.defineTheme('qgrade', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'ffffff', background: '152534' }, // Fondo oscuro, texto blanco
        { token: 'comment', foreground: '77ca9c', fontStyle: 'italic' }, // Comentarios en acento
        { token: 'keyword', foreground: '1b5083', fontStyle: 'bold' }, // Palabras clave en negrita
        { token: 'string', foreground: 'd4d4d4' }, // Cadenas
        { token: 'number', foreground: 'd4d4d4' }, // Números
      ],
      colors: {
        'editor.background': '#152534',      // color-primary-dark
        'editor.foreground': '#ffffff',        // color-text
        'editorLineNumber.foreground': '#2d6fa1',  // color-primary-light
        'editorCursor.foreground': '#ffffff',
        'editor.selectionBackground': '#1b5083',   // color-primary
        'editor.inactiveSelectionBackground': '#2d6fa1',
      },
    });
    
    // Aplicamos el tema personalizado
    editor.updateOptions({ theme: 'qgrade' });
    console.log("Tema 'qgrade' aplicado.");

    // Capturamos la selección en el editor
    editor.onDidChangeCursorSelection((e) => {
      if (!e.selection.isEmpty() && onSelection) {
        const selectedText = editor.getModel().getValueInRange(e.selection);
        const position = editor.getScrolledVisiblePosition(e.selection.getStartPosition());
        if (position && editor.getDomNode()) {
          const editorRect = editor.getDomNode().getBoundingClientRect();
          const x = editorRect.left + position.left;
          const y = editorRect.top + position.top + position.height;
          console.log("Selección detectada:", { x, y, selectedText });
          // Esperamos 200ms para que la selección se estabilice
          setTimeout(() => {
            onSelection({ x, y }, e.selection, selectedText);
          }, 200);
        }
      }
    });
  };

  // Actualizamos el contenido del editor si value cambia
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      console.log("Actualizando valor del editor...");
      editorRef.current.setValue(value);
    }
  }, [value]);

  // Actualizamos el lenguaje del modelo cuando la prop language cambia
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const currentModel = editorRef.current.getModel();
      if (currentModel) {
        console.log("Cambiando lenguaje con setModelLanguage. Nuevo lenguaje:", language);
        monacoRef.current.editor.setModelLanguage(currentModel, language);
      } else {
        console.log("No se encontró modelo actual para actualizar el lenguaje.");
      }
    }
  }, [language]);

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={onCodeChange}
      onMount={handleEditorDidMount}
      theme="qgrade"
    />
  );
};

export default MonacoEditorUI;
