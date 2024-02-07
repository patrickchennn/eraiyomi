import { ArticleAsset } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"

const url = process.env.URL_API

export const PUT_articleAsset = async (
  articleId: string,
  formData: FormData,
  API_key: string
) => {
  let res!: Response
  let data
  const httpMethod = "PUT"

  try{
    res = await fetch(
      `${url}/article-asset/${articleId}`,
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${API_key}`
        },
        method: httpMethod,
        body: formData
      }
    )
    data = await res.json()
    
    if(!res.ok){
      // console.error(data)
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }
  }
  // @ts-ignore
  catch(err: Error){
    console.error(err.message)
    return undefined
  }

  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${res.status}`) )
  return data as {message:string,data:ArticleAsset}
}