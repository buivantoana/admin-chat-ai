import React, { useState } from 'react'
import ChatBotView from './ChatBotView'

export const ChatBotController = () => {
   const [bots, setBots] = useState(localStorage.getItem("bots") ? JSON.parse(localStorage.getItem("bots")) : [])
   return (
      <ChatBotView  bots={bots}/>
   )
}

