import api from "@config/api";
import { AxiosRequestConfig } from "axios";

export type Response<T = any> = {
  status: number;
  data: T,
  msg: string
}

export default class ProjectsService {
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

  getProject<T>(
    id: string,
    params?: { pending_final_approval?: boolean, include_final_stage?: boolean }
  ): Promise<Response<T>> {
    return this.request<T>(() => api.get(`/project/${id}`, { params }));
  }

  getProjects<T>(
    params?: { pending_final_approval?: boolean, include_final_stage?: boolean, completed?: boolean }
  ): Promise<Response<T>> {
    return this.request<T>(() => api.get("/projects", { params }));
  }

  createProject<T>(data: any): Promise<Response<T>> {
    return this.request<T>(() => api.post("/projects", data));
  }

  updateProject<T>(id: string, data: any): Promise<Response<T>> {
    return this.request<T>(() => api.put(`/project/${id}`, data));
  }

  approvalProject<T>(id: string, data: { approve: boolean }): Promise<Response<T>> {
    return this.request<T>(() => api.put(`/project/${id}/approval`, data));
  }

  sendNewCommentProject<T>(
    id: string,
    data: { message: string, stageId: number }
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
    file_type: 1 | 2,
    data: any,
  ): Promise<Response<T>> {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: { file_type }
    }
    return this.request<T>(() => api.post(`project/${projectId}/${stageId}/file/${fileId}/upload`, data, config));
  }

  downloadProjectFile<T>(
    projectId: string,
    stageId: number,
    fileId: string,
    params: { file_type: 1 | 2 }
  ): Promise<Response<T>> {
    const config: AxiosRequestConfig = {
      responseType: 'blob',
      params: params
    }
    return this.request<T>(() => api.get(
      `project/${projectId}/${stageId}/file/${fileId}/download`, config)
    );
  }

  proceedStage<T>(projectId: string): Promise<Response<T>> {
    return this.request<T>(() => api.put(`project/${projectId}/proceed`));
  }

  revertStage<T>(projectId: string, stageId: number): Promise<Response<T>> {
    return this.request<T>(() => api.put(`project/${projectId}/stage/${stageId}/revert`));
  }

  completedProject<T>(projectId: string): Promise<Response<T>> {
    return this.request<T>(() => api.post(`project/${projectId}/completed`));
  }
}