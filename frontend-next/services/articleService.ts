import { Article, POST_ReqBodyArticle } from "@eraiyomi/types/Article"
import axios from "axios"
import chalk from "chalk"

const url = process.env.URL_API

export const getArticles = async (
  queryParams:{
    sort: "newest" | "oldest" | "popular" | "unpopular",
    status?:"unpublished"|"published",
    search?:string
  },
  reqCache: RequestCache="default"
) => {
  let res!: Response
  let dataRes
  let status
  const params = new URLSearchParams();

  // Add 'sort' parameter.
  if (queryParams.sort) {
    params.append('sort', queryParams.sort);
  }
  
  // Add 'status' parameter only if it's defined.
  if (queryParams.status !== undefined) {
    params.append('status', queryParams.status);
  }

  if (queryParams.search !== undefined) {
    params.append('search', queryParams.search);
  }
  
  
  try{
    res = await fetch(
      `${url}/articles?${params.toString()}`,
      {
        cache:reqCache
      }
    )

    dataRes = await res.json()
    status = `${res.status} ${res.statusText}`

    if(!res.ok){
      console.log("res=",res)
      const errMsg = dataRes?.message || 'An error occurred';
      throw new Error(errMsg);
    }
  }
  // @ts-ignore
  catch(err: Error){
    console.error(err)
    return { 
      status,
      errMsg: err.message, 
      data: undefined 
    };
  }


  console.log(chalk.green.bgBlack(`GET ${res.url} ${status}`))
  return { 
    status,
    errMsg: "", 
    data: dataRes as Article[]
  };
}






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






export const putArticle = async (
  some_key: string,
  articleId: string, 
  content?: any,
  action?: "like"|"dislike",
) => {
  let data
  let res!: Response
  const httpMethod = "PUT"

  try {
    res = await fetch(
      `${url}/article/${articleId}?action=${action}`,
      {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${some_key}`
        },
        body:content?JSON.stringify(content):null
      }
    )

    data = await res.json()
    
    if(!res.ok){
      // console.error(data)
      const errMsg = data?.message || 'An error occurred';
      throw new Error(errMsg);
    }

  } catch (error: unknown) {
    console.error(chalk.red.bgBlack(error))
    return undefined
  }


  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${res.status}`) )

  return data
}

export const deleteArticle = async (articleId: string,someKey: string) => {
  try {
    // expect 204
    await axios.delete(
      `${url}/article/${articleId}`,
      {
        headers:{
          Authorization:`Bearer ${someKey}`
        }
      }
    )

  } catch (error:any) {
    console.log(error.response);
    return error.response;
  }
}
