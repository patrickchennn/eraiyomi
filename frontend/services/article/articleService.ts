import { Article, ArticlePostRequestBody } from "@shared/Article";
import { apiService } from "../apiService";

export const postArticle = async (
  API_key: string,
  JWT_token: string,
  data: ArticlePostRequestBody
) => {
  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`,
      'x-api-key': API_key,
      "Content-Type": "application/json"
    }
  }
  return apiService<Article>('post', "/article", conf, JSON.stringify(data));
};

export const getArticle = async (articleId: string) => {
  return apiService<Article>('get', `/article/${articleId}`);
};

export const getArticles = async (
  queryParams: {
    sort: "newest" | "oldest" | "popular" | "unpopular";
    status?: "unpublished" | "published";
    search?: string;
  },
  reqCache: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached" = "default"
) => {

  const params = new URLSearchParams();

  // Add 'sort' parameter.
  if (queryParams.sort) {
    params.append("sort", queryParams.sort);
  }

  // Add 'status' parameter only if it's defined.
  if (queryParams.status !== undefined) {
    params.append("status", queryParams.status);
  }

  // Add 'search' parameter if it's defined.
  if (queryParams.search !== undefined) {
    params.append("search", queryParams.search);
  }

  const conf: RequestInit = {
    headers: {
      'Cache-Control': reqCache
    }
  }
  return apiService<Article[]>('get', `/articles?${params.toString()}`, conf);
};


export const putArticle = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  data: any
) => {
  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }
  return apiService<string>('put', `/article/${articleId}`, conf, data);
};


export const deleteArticle = async (JWT_token: string,articleId: string) => {
  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
    }
  }
  return apiService<null>('delete', `/article/${articleId}`,conf);
};