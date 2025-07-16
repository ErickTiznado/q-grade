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
    
    // Definición del tema personalizado "qgrade" mejorado con la paleta de colores
    monaco.editor.defineTheme('qgrade', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        // Reglas de sintaxis mejoradas
        { token: '', foreground: 'ffffff', background: '152534' },
        { token: 'comment', foreground: '77ca9c', fontStyle: 'italic' },
        { token: 'comment.line', foreground: '77ca9c', fontStyle: 'italic' },
        { token: 'comment.block', foreground: '77ca9c', fontStyle: 'italic' },
        { token: 'keyword', foreground: '2d6fa1', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: '1b5083', fontStyle: 'bold' },
        { token: 'operator', foreground: '77ca9c' },
        { token: 'string', foreground: 'e2e8f0' },
        { token: 'string.escape', foreground: '77ca9c' },
        { token: 'number', foreground: 'cbd5e1' },
        { token: 'regexp', foreground: '77ca9c' },
        { token: 'type', foreground: '2d6fa1' },
        { token: 'namespace', foreground: '2d6fa1' },
        { token: 'function', foreground: 'f1f5f9' },
        { token: 'variable', foreground: 'ffffff' },
        { token: 'variable.predefined', foreground: '2d6fa1' },
        { token: 'tag', foreground: '1b5083' },
        { token: 'attribute.name', foreground: '77ca9c' },
        { token: 'attribute.value', foreground: 'e2e8f0' },
        { token: 'delimiter', foreground: 'cbd5e1' },
        { token: 'delimiter.bracket', foreground: '77ca9c' },
        { token: 'delimiter.array', foreground: '77ca9c' },
        { token: 'delimiter.parenthesis', foreground: 'cbd5e1' },
      ],
      colors: {
        // Colores del editor mejorados
        'editor.background': '#152534',
        'editor.foreground': '#ffffff',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#77ca9c',
        'editorCursor.foreground': '#77ca9c',
        'editor.selectionBackground': '#1b508350',
        'editor.selectionHighlightBackground': '#2d6fa130',
        'editor.inactiveSelectionBackground': '#1b508330',
        'editor.wordHighlightBackground': '#77ca9c20',
        'editor.wordHighlightStrongBackground': '#77ca9c30',
        'editor.findMatchBackground': '#77ca9c40',
        'editor.findMatchHighlightBackground': '#77ca9c20',
        'editor.hoverHighlightBackground': '#2d6fa120',
        'editorHoverWidget.background': '#1b2937',
        'editorHoverWidget.border': '#2d6fa1',
        'editorSuggestWidget.background': '#1b2937',
        'editorSuggestWidget.border': '#2d6fa1',
        'editorSuggestWidget.selectedBackground': '#1b508330',
        'editorWidget.background': '#1b2937',
        'editorWidget.border': '#2d6fa1',
        'editorIndentGuide.background': '#2d6fa130',
        'editorIndentGuide.activeBackground': '#77ca9c50',
        'editorBracketMatch.background': '#77ca9c30',
        'editorBracketMatch.border': '#77ca9c',
        'editorGutter.background': '#152534',
        'editorGutter.modifiedBackground': '#77ca9c',
        'editorGutter.addedBackground': '#4ade80',
        'editorGutter.deletedBackground': '#ef4444',
        'editorError.foreground': '#ef4444',
        'editorWarning.foreground': '#f59e0b',
        'editorInfo.foreground': '#3b82f6',
        'editorHint.foreground': '#77ca9c',
        'scrollbar.shadow': '#00000030',
        'scrollbarSlider.background': '#77ca9c30',
        'scrollbarSlider.hoverBackground': '#77ca9c50',
        'scrollbarSlider.activeBackground': '#77ca9c70',
        'editorOverviewRuler.border': '#2d6fa130',
        'editorOverviewRuler.errorForeground': '#ef4444',
        'editorOverviewRuler.warningForeground': '#f59e0b',
        'editorOverviewRuler.infoForeground': '#3b82f6',
        'minimap.background': '#15253420',
        'minimapSlider.background': '#77ca9c20',
        'minimapSlider.hoverBackground': '#77ca9c30',
        'minimapSlider.activeBackground': '#77ca9c40',
      },
    });
    
    // Aplicar el tema personalizado y configuraciones adicionales
    editor.updateOptions({ 
      theme: 'qgrade',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, monospace",
      fontSize: 14,
      lineHeight: 1.6,
      fontWeight: '400',
      fontLigatures: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      minimap: {
        enabled: true,
        side: 'right',
        showSlider: 'always',
        renderCharacters: false,
      },
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        useShadows: true,
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
      },
      renderLineHighlight: 'all',
      renderWhitespace: 'selection',
      renderIndentGuides: true,
      highlightActiveIndentGuide: true,
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        bracketPairsHorizontal: true,
        highlightActiveBracketPair: true,
        indentation: true,
        highlightActiveIndentation: true,
      },
      suggest: {
        preview: true,
        showIcons: true,
        showStatusBar: true,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      parameterHints: {
        enabled: true,
        cycle: true,
      },
      wordWrap: 'on',
      wordWrapColumn: 120,
      automaticLayout: true,
      formatOnPaste: true,
      formatOnType: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: true,
      trimAutoWhitespace: true,
      acceptSuggestionOnEnter: 'on',
      acceptSuggestionOnCommitCharacter: true,
      snippetSuggestions: 'top',
      emptySelectionClipboard: false,
      copyWithSyntaxHighlighting: true,
      multiCursorModifier: 'ctrlCmd',
      accessibilitySupport: 'auto',
    });
    
    console.log("Tema 'qgrade' aplicado con configuraciones mejoradas.");

    // Capturar selección con mejor manejo de eventos
    editor.onDidChangeCursorSelection((e) => {
      if (!e.selection.isEmpty() && onSelection) {
        const selectedText = editor.getModel().getValueInRange(e.selection);
        const position = editor.getScrolledVisiblePosition(e.selection.getStartPosition());
        
        if (position && editor.getDomNode()) {
          const editorRect = editor.getDomNode().getBoundingClientRect();
          const x = editorRect.left + position.left;
          const y = editorRect.top + position.top + position.height;
          
          console.log("Selección detectada:", { x, y, selectedText });
          
          // Debounce para evitar múltiples llamadas
          setTimeout(() => {
            onSelection({ x, y }, e.selection, selectedText);
          }, 150);
        }
      }
    });

    // Agregar comandos personalizados
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.trigger('keyboard', 'editor.action.addSelectionToNextFindMatch', {});
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.trigger('keyboard', 'editor.action.moveLinesUpAction', {});
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.trigger('keyboard', 'editor.action.moveLinesDownAction', {});
    });
  };

  // Actualizar contenido del editor
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      console.log("Actualizando valor del editor...");
      const currentPosition = editorRef.current.getPosition();
      editorRef.current.setValue(value);
      
      // Restaurar posición del cursor si es posible
      if (currentPosition) {
        editorRef.current.setPosition(currentPosition);
      }
    }
  }, [value]);

  // Actualizar lenguaje del modelo
  useEffect(() => {
    if (editorRef.current && monacoRef.current && language) {
      const currentModel = editorRef.current.getModel();
      if (currentModel) {
        console.log("Cambiando lenguaje. Nuevo lenguaje:", language);
        monacoRef.current.editor.setModelLanguage(currentModel, language);
        
        // Configurar opciones específicas por lenguaje
        const languageConfigs = {
          javascript: { tabSize: 2, insertSpaces: true },
          typescript: { tabSize: 2, insertSpaces: true },
          python: { tabSize: 4, insertSpaces: true },
          c: { tabSize: 4, insertSpaces: true },
          csharp: { tabSize: 4, insertSpaces: true },
          html: { tabSize: 2, insertSpaces: true },
          css: { tabSize: 2, insertSpaces: true },
          json: { tabSize: 2, insertSpaces: true },
        };
        
        const config = languageConfigs[language];
        if (config) {
          editorRef.current.updateOptions(config);
        }
      }
    }
  }, [language]);

  // Manejar decoraciones
  useEffect(() => {
    if (editorRef.current && decorations) {
      console.log("Aplicando decoraciones:", decorations);
      editorRef.current.deltaDecorations([], decorations);
    }
  }, [decorations]);

  return (
    <div style={{ 
      height: '100%', 
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: '#152534',
      borderRadius: '0 0 8px 8px',
    }}>
      <Editor
        height="100%"
        defaultLanguage={language || 'javascript'}
        value={value}
        onChange={onCodeChange}
        onMount={handleEditorDidMount}
        theme="qgrade"
        loading={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: '#152534',
            color: '#77ca9c',
            fontSize: '14px',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #2d6fa1',
                borderTop: '3px solid #77ca9c',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span>Cargando editor...</span>
            </div>
          </div>
        }
        options={{
          automaticLayout: true,
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MonacoEditorUI;
