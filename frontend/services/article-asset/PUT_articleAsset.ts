
import { baseURL } from "../config"
import axios from "axios"
import httpResLog from "@/loggers/httpResLog"

export const PUT_articleAsset = async (
  articleId: string,
  formData: FormData,
  API_key: string
) => {
  let resData: string = ""
  let status = "";

  try{
    const res = await axios(
      `${baseURL}/article-asset/${articleId}`,
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${API_key}`
        },
        method: "put",
        data:formData
      }
    )
    status = `${res.status} ${res.statusText}`;

    resData = res.data
    httpResLog.ok(res.config.method, res.config.url, status)

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
    message:resData,
    data:null
  }
}