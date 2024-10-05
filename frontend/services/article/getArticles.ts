import { Article } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"
import { baseURL } from "../config"

const getArticles = async (
  queryParams:{
    sort: "newest" | "oldest" | "popular" | "unpopular",
    status?:"unpublished"|"published",
    search?:string
  },
  reqCache: RequestCache="default"
) => {
  console.trace();

  let res!: Response
  let dataRes=null;
  let status=null;
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
      `${baseURL}/articles?${params.toString()}`,
      {
        cache:reqCache
      }
    )
    // console.log("res=",res)

    // Check if the response is JSON by looking at the Content-Type header
    const contentType = res.headers.get('content-type');
    if(contentType && contentType.includes('application/json')){
      // If the Content-Type header indicates JSON, parse the response as JSON
      dataRes = await res.json()
    } else {
      // If the Content-Type header does not indicate JSON, handle it accordingly
      console.error(chalk.red.bgBlack('Response is not JSON:'),res);
      console.error(chalk.red.bgBlack("res.status=",res.status));

      // Additional error handling if needed
      throw new Error("Response is not JSON");

    }

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
      msg: err, 
      data:dataRes 
    };
  }


  console.log(chalk.green.bgBlack(`GET ${res.url} ${status}`))
  return { 
    status,
    msg: "", 
    data: dataRes as Article[]
  };
}

export default getArticles