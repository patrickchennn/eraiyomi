import React from "react"
import chalk from "chalk"
import getCookie from "@/utils/getCookie"
import { deleteArticle } from "@/services/article/articleService"

interface DeleteBtnProps {
  buttonStyle: string
  API_key: string
  articleId: string
}
export default function DeleteBtn({
  buttonStyle,
  API_key,
  articleId
}: DeleteBtnProps){
  const handleDelete = async () => {
    console.log(chalk.blueBright.bgBlack("[INF] @handleDelete()"))
    
    // Client-side check IF: API key is not provided
    console.log("API_key=",API_key)
    if(!API_key) return alert("API key is needed.")

    const JWT_token = getCookie("userCredToken")
    console.log("JWT_token=",JWT_token)
    // Client-side check IF: the user have not login or maybe intentionally remove JWT
    if(JWT_token===null){
      return alert("No JWT provided")
    }

    const deleteArticleRes = await deleteArticle(JWT_token,articleId)
    console.log("deleteArticleRes=",deleteArticleRes)
    if(deleteArticleRes.status!=="204 No Content"){
      return alert(deleteArticleRes.message)
    }
    alert(deleteArticleRes.status)
  }

  
  return (
    <button onClick={handleDelete} className={buttonStyle}>Delete</button>
  )
}