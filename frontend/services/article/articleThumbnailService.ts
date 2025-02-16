import { apiService } from "../apiService";
import { AxiosRequestConfig } from "axios";

export const getArticleThumbnail = async (articleId: string) => {
  return apiService<{remoteUrl: string}>('get', `/article/${articleId}/thumbnail`);
};

export const postArticleThumbnail = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  thumbnailForm: FormData
) => {
  const conf: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }

  return apiService<{remoteUrl: string}>('post', `/article/${articleId}/thumbnail`, conf, thumbnailForm);
};

export const putArticleThumbnail = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  thumbnailForm: FormData
) => {

  const conf: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }
  return apiService<string>('put', `/article/${articleId}/thumbnail`, conf, thumbnailForm);
};


export const deleteArticleThumbnail = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
) => {
  const conf: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }
  return apiService<any>('delete', `/article/${articleId}/thumbnail`, conf);
};