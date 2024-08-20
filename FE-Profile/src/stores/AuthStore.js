import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { customAPI } from '@/api';
import { useToast } from 'vue-toast-notification';

export const useAuthStore = defineStore('AuthStore', () => {
  const router = useRouter();
  const toast = useToast();

  const safeParse = (item) => {
    try {
      return JSON.parse(item);
    } catch (error) {
      return null;
    }
  };

  const token = ref(safeParse(localStorage.getItem('token')));
  const user = ref(safeParse(localStorage.getItem('user')));

  const isError = ref(false);
  const errorMsg = ref('');

  const setToken = (tokenValue) => {
    token.value = tokenValue;
    localStorage.setItem('token', JSON.stringify(tokenValue));
  };

  const setUser = (userValue) => {
    user.value = userValue;
    localStorage.setItem('user', JSON.stringify(userValue));
  };

  const loginUser = async (inputData) => {
    try {
      isError.value = false;
      errorMsg.value = '';

      const { email, password } = inputData;

      const { data } = await customAPI.post('/auth/login', { email, password });

      const { token: tokenUser, user: userData } = data;

      setToken(tokenUser);
      setUser(userData);

      toast.success('Login successful!');

      router.push({ name: 'Home' });
    } catch (error) {
      isError.value = true;
      errorMsg.value = "Invalid login";
      toast.error('Login failed. Please try again.');
    }
  };

  const getMe = async () => {
    try {
      const response = await customAPI.get('/me', {
        headers: { Authorization: `Bearer ${token.value}` },
      });

      const { user: userData } = response.data;

      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggingOut = ref(false);

  const logoutUser = async () => {
    if (isLoggingOut.value || !token.value) return;
  
    isLoggingOut.value = true;
  
    try {
      await customAPI.post('auth/logout', null, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      token.value = null;
      user.value = null;
  
      toast.success('Logout successful!');
      isLoggingOut.value = false;
  
      router.push({ name: 'Login' });
    }
  };

  return {
    token,
    user,
    loginUser,
    isError,
    errorMsg,
    getMe,
    logoutUser,
    setToken,
    setUser,
  };
});
