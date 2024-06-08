import api from "@config/api";

type Response<T = any> = {
  status: number;
  data: T,
  msg: string
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
          return { status: response.status, data: response.data, msg: response.data.msg };
        } catch (error: any) {
          console.error("Error - ", error);
          const { data, status } = error.response;
          return { data, status, msg: data?.msg };
        }
    }
    
    edit<T>(id: string, data: UpdateUser): Promise<Response<T>> {
      return this.request<T>(() => api.patch(`/user-edit/${id}`, data));
    }

    editprofile<T>(data: any): Promise<Response<T>> {
      return this.request<T>(() => api.patch('/photo-profile', data));
    }
    
    getProfile<T>(): Promise<Response<T>> {
      return this.request<T>(() => api.get('/photo-profile', {
        responseType: 'blob'
      }));
    }
}