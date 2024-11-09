import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
}); 

