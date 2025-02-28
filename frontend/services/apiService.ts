import { baseURL } from './config';
import chalk from 'chalk';

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
  config?: RequestInit,
  data?: BodyInit,
): Promise<ApiResponse<T>> => {
  let status = '';
  let dataRes: T | null = null;

  try {
    const response = await fetch(`${baseURL}${url}`, {
      method,
      ...config,
      body: data,
    });

    let resData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      resData = await response.json();
    } else {
      resData = await response.text();
    }
    // console.log("resData=",resData)

    status = `${response.status} ${response.statusText}`;

    if (!response.ok) {
      console.error(chalk.red.bgBlack(`[ERR] ${method} ${url} ${status}`) )
      console.error(chalk.red.bgBlack("[ERR]"), resData);
      return {
        status,
        message: typeof resData === 'object' ? resData?.message || 'An error occurred' : resData,
        data: null,
      };
    }

    dataRes = resData;
    console.info(chalk.green.bgBlack(`[OK] ${method} ${url} ${status}`) )
  } catch (err) {
    console.error(err);
    return {
      status: 'Error',
      message: 'A network or unexpected error occurred',
      data: null,
    };
  }


  return {
    status,
    message: (dataRes as any).message,
    data: (dataRes as any).data,
  };
};
