import React, { useEffect, useState } from "react";
import ChatBotView from "./ChatBotView";
import Loading from "../../components/Loading";
import { useChatContext } from "../../App";

export const ChatBotController = () => {
  const [loading, setLoading] = useState(false);
  const context = useChatContext();
  const [bots, setBots] = useState(
    localStorage.getItem("bots") ? JSON.parse(localStorage.getItem("bots")) : []
  );
  useEffect(() => {
    if (context && context.state && context.state.bots) {
      setBots(context.state.bots);
    }
  }, [context.state.bots]);
  return (
    <>
      {loading && <Loading />}
      <ChatBotView setLoading={setLoading} bots={bots} />
    </>
  );
};
