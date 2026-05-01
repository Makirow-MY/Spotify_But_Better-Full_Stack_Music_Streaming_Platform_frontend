import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://spotify-clone-backend-rose.vercel.app/api",
  withCredentials: true,        // ← THIS IS VERY IMPORTANT!
  headers: {
    "Content-Type": "application/json",
     },
});
