import { POST_ReqBodyArticle, Article } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"
const url = process.env.URL_API

export const postArticle = async (
  reqBody: POST_ReqBodyArticle,
  API_key: string,
) => {
  let resData
  let res!: Response

  try{
    res = await fetch(
      `${url}/article`,
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${API_key}`
        },
        method: "POST",
        body: JSON.stringify(reqBody)
      }
    )
    // console.log("res=",res)

    resData = await res.json()
    if(!res.ok){
      // console.error("resData=",resData)
      const errMsg = resData?.message || 'An error occurred';
      throw new Error(errMsg);
    }
  }
  // @ts-ignore
  catch(err: Error){
    console.error(err)
    return undefined
  }
  console.log(chalk.green.bgBlack(`POST ${res.url} ${res.status}`) )

  return resData as {
    message:string,data: Article
  }
}