import chalk from "chalk"
import { baseURL } from "../config"

export const PUT_thumbnail = async (
  articleId: string,
  formData: FormData,
  API_key: string
) => {
  let res!: Response
  let data
  const httpMethod = "PUT"

  try{
    res = await fetch(
      `${baseURL}/article-asset/${articleId}/thumbnail`,
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
  return data as any
}