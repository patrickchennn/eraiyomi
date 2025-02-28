import { apiService } from "../apiService";


export const postArticleImgContent = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  form: FormData
) => {
  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`,
      'x-api-key': API_key,
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

  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`,
      'x-api-key': API_key,
    }
  }
  return apiService<string>('put', `/article/${articleId}/image-content`, conf, form);
};