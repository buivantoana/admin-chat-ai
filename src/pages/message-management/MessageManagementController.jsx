import { useEffect, useState, useRef } from "react";
import MessageManagementView from "./MessageManagementView.jsx";
import { useParams } from "react-router-dom";
import { botGetAllChat } from "../../services/chat_all.js";
import { toast } from "react-toastify";

export const MessageManagementController = () => {
  const [botChat, setChatBot] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const wsRef = useRef(null); // Sử dụng useRef để lưu WebSocket
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = useRef(1000); // Bắt đầu với 1 giây
  const maxReconnectInterval = 30000; // Tối đa 30 giây
  const [isConnected, setIsConnected] = useState(false);

  const connectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return; // Không tạo kết nối mới nếu đã kết nối
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    wsRef.current = new WebSocket(`wss://aichat.zeezoo.mobi:8188/ws/chats?token=${token}`);

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
      reconnectAttempts.current = 0; // Reset số lần thử
      reconnectInterval.current = 1000; // Reset interval
      toast.success("Đã kết nối với server chat");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("socket", msg);
        if (msg.event === "new_message") {
            if(msg.data.role =="user"){
               if (localStorage.getItem("notify_chat")) {
                 localStorage.setItem(
                   "notify_chat",
                   JSON.stringify([...JSON.parse(localStorage.getItem("notify_chat")), msg.data.cid])
                 );
               } else {
                 localStorage.setItem("notify_chat", JSON.stringify([msg.data.cid]));
               }
            }
          setChatBot((prevBotChat) => {
            const chatExists = prevBotChat.some((item) => item.cid === msg.data.cid);

            if (chatExists) {
              return prevBotChat.map((item) => {
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
                        isRead:msg.data.role=="user" ? false :true,
                        file_url: msg.data.file_url,
                      },
                    ],
                  };
                }
                return item;
              });
            } else {
              return [
                ...prevBotChat,
                {
                  cid: msg.data.cid,
                  bid: msg.data.bid,
                  name: msg.data.name,
                  avatar: msg.data.avatar,
                  messages: [
                     ...item.messages.filter((item)=>item.role!="hongnv"),
                    {
                     created:getFormattedDate(),
                      role: msg.data.role || "",
                      content: msg.data.content || "",
                      content_raw: null,
                      isRead: msg.data.role=="user" ? false :true,
                      file_url: msg.data.file_url,
                    },
                  ],
                },
              ];
            }
          });
          console.log("💬 CID:", msg.data.cid);
          console.log("👉 Nội dung:", msg.data.content);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    wsRef.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setIsConnected(false);
      toast.warn("Mất kết nối với server chat, đang thử kết nối lại...");
      handleReconnect();
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      wsRef.current.close(); // Đóng kết nối để kích hoạt onclose
    };
  };

  const handleReconnect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      toast.error("Không thể kết nối lại với server chat sau nhiều lần thử.");
      return;
    }

    reconnectAttempts.current += 1;
    const delay = Math.min(reconnectInterval.current, maxReconnectInterval);
    console.log(`Thử kết nối lại lần ${reconnectAttempts.current} sau ${delay}ms`);

    setTimeout(() => {
      connectWebSocket();
      reconnectInterval.current *= 2; // Tăng gấp đôi interval (exponential backoff)
    }, delay);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    if (id) {
      getChat();
    }
  }, [id]);

  const getChat = async () => {
    setLoading(true);
    try {
      let result = await botGetAllChat(id);
      console.log(result);
      if (result) {
        setChatBot(
          result.map((item) => ({
            ...item,
            messages: item.messages.map((ix) => ({
              ...ix,
              isRead: true,
            })),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Lỗi khi tải danh sách chat");
    }
    setLoading(false);
  };

  return (
    <MessageManagementView
      getChat={getChat}
      loading={loading}
      botChat={botChat}
      setChatBot={setChatBot}
    />
  );
};

function getFormattedDate() {
   const now = new Date();

   const pad = (num, size = 2) => String(num).padStart(size, '0');
 
   const year = now.getUTCFullYear();
   const month = pad(now.getUTCMonth() + 1);
   const day = pad(now.getUTCDate());
   const hours = pad(now.getUTCHours());
   const minutes = pad(now.getUTCMinutes());
   const seconds = pad(now.getUTCSeconds());
   const milliseconds = pad(now.getUTCMilliseconds(), 3);
 
   // Giả lập microseconds bằng cách thêm '000' vào milliseconds
   const microseconds = milliseconds + '000';
 
   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${microseconds}+00:00`;
 }