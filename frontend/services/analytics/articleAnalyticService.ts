import { ArticlesAnalytic } from "@patorikkuuu/eraiyomi-types"
import { baseURL } from "../config"
import axios from "axios"
import httpResLog from "@/loggers/httpResLog"

export const getArticlesAnalytic = async () => {
  let dataRes
  let status = "";

  try{
    const res = await axios(`${baseURL}/articles/analytic`)
    dataRes = res.data
    status = `${res.status} ${res.statusText}`;

    httpResLog.ok(res.config.method, res.config.url,status)
  }
  catch(err){
    if (axios.isAxiosError(err) && err.response) {

      status = `${err.response.status} ${err.response.statusText}`;

      httpResLog.err(err.response.config.method,err.response.config.url,status)
      console.error(err.message)
      return null
    }
  }


  return dataRes as ArticlesAnalytic
}