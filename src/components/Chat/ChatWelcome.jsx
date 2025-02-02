import React, { useState } from 'react';
import './ChatWelcome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Logo} from '../UI/Logo'
function ChatWelcome() {
return(
  <div className='chat__welcome'>
    <Logo className="chat__logo"/>
    <p className='chat__message'>En que puedo ayudarte hoy?</p>
  </div>
  );
}

export default ChatWelcome;
