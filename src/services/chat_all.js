import api from "../core/axios";
import { url_api } from "../config";

export async function botGetAllChat(id) {
   try {
      let token = localStorage.getItem("token")
      const response = await api.get(
         `${url_api}/bots/${id}/chats`,
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      );
      console.log(response);
      return response.data;
   } catch (error) {
      if (error.response) {
         // The request was made, and the server responded with a status code
         // that falls out of the range of 2xx
         console.error("Error response data:", error.response.data);
         console.error("Error response status:", error.response.status);
         return error.response.data; // You can return this to handle error responses
      } else if (error.request) {
         // The request was made but no response was received
         console.error("No response received:", error.request);
      } else {
         // Something happened in setting up the request that triggered an error
         console.error("Error setting up request:", error.message);
      }
   }
}

export async function botChatActive(idBot, body, idChat) {
   try {
      let token = localStorage.getItem("token")
      const response = await api.put(
         `${url_api}/bots/${idBot}/chats/${idChat}`,
         body,
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      );
      console.log(response);
      return response.data;
   } catch (error) {
      if (error.response) {
         // The request was made, and the server responded with a status code
         // that falls out of the range of 2xx
         console.error("Error response data:", error.response.data);
         console.error("Error response status:", error.response.status);
         return error.response.data; // You can return this to handle error responses
      } else if (error.request) {
         // The request was made but no response was received
         console.error("No response received:", error.request);
      } else {
         // Something happened in setting up the request that triggered an error
         console.error("Error setting up request:", error.message);
      }
   }
}