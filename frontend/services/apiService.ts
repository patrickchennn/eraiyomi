import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { baseURL } from './config';
import httpResLog from '@/loggers/httpResLog';

// Standardized response format
interface ApiResponse<T> {
  status: string;
  message: string | null;
  data: T | null;
}

// Generic API service function
export const apiService = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  config?: AxiosRequestConfig,
  data?: any,
): Promise<ApiResponse<T>> => {
  let status = '';
  let dataRes: T | null = null;

  try {
    const res: AxiosResponse<T> = await axios({
      method,
      url: `${baseURL}${url}`,
      data,
      ...config,
    });

    dataRes = res.data;
    status = `${res.status} ${res.statusText}`;

    // Log successful responses
    httpResLog.ok(method, url, status);
  } catch (err) {
    console.error(err);

    // Handle Axios errors
    if (axios.isAxiosError(err) && err.response) {
      status = `${err.response.status} ${err.response.statusText}`;

      return {
        status,
        message: err.response.data?.message || 'An error occurred',
        data: null,
      };
    }

    // Handle other errors (e.g., network errors)
    return {
      status: 'Error',
      message: 'A network or unexpected error occurred',
      data: null,
    };
  }

  return {
    status,
    // Property 'message' does not exist on type 'T'.ts(2339)
    // @ts-ignore
    message: dataRes.message || null,
    data: dataRes,
  };
};