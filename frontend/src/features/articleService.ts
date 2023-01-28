import { Article, Comments } from "../../types/Article"
import { Account } from "../../types/Account"
import handleErrRes from "./handleErrRes"


let url: string = "http://localhost:8080/api/article"

export const getArticles = async () => {
  let data: Article[]
  try{
    const etag: string = localStorage.getItem("etag-articles")
    const res = await fetch(
      `${url}s`,
      {
        headers:{
          "if-none-match":etag
        }
      }
    )

    // if true, it means the data was fetched from the localstorage, the data was cached with etag
    if(res.status===304){
      console.log(`GET ${url} ${304}\nCached on localstorage `)
      return JSON.parse(localStorage.getItem("articles"))
    }

    handleErrRes(res,"GET")

    // store the etag value which is generated from the server
    localStorage.setItem("etag-articles",res.headers.get('Etag'))

    data = await res.json()
    localStorage.setItem("articles",JSON.stringify(data))

    console.log(`GET ${url} ${res.status}\n`,data)
    
  }catch(err: unknown){
    alert(err)
    console.error(err)
  }
  return data
}





export const getArticle = async (titleArticle: string) => {
  let data: Article
  try{
    const res = await fetch(`${url}/${titleArticle}`)
    handleErrRes(res,"GET")
    data = await res.json()
    console.log(`GET ${res.url}\n`,data)
  }catch(err: any){
    console.error(err)
  }
  return data
}





export const postArticleComment = async(
  articleId: string, 
  accountInfo: Account,
  msg: string
) => {
  let data: Comments
  try{
    let res: Response = await fetch(
      `${url}/comment/${articleId}`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          name: accountInfo.name,
          email: accountInfo.email,
          id: accountInfo.id,
          profilePict: accountInfo.picture,
          commentMsg: msg,
        }),
      }
    )
    handleErrRes(res,"POST")

    alert("comment added!")

    data = await res.json()
    console.log(`POST ${res.url}`,data)
  }catch(err: any){
    console.error(err)
  }
  return data
}





export const putArticleLike = async (
  articleId: string, 
  email: string,
) => {
  let data: Article

  try {
    let res: Response = await fetch(
      `${url}/like/${articleId}`,
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          email,
        }),
      }
    )
    handleErrRes(res,"PUT")

    data = await res.json()
    console.log(`PUT ${res.url}`,data)
  } catch (error: any) {
    console.error(error)
  }
  return data
}





export const postCommentReply = async (
  articleId: string, 
  uniqueCommentId: string,
  accountInfo: Account, 
  msg: string
) => {
  let data: Comments;
  try{
    const res = await fetch(
      `${url}/comment/reply/${articleId}/${uniqueCommentId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body:JSON.stringify({
          name: accountInfo.name,
          email: accountInfo.email,
          profilePict: accountInfo.picture,
          id: accountInfo.id,
          replyMsg: msg
        }),
      }
    )
    handleErrRes(res,"POST")
  
    data = await res.json()
    console.log(`POST ${res.url}\n`,data)
  }catch(err: any){
    console.error(err)
  }
  return data
}





export const putCommentLikeDislike = async (
  articleId: string,
  uniqueCommentId: string,
  type: string,
  accountInfo: Account
) => {
  let data: Comments
  try {
    const res = await fetch(
      `${url}/comment/like-dislike/${articleId}/${uniqueCommentId}?type=${type}&accountId=${accountInfo.id}`,
      {
        method:"PUT"
      }
    )
    handleErrRes(res,"POST")
    data = await res.json()
    console.log(`PUT ${res.url}\n`,data)
  } catch (err: any) {
    console.error(err)
  }
  return data
}





export const putCommentEdit = async (
  articleId: string,
  uniqueCommentId: string,
  editMsg: string,
) => {
  let data: Comments
  try {
    const res = await fetch(
      `http://localhost:8080/api/article/comment/edit/${articleId}/${uniqueCommentId}`,
      {
        method:"PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          editMsg
        }),
      }
    )
    handleErrRes(res,"PUT")

    data = await res.json()
    console.log(`PUT ${res.url}\n`,data)
  } catch (error:any) {
    console.error(error);
  }
  return data
}





export const deleteCommentDelete = async (
  articleId: string,
  uniqueCommentId: string,
) => {
  let data: Comments
  try {
    const res = await fetch(
      `http://localhost:8080/api/article/comment/delete/${articleId}/${uniqueCommentId}`,
      {
        method:"DELETE"
      }
    )
    if(!res.ok){
      throw new Error(`DELETE ${res.url}.\n HTTP status: ${res.status}.\n ${res.statusText}`)
    }
    data = await res.json()
    console.log(`DELETE ${res.url}\n`,data)
  } catch (error: any) {
    console.error(error)
  }
  return data
}