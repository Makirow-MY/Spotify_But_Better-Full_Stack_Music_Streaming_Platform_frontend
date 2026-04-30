import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mgy-spotify-clone-backend-ixu0xbp0c-makirow-mys-projects.vercel.app/api",
  withCredentials: true,        // ← THIS IS VERY IMPORTANT!
  headers: {
    "Content-Type": "application/json",
     'x-vercel-protection-bypass': "hsdlb2CJnISZT9gGfgp2L7wU0q6HkVPx"
  },
});
