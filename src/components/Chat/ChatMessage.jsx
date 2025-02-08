import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import './ChatMessage.css';

function ChatMessage({ message, isBot }) {
  return (
    <div className={`message-container ${isBot ? 'bot-message' : 'user-message'}`}>
      {isBot && (
        <div className="message-avatar bot-avatar" aria-hidden="true">
          <Bot 
            size={28}
            className="icon pulse" 
            aria-label="Asistente AI"
            color="var(--color-text)"
          />
        </div>
      )}

      <div className="message-content">
        <div className="message-decoration"></div>
        <ReactMarkdown
          className="message-text"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return (
                <code 
                  className={`${inline ? 'inline-code' : 'code-block'} ${className}`}
                  data-language={match ? match[1] : 'code'}
                  {...props}
                >
                  {children}
                  {!inline && <span className="language-label">{match ? match[1] : 'code'}</span>}
                </code>
              )
            },
            pre({ node, children, ...props }) {
              return <pre className="pre-block" {...props}>{children}</pre>
            },
            table({ node, children, ...props }) {
              return (
                <div className="table-container">
                  <div className="table-scroll-wrapper">
                    <table {...props}>{children}</table>
                  </div>
                </div>
              )
            },
            img({ node, ...props }) {
              return <figure><img className="markdown-image" {...props} alt="" /><figcaption>Imagen adjunta</figcaption></figure>
            },
            hr({ node, ...props }) {
              return <hr className="markdown-divider" {...props} />
            }
          }}
        >
          {message}
        </ReactMarkdown>
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