
import { User } from "@patorikkuuu/eraiyomi-types";
import { ArticleCommentReply } from "@patorikkuuu/eraiyomi-types";
import getCookie from "../utils/getCookie"
import chalk from "chalk";


const url = process.env.URL_API



export const getReplies = async (articleId: string,commentId: string) => {
  let data
  let res!: Response;
  try {
    res = await fetch(`${url}/article/${articleId}/comment/${commentId}/replies`)
    data = await res.json()

    if(!res.ok){
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }

  } catch (error: unknown) {
    console.error(error)
    return undefined
  }


  console.log(chalk.green.bgBlack(`GET ${res.url} ${res.status}`) )

  return data as {parentCommentId: string,replies: ArticleCommentReply[]}
}





export const postCommentReply = async (
  articleId: string, 
  commentId: string,
  msg: string,
  userCredToken: string
) => {
  let data;
  let res!: Response;
  const httpMethod = "POST"
  let status

  // console.log(userCredToken)

  try{
    res = await fetch(
      `${url}/article/${articleId}/comment/${commentId}/reply`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userCredToken}`
        },
        method: httpMethod,
        body:JSON.stringify({
          message: msg
        }),
      }
    )
    data = await res.json()
    status = `${res.status} ${res.statusText}`
    if(!res.ok){
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }
  }catch(err: unknown){
    console.log(chalk.red.bgBlack(`${httpMethod} ${res.url} ${status}`))
    console.error(err)
  }

  
  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${status}`))

  return data as ArticleCommentReply
}






export const putReply = async (
  articleId: string,
  commentId: string,
  replyId: string,
  action?: string,
  editMsg?: string
) => {
  let data
  let res!: Response
  const userCredToken: string | null = getCookie("userCredToken");

  try {
    res = await fetch(
      `${url}/article/${articleId}/comment/${commentId}/reply/${replyId}?action=${action}`,
      {
        method:"PUT",
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

  } catch (error:unknown) {
    console.error(error);
  }

  if(!res.ok){
    console.error(data)
    const errorMessage = data?.message || 'An error occurred';
    throw new Error(errorMessage);
  }
  console.log(chalk.green.bgBlack(`PUT ${res.url} ${res.status}`) )

  return data as {message: string, reply: ArticleCommentReply}
}




export const deleteReply = async (
  articleId: string,
  commentId: string,
  replyId: string,
) => {
  let resData
  let res!: Response
  const userCredToken: string | null = getCookie("userCredToken");

  // console.log(userCredToken)
  try {
    res = await fetch(
      `${url}/article/${articleId}/comment/${commentId}/reply/${replyId}`,
      {
        headers: {
          'Authorization': `Bearer ${userCredToken}`
        },
        method:"DELETE",
      }
    )
    resData = await res.json()
    if(!res.ok){
      console.error(resData)
      const errorMessage = resData?.message || 'An error occurred';
      throw new Error(errorMessage);
    }else{
      console.log(chalk.green.bgBlack(`DELETE ${res.url} ${res.status}: ${res.statusText}`) )
      return
    }
  } catch (error: unknown) {
    console.error(error)
  }

}