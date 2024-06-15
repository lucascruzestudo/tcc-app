import api from "@config/api";

type Login = {
  email: string;
  password: string;
};

type Register = {
  password: string;
  email: string;
  full_name: string;
  role: number;
  secret_manager?: string;
}

type Response<T = any> = {
  status: number;
  data: T,
  msg: string
}

export default class AuthService {

  private async request<T>(method: () => Promise<any>): Promise<Response<T>> {
    try {
      const response = await method();
      return { status: response.status, data: response.data, msg: response.data.msg };
    } catch (error: any) {
      console.error("Error - ", error);
      const { data, status } = error.response;
      return { data, status, msg: data?.msg };
    }
  }

  login<T>(data: Login): Promise<Response<T>> {
    return this.request<T>(() => api.post("/login", data));
  }

  register<T>(data: Register): Promise<Response<T>> {
    return this.request<T>(() => api.post("/register", data));
  }

  logout<T>(): Promise<Response<T>> {
    return this.request<T>(() => api.post("/logout"));
  }

  sendResetPassword<T>(email: string): Promise<Response<T>> {
    return this.request<T>(() => api.post("/request-password-reset", { email }));
  }

  resetPassword<T>(new_password: string, otp: string): Promise<Response<T>> {
    return this.request<T>(() => api.post(`/reset-password/${otp}`, { new_password }));
  }

}