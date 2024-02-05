import { Article } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"

const url = process.env.URL_API


const getArticles = async (
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

export default getArticles