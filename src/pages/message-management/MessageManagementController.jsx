import { useEffect, useState } from "react"
import MessageManagementView from "./MessageManagementView.jsx"
import { useParams, useSearchParams } from "react-router-dom";
import { botGetAllChat } from "../../services/chat_all.js";



export const MessageManagementController = () => {
   const [botChat, setChatBot] = useState([])
   const { id } = useParams();
   const [loading, setLoading] = useState(false)
   const [ws, setWs] = useState(null);
   useEffect(() => {
      console.log("tona");
      if (!localStorage.getItem("token")) return;

      const socket = new WebSocket(`wss://aichat.zeezoo.mobi:8188/ws/chats?token=${localStorage.getItem("token")}`);

      socket.onopen = () => console.log("✅ WebSocket connected");

      socket.onmessage = (event) => {
         try {
            const msg = JSON.parse(event.data);
            if (msg.event === "new_message") {
               console.log(msg);
               console.log("data socket", botChat.map((item) => {
                  if (item.cid == msg.data.cid) {
                     return {
                        ...item,
                        messages: [...item.messages, {
                           created: getFormattedDate(), role: msg.data.role && msg.data.role, content: msg.data.content ? msg.data.content : "", content_raw: null
                        }]
                     }
                  }
                  return item
               }));
              if(localStorage.getItem("notify_chat")){
                
                 localStorage.setItem("notify_chat",JSON.stringify([...JSON.parse(localStorage.getItem("notify_chat")),msg.data.cid]))
              }else{
               console.log("no")
               localStorage.setItem("notify_chat",JSON.stringify([msg.data.cid]))
              }
               setChatBot((prevBotChat) =>
                  prevBotChat.map((item) => {
                     if (item.cid === msg.data.cid) {
                        return {
                           ...item,
                           messages: [
                              ...item.messages,
                              {
                                 created: getFormattedDate(),
                                 role: msg.data.role || "",
                                 content: msg.data.content || "",
                                 content_raw: null,
                                 isRead:false
                              },
                           ],
                        };
                     }
                     return item;
                  })
               );
               console.log("💬 CID:", msg.data.cid);
               console.log("👉 Nội dung:", msg.data.content);
            }
         } catch (error) {
            console.log(error);
         }

      };

      socket.onclose = () => {
         console.log("❌ WebSocket disconnected, sẽ thử kết nối lại...");
         setTimeout(() => {
            setWs(new WebSocket(`wss://aichat.zeezoo.mobi:8188/ws/chats?token=${localStorage.getItem("token")}`));
         }, 3000); // Tự động reconnect sau 3 giây
      };

      setWs(socket);

      return () => socket.close(); // Dọn dẹp khi component unmount
   }, [localStorage.getItem("token")]);
   useEffect(() => {
      if (id) {
         (async () => {
            setLoading(true)
            try {
               let result = await botGetAllChat(id)
               console.log(result);
               if (result) {
                  setChatBot(result.map((item)=>{
                     return {
                        ...item,
                        messages:item.messages.map((ix)=>{
                           return {
                              ...ix,
                              isRead:true
                           }
                        })
                     }
                  }))
               }
            } catch (error) {
               console.log(error);
            }
            setLoading(false)
         })()
      }
   }, [id])
   return <>
      <MessageManagementView loading={loading} botChat={botChat} setChatBot={setChatBot} />
   </>

}
function getFormattedDate() {
   const now = new Date();
   const isoString = now.toISOString(); // "2025-03-27T10:19:53.512Z"

   // Tạo phần microsecond (6 chữ số, nhưng JavaScript chỉ hỗ trợ tối đa 3 chữ số)
   const microseconds = now.getMilliseconds().toString().padStart(3, "0") + "000";

   // Chỉnh sửa múi giờ thành "+00:00" thay vì "Z"
   return isoString.replace("Z", `.${microseconds}+00:00`);
}
