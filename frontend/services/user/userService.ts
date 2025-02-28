import { apiService } from "../apiService";
import { User, UserLoginRequestBody } from "@shared/User";

export const postRegisterUser = async (
  API_key: string,
  data: {
    username:string,
    email:string,
    password:string
  },

) => {
  const conf: RequestInit = {
    headers:{
      "Content-Type":"application/json",
      'Authorization': `Bearer ${API_key}`
    },
    method: "POST",
  }
  return apiService<string>('post', "/user", conf, JSON.stringify(data));
};




export const getUser = async (
  queries: {
    username?:string
    email?:string
    id?:string
  }
) => {
  const params = new URLSearchParams();

  // Add 'email' parameter only if it's defined.
  if (queries.email !== undefined) {
    params.append("email", queries.email);
  }

  // Add 'username' parameter.
  if (queries.username !== undefined) {
    params.append("username", queries.username);
  }

  // Add 'id' parameter.
  if (queries.id !== undefined) {
    params.append("id", queries.id);
  }

  return apiService<User>('get', `/user?${params.toString()}`);
};




export const postVerifyUser = async (JWT: string) => {


  const conf: RequestInit = {
    headers: {
      'Authorization': `Bearer ${JWT}`
    },
    // credentials:"include"
  }
  return apiService<User>('post', `/user/verify`, conf);
};




export const postLogin = async (loginData: UserLoginRequestBody) => {
  const conf: RequestInit = {
    credentials: "include",
    headers:{
      "Content-Type":"application/json"
    }
  }
  return apiService<User>('post', `/user/login-traditional`, conf, JSON.stringify(loginData));
};