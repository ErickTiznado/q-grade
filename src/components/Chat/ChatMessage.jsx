import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Copy, Check, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import './ChatMessage.css';

function ChatMessage({ message, isBot, streamContent, onRegenerate }) {
  const contentToDisplay = streamContent || message;
  const [copiedStates, setCopiedStates] = useState(new Map());
  const messageRef = useRef(null);

  // Principio de Feedback: Función para copiar contenido
  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => new Map(prev).set(id, true));
      
      // Feedback temporal
      setTimeout(() => {
        setCopiedStates(prev => {
          const newMap = new Map(prev);
          newMap.delete(id);
          return newMap;
        });
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Principio de Accesibilidad: Scroll automático para mensajes nuevos
  useEffect(() => {
    if (streamContent && messageRef.current) {
      messageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  }, [streamContent]);

  return (
    <div 
      ref={messageRef}
      className={`message-container ${isBot ? 'bot-message' : 'user-message'}`}
      role="article"
      aria-label={`${isBot ? 'Respuesta del asistente' : 'Tu mensaje'}`}
    >
      {isBot && (
        <div className="message-avatar bot-avatar" aria-hidden="true">
          <Bot 
            size={28}
            className="icon"
            aria-label="Asistente AI"
            color="var(--color-text)"
          />
        </div>
      )}

      <div className="message-content">
        <ReactMarkdown
          className="message-text"
          remarkPlugins={[remarkGfm]}
          // Agregamos o actualizamos los renderers personalizados:
          components={{
            p({ node, children, ...props }) {
              return <p {...props} className="markdown-paragraph">{children}</p>;
            },
            h1({ node, children, ...props }) {
              return <h1 {...props} className="markdown-heading markdown-heading-1">{children}</h1>;
            },
            h2({ node, children, ...props }) {
              return <h2 {...props} className="markdown-heading markdown-heading-2">{children}</h2>;
            },
            h3({ node, children, ...props }) {
              return <h3 {...props} className="markdown-heading markdown-heading-3">{children}</h3>;
            },
            blockquote({ node, children, ...props }) {
              return <blockquote {...props} className="markdown-blockquote">{children}</blockquote>;
            },
            code({ node, inline, className, children, ...props }) {
              // Convertimos los children a cadena de forma segura:
              const textContent = React.Children.toArray(children).join('');
              if (inline) {
                return (
                  <code className={`inline-code ${className || ''}`} {...props}>
                    {textContent}
                  </code>
                );
              }
              // Para bloques de código: si el texto es corto lo tratamos como inline code (opcional)
              if (textContent.length < 30) {
                return (
                  <code className={`inline-code ${className || ''}`} {...props}>
                    {textContent}
                  </code>
                );
              }
              const match = /language-(\w+)/.exec(className || '');
              return (
                <SyntaxHighlighter
                  language={match ? match[1] : ''}
                  customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    margin: '1rem 0',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: '#282c34',
                    color: '#abb2bf',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}
                  {...props}
                >
                  {textContent}
                </SyntaxHighlighter>
              );
            },
            table({ node, children, ...props }) {
              return (
                <div className="table-container">
                  <div className="table-scroll-wrapper">
                    <table {...props}>
                      {children}
                    </table>
                  </div>
                </div>
              );
            },
            img({ node, children, ...props }) {
              return (
                <figure className="markdown-figure">
                  <img className="markdown-image" {...props} alt="" />
                  <figcaption className="markdown-figcaption">Imagen adjunta</figcaption>
                </figure>
              );
            },
            hr({ node, children, ...props }) {
              return <hr {...props} className="markdown-divider" />;
            },
            ul({ node, children, ...props }) {
              return (
                <ul {...props} className="markdown-ul">
                  {children}
                </ul>
              );
            },
            ol({ node, children, ...props }) {
              return (
                <ol {...props} className="markdown-ol">
                  {children}
                </ol>
              );
            },
            li({ node, children, ...props }) {
              const childArray = React.Children.toArray(children);
              const modifiedChildren = childArray.map(child => {
                if (React.isValidElement(child) && child.type === 'p') {
                  const containsStrong = React.Children.toArray(child.props.children).some(grandChild =>
                    React.isValidElement(grandChild) && grandChild.type === 'strong'
                  );
                  if (containsStrong) {
                    return React.cloneElement(child, {
                      className: `${child.props.className || ''} list-item-subtitle`.trim()
                    });
                  }
                }
                return child;
              });
              return (
                <li {...props} className="markdown-li" style={{ paddingLeft: '2.5em' }}>
                  {modifiedChildren}
                </li>
              );
            }
          }}
        >
          {contentToDisplay}
        </ReactMarkdown>

        {isBot && streamContent && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      {!isBot && (
        <div className="message-avatar user-avatar" aria-hidden="true">
          <User 
            size={28}
            className="icon"
            aria-label="Tu mensaje"
            color="var(--color-text)"
          />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
