import api from "@config/api";

type Login = {
  email: string;
  password: string;
};

type Register = {
  username: string;
  password: string;
  email: string;
  full_name: string;
  role: 1 | 2 | 3 | 4;
}

type Response<T = any> = {
  status: number;
  data: T,
}

export default class AuthService {
  async login<T>(data: Login): Promise<Response<T>> {
    try {
      const response = await api.post("/login", data);
      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error("Error when logging in - ", error);
      const { data, status } = error.response;
      return { data, status };
    }
  }

  async register<T>(data: Register): Promise<Response<T>> {
    try {
      const response = await api.post("/register", data);
      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error("Error registering new user - ", error);
      const { data, status } = error.response;
      return { data, status };
    }
  }

  async logout(): Promise<Response> {
    try {
      const response = await api.post("/logout");
      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error("Error logged out - ", error);
      const { data, status } = error.response;
      return { data, status };
    }
  }
}