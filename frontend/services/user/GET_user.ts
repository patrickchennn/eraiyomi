import { baseURL } from "../config"
import axios from "axios"
import httpResLog from "@/loggers/httpResLog"
import { HTTPGetUserRes } from "@patorikkuuu/eraiyomi-types"

export const GET_user = async (username: string) => {
  let resData
  let status = "";

  try{
    const res = await axios(`${baseURL}/user/?username=${username}`, {method:"get"})
    resData = res.data
    status = `${res.status} ${res.statusText}`;

    httpResLog.ok(res.config.method, res.config.url,status)
  }
  catch(err){
    if (axios.isAxiosError(err) && err.response) {
      status = `${err.response.status} ${err.response.statusText}`;

      httpResLog.err(err.response.config.method,err.response.config.url,status)

      console.error(err.message)
      return {
        status, 
        message:err.response.data.message, 
        data:null
      }
    }
  }

  return {
    status,
    message:"ok",
    data:resData as HTTPGetUserRes
  }
}
