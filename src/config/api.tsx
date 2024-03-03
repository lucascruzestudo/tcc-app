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
    debugger
    const refreshToken = localStorage.getItem("refreshToken");

    const url_map = ["/login", "/register"]

    if (
      !error.response || 
      !refreshToken || 
      error.response.status !== 401 || 
      url_map.includes(error.response.config.url ?? "")
    ) {
      return Promise.reject(error);
    }
           
    try {
      const response = await axios.post(`${environments.api_url}/refresh`, {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        }
      });

      if (!error.config) throw new Error("Request Config not found.")
      
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);

      error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      
      return axios.request(error.config);

    } catch (refreshError) {
        console.error("Erro ao renovar token de acesso", refreshError);
        localStorage.removeItem('user');
        window.location.href = '/';
      }
  }
);

export default api;
