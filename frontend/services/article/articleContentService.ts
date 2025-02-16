import { apiService } from "../apiService";
import { AxiosRequestConfig } from "axios";

// const routePath = (articleId: string) => `/article/${articleId}/content`

export const getArticleContent = async (articleId: string) => {
  return apiService<{rawHtml: string, rawText: string} | null>('get', `/article/${articleId}/content`);
};




export const postArticleContent = async (
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

  return apiService<string>('post', `/article/${articleId}/content`, conf, form);
};




export const putArticleContent = async (
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
  return apiService<string>('put', `/article/${articleId}/content`, conf, form);
};




export const deleteArticleContent = async (
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
  return apiService<null>('delete', `/article/${articleId}/content`, conf);
};