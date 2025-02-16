import { Article } from "@shared/Article";
import { apiService } from "../apiService";
import { AxiosRequestConfig } from "axios";

export const postArticle = async (
  API_key: string,
  JWT_token: string,
  data: any
) => {
  const conf: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }
  return apiService<Article>('post', "/article", conf, data);
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

  const conf: AxiosRequestConfig = {
    params, // Automatically appends query parameters
    headers: {
      'Cache-Control': reqCache // Equivalent to request cache
    }
  }
  return apiService<Article[]>('get', `/articles`, conf);
};


export const putArticle = async (
  API_key: string,
  JWT_token: string,
  articleId: string,
  data: any
) => {
  const conf: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
      'x-api-key': API_key // API key in a custom header
    }
  }
  return apiService<string>('put', `/article/${articleId}`, conf, data);
};


export const deleteArticle = async (JWT_token: string,articleId: string) => {
  const conf: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${JWT_token}`, // JWT token
    }
  }
  return apiService<null>('delete', `/article/${articleId}`,conf);
};