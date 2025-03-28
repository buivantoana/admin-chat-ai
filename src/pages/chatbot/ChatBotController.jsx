import React, { useState } from 'react'
import ChatBotView from './ChatBotView'
import Loading from '../../components/Loading'

export const ChatBotController = () => {
   const [loading,setLoading] = useState(false)
   const [bots, setBots] = useState(localStorage.getItem("bots") ? JSON.parse(localStorage.getItem("bots")) : [])
   return (
      <>
      {loading && <Loading />}
      <ChatBotView setLoading={setLoading}  bots={bots}/>
      </>
     
   )
}

