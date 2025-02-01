import { HTTPGetUserRes } from "@patorikkuuu/eraiyomi-types";
import chalk from "chalk";
import { baseURL } from "../config";
import axios from "axios";
import httpResLog from "@/loggers/httpResLog";

export const POST_verify = async (userCredToken: string) => {

  let resData
  let status = "";
  try{
    const res = await axios(
      `${baseURL}/user/verify`,
      {
        headers: {
          'Authorization': `Bearer ${userCredToken}`
        },
        method: 'POST',
        // credentials:"include"
      }
    )
    resData = res.data
    status = `${res.status} ${res.statusText}`;

    console.info(chalk.green.bgBlack(`[INF] ${res.config.method} ${res.config.url} ${res.status} ${res.statusText}`) )
    httpResLog.ok(res.config.method,res.config.url,status)

  }
  catch(err){
    if (axios.isAxiosError(err) && err.response) {
      status = `${err.response.status} ${err.response.statusText}`;

      // console.error(err)
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
