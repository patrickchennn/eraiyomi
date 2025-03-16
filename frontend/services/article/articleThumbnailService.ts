import { apiService } from "../apiService";

export const getArticleThumbnail = async (
  articleId: string,
  reqCache: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached" = "default"
) => {
  const conf: RequestInit = {
    headers: {
      'Cache-Control': reqCache
    }
  }
  return apiService<string>('get', `/article/${articleId}/thumbnail`,conf);
};

export const postArticleThumbnail = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  thumbnailForm: FormData
) => {
  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`,
      'x-api-key': API_key,
    }
  }

  return apiService<string>('post', `/article/${articleId}/thumbnail`, conf, thumbnailForm);
};

export const putArticleThumbnail = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  thumbnailForm: FormData
) => {

  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`,
      'x-api-key': API_key,
    }
  }
  return apiService<string>('put', `/article/${articleId}/thumbnail`, conf, thumbnailForm);
};


export const deleteArticleThumbnail = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
) => {
  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }
  return apiService<any>('delete', `/article/${articleId}/thumbnail`, conf);
};