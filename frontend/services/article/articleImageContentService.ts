import { apiService } from "../apiService";
import { AxiosRequestConfig } from "axios";




export const postArticleImgContent = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  form: FormData
) => {
  const conf: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }

  return apiService<string>('post', `/article/${articleId}/image-content`, conf, form);
};




export const putArticleImgContent = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  form: FormData
) => {

  const conf: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }
  return apiService<string>('put', `/article/${articleId}/image-content`, conf, form);
};