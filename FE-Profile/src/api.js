import axios from "axios";
import { useAuthStore } from '@/stores/AuthStore';

export const customAPI = axios.create({
    baseURL: 'https://ydm-website-backend-production.up.railway.app/api/v1',
});

customAPI.interceptors.response.use(
    response => response,
    error => {
        const authStore = useAuthStore();
        
        if (error.response && error.response.status === 401) {
            authStore.logoutUser(); 
        }
        
        return Promise.reject(error);
    }
);