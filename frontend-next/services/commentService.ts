import { ArticleComment, ArticleCommentResponse } from "@eraiyomi/types/Comment"
import getCookie from "../utils/getCookie"
import { User } from "@eraiyomi/types/User"
import chalk from "chalk"

const url = process.env.URL_API




export const getArticleComments = async (
  articleId: string,
  revalidateTags: string[],
  isCache=false,
) => {
  let data
  let res!: Response
  let status

  try{
    res = await fetch(
      `${url}/article/${articleId}/comments`,
      {
        cache:isCache?"force-cache":"no-cache",
        next:{
          tags:revalidateTags
        }
      }
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
    console.log(chalk.red.bgBlack(`GET ${res.url} ${status}`) )
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
    data: data as ArticleCommentResponse
  };
}






export const postArticleComment = async(
  articleId: string, 
  user: User,
  msg: string,
  userCredToken: string
) => {
  let data
  let res!: Response
  const httpMethod = "POST"
  let status;

  try{
    res = await fetch(
      `${url}/article/${articleId}/comment`,
      {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userCredToken}`
        },
        body:JSON.stringify({
          displayName: user.username,
          profilePictureUrl: user.profilePictureUrl,
          message: msg,
          userId:user.userId
        }),
      }
    )
    data = await res.json()
    status = `${res.status} ${res.statusText}`
  }catch(err: unknown){
    console.error(err)
  }

  if(!res.ok){
    console.error(data)
    const errorMessage = data?.message || 'An error occurred';
    throw new Error(errorMessage);
  }

  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${status}`) )
  return data as ArticleCommentResponse
}






export const putComment = async (
  articleId: string,
  commentId: string,
  editMsg?: string,
  action?: string
) => {
  let data
  let res!: Response
  const userCredToken: string | null = getCookie("userCredToken");
  const httpMethod = "PUT"
  let status;

  try {
    res = await fetch(
      `${url}/article/${articleId}/comment/${commentId}?action=${action}`,
      {
        method:httpMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userCredToken}`
        },
        body:JSON.stringify({
          message:editMsg
        }),
      }
    )
    data = await res.json()
    status = `${res.status} ${res.statusText}`
    
    if(!res.ok){
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }

  } catch (error:unknown) {
    console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${status}`) )
    console.error(error);
  }

  
  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${status}`) )

  return data as {message: string, comment: ArticleComment}
}





export const deleteComment = async (
  articleId: string,
  commentId: string,
) => {
  let data
  let res!: Response
  const userCredToken: string | null = getCookie("userCredToken");
  const httpMethod = "DELETE"
  let status;

  try {
    res = await fetch(
      `${url}/article/${articleId}/comment/${commentId}`,
      {
        headers:{
          'Authorization': `Bearer ${userCredToken}`
        },
        method:httpMethod
      }
    )
    data = await res.json()
    status = `${res.status} ${res.statusText}`

    if(!res.ok){
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }

  } catch (error: unknown) {
    console.log(chalk.red.bgBlack(`${httpMethod} ${res.url} ${status}`) )
    console.error(error)
  }
  
  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${status}`) )
}