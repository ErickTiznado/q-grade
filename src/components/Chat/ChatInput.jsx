import React from "react";
import './ChatInput.css'
import { Send, PaperclipIcon, Brain, Palette, Braces } from 'lucide-react';


export function ChatInput({message, setMessage}){
    return (
        <div className="input-area">
            <div className="input-container">
                <div className="input-wrapper">
                    <div className="input-actions">
                        <button className="input-action" aria-label="">
                        <Braces size={20}/>
                        </button>
                        <button className="input-action" aria-label="">
                            <PaperclipIcon size={20}/>
                        </button>
                        <button className="input-action" aria-label="">
                            <Brain size={20}/>
                        </button>
                        <button className="input-action" aria-label="">
                            <Palette size={20}/>
                        </button>
                    </div>
                    <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe tu mensaje..." className="input-field" rows={1} aria-label="Campo de Mensaje" name="" id=""></input>
                    <button className="input-send" aria-label="Enviar mensaje">
                        <Send size={20}/>
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ChatInput;