import api from "@config/api";

type Response<T = any> = {
  status: number;
  data: T,
}

type UpdateUser = {
    currentPassword?: string;
    newPassword?: string;
    profile_picture?: string;
    email?: string;
    full_name?: string,
}

export default class UserService {
    private async request<T>(method: () => Promise<any>): Promise<Response<T>> {
        try {
          const response = await method();
          return { status: response.status, data: response.data };
        } catch (error: any) {
          console.error("Error - ", error);
          const { data, status } = error.response;
          return { data, status };
        }
    }
    
    edit<T>(id: string, data: UpdateUser): Promise<Response<T>> {
      return this.request<T>(() => api.patch(`/user-edit/${id}`, data));
    }
}