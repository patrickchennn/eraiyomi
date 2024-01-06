import { ArticleAsset } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"

const url = process.env.URL_API

export const GET_articleAsset = async (articleId: string) => {
  let res!: Response
  let data
  const httpMethod = "GET"
  let status

  try{
    res = await fetch(
      `${url}/article-asset/?id=${articleId}`,
    )
    data = await res.json()
    status = `${res.status} ${res.statusText}`

    
    if(!res.ok){
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }
  }
  // @ts-ignore
  catch(err: Error){
    console.error(err.message)

    return { 
      status,
      errMsg: err.message, 
      data: undefined 
    };
  }


  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${res.status}`) )
  return { 
    status,
    errMsg: "", 
    data: data as ArticleAsset 
  };
}




export const GET_articlesAsset = async () => {
  let res!: Response
  let data
  const httpMethod = "GET"

  try{
    res = await fetch(
      `${url}/articles-asset`,
    )
    data = await res.json()
    
    if(!res.ok){
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }
  }
  // @ts-ignore
  catch(err: Error){
    console.error(chalk.red.bgBlack(err.message))

    return undefined
  }


  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${res.status}`) )
  return data as ArticleAsset[]
}



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
  return data as any
}


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
      `${url}/article-asset/${articleId}/thumbnail`,
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
