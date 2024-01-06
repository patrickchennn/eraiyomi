"use server"

import { postArticleComment } from "@/services/commentService";
import { User } from "@patorikkuuu/eraiyomi-types";
import chalk from "chalk";
import { revalidateTag } from "next/cache";

const handleCommentSubmit = async (
  prevState: any, 
  fd: FormData,
  articleId: string,
  user: User|undefined,
  userCredToken:string|undefined
) => {
  console.log(chalk.blue("@handleCommentSubmit"))
  // let userCredToken: string | null = getCookie("userCredToken");
  console.log("userCredToken=",userCredToken)
  console.log("user=",user)
  if(!userCredToken||!user) return
  // console.log("prevState=",prevState)

  const msg = fd.get("message")?.toString()
  if(!msg){
    return alert("input must not empty")
  }
  // console.log("msg=",msg)

  // console.log("userCredToken=",userCredToken)
  
  await postArticleComment(
    articleId,
    user,
    msg,
    userCredToken
  )

  return revalidateTag("comments")
}

export default handleCommentSubmit