import api from "../core/axios";
import { url_api } from "../config";

export async function createProduct(id,body) {
  try {
    let token = localStorage.getItem("token");
    const response = await api.post(`${url_api}/bots/${id}/products`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
export async function updateProduct(id,idprod,body) {
    try {
      let token = localStorage.getItem("token");
      const response = await api.put(`${url_api}/bots/${id}/products/${idprod}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
export async function deleteProduct(idBot,idProduct) {
    try {
      let token = localStorage.getItem("token");
      const response = await api.delete(`${url_api}/bots/${idBot}/products/${idProduct}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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