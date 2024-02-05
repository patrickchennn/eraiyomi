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