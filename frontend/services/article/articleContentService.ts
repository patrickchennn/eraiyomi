import { apiService } from "../apiService";

export const getArticleContent = async (
  articleId: string,
  conf: any
) => {
  // const conf: RequestInit = {
  //   headers: {
  //     'Cache-Control': reqCache
  //   }
  // }
  return apiService<{rawHtml: string, rawText: string, images: [{fileName: string, relativePath: string, mimeType: string, s3Url: string}]} | null>('get', `/article/${articleId}/content`,conf);
};




export const postArticleContent = async (
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

  return apiService<string>('post', `/article/${articleId}/content`, conf, form);
};




export const putArticleContent = async (
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
  return apiService<string>('put', `/article/${articleId}/content`, conf, form);
};




export const deleteArticleContent = async (
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
  return apiService<null>('delete', `/article/${articleId}/content`, conf);
};