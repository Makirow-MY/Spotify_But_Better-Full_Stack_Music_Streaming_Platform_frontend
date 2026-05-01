import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://spotify-clone-backend-pi.vercel.app/api",
  withCredentials: true,        // ← THIS IS VERY IMPORTANT!
  headers: {
    "Content-Type": "application/json",
     'x-vercel-protection-bypass': "sC9QaNcXLtEn5uEJ57CwE9L869AOPjwC"
  },
});
