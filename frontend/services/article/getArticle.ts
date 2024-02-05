import { Article } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"

const url = process.env.URL_API

export const getArticle = async (
  articleId: string,
  title:string,
) => {
  let res!: Response
  let data
  let status
  try{
    res = await fetch(`${url}/article/?id=${articleId}&title=${title}`)
    data = await res.json()
    status = `${res.status} ${res.statusText}`
    
    if(!res.ok){
      const errMsg = data?.message || 'An error occurred';
      throw new Error(errMsg);
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

  console.log(chalk.green.bgBlack(`GET ${res.url} ${status}`) )
  return { 
    status,
    errMsg: "", 
    data: data as Article
  };

}