import api from "@config/api";

type Response<T = any> = {
  status: number;
  data: T,
}

export default class ProjectsService {
  async getProject<T>(id: string): Promise<Response<T>> {
    try {
      const response = await api.get(`/project/${id}`);
      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error("Error when logging in - ", error);
      const { data, status } = error.response;
      return { data, status };
    }
  }
  
  async getProjects<T>(): Promise<Response<T>> {
    try {
      const response = await api.get("/projects");
      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error("Error when logging in - ", error);
      const { data, status } = error.response;
      return { data, status };
    }
  }

  async createProject<T>(body: any): Promise<Response<T>> {
    try {
      const response = await api.post("/projects", body);
      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error("Error when logging in - ", error);
      const { data, status } = error.response;
      return { data, status };
    }
  }
  
  async updateProject<T>(id: string, body: any): Promise<Response<T>> {
    try {
      const response = await api.put(`/project/${id}`, body);
      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error("Error when logging in - ", error);
      const { data, status } = error.response;
      return { data, status };
    }
  }
}
