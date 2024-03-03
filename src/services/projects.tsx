import api from "@config/api";

type Response<T = any> = {
  status: number;
  data: T,
}

export default class ProjectsService {
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
}