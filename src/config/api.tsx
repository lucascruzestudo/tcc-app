import axios, { AxiosError } from "axios";
import { environments } from "./environments";

const api = axios.create({
  baseURL: environments.api_url,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Aqui é Pura bagunça...

    const refreshToken = localStorage.getItem("refreshToken");

    const {status, data} = error.response as any

    if ('The E-mail or password is incorrect'.includes(data?.msg) && error.config?.url !== '/login') {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      window.location.href = '/';
    }

    if (!(status == 401 && data && data.msg && data.msg.includes('Token has expired'))) {
      return Promise.reject(error);
    }

    if (!error.config) throw new Error("Request Config not found.")

    try {
      const url = `${environments.api_url}/refresh`;
      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
          },
          body: JSON.stringify({})
      };

      const response = await fetch(url, options);
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);

      error.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return axios.request(error.config);

    } catch (refreshError) {
        console.error("Erro ao renovar token de acesso", refreshError);
        localStorage.removeItem('user');
        window.location.href = '/';
      }
  }
);

export default api;
