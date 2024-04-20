import api from "@config/api";
import { AxiosRequestConfig } from "axios";

type Response<T = any> = {
  status: number;
  data: T,
}

export default class ProjectsService {
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

  getProject<T>(id: string): Promise<Response<T>> {
    return this.request<T>(() => api.get(`/project/${id}`));
  }
  
  getProjects<T>(): Promise<Response<T>> {
    return this.request<T>(() => api.get("/projects"));
  }

  createProject<T>(data: any): Promise<Response<T>> {
    return this.request<T>(() => api.post("/projects", data));
  }
  
  updateProject<T>(id: string, data: any): Promise<Response<T>> {
    return this.request<T>(() => api.put(`/project/${id}`, data));
  }

  approvalProject<T>(id: string, data: {approve: boolean}): Promise<Response<T>> {
    return this.request<T>(() => api.put(`/project/${id}/approval`, data));
  }

  sendNewCommentProject<T>(
    id: string, 
    data: { message: string, stageId: number}
  ): Promise<Response<T>> {
    return this.request<T>(() => api.post(`/project/${id}/comment`, data));
  }

  getCommentsFromStage<T>(projectId: string, stageId: number): Promise<Response<T>> {
    return this.request<T>(() => api.get(`project/${projectId}/stage/${stageId}`));
  }
 
  uploadProjectFile<T>(
    projectId: string, 
    stageId: number, 
    fileId: string,
    data: any,
  ): Promise<Response<T>> {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return this.request<T>(() => api.post(`project/${projectId}/${stageId}/file/${fileId}/upload`, data, config));
  }

  downloadProjectFile<T>(
    projectId: string, 
    stageId: number, 
    fileId: string,
    filetype: "file_path" | "return_file_path",
  ): Promise<Response<T>> {
    const config: AxiosRequestConfig = {
      responseType: 'blob'
    }
    return this.request<T>(() => api.get(
      `project/${projectId}/${stageId}/file/${fileId}/filetype/${filetype}/download`, config)
    );
  }
}