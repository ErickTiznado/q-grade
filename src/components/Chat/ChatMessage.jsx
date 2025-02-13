import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatMessage.css';

function ChatMessage({ message, isBot, streamContent }) {
  const contentToDisplay = streamContent || message;

  return (
    <div className={`message-container ${isBot ? 'bot-message' : 'user-message'}`}>
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
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    margin: '1rem 0',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
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
