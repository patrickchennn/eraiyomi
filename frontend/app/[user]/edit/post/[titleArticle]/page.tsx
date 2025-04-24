import EditArticle from '@/components/user/edit-post/EditArticle';
import { getArticle } from '@/services/article/articleService';
import { getUser, postVerifyUser } from '@/services/user/userService';
import chalk from 'chalk';
import { cookies } from 'next/headers';
import React from 'react'

interface PageProps{
  params: { 
    titleArticle: string
    user: string
  }
  searchParams: { id: string };
}
export default async function Page({params,searchParams}: PageProps) {
  console.info(chalk.blueBright.bgBlack(`Page: ${params.user}/edit/post/${params.titleArticle}?id=${searchParams.id}`))

  console.log("params=",params)

  console.log("searchParams=",searchParams)

  // ~~~~~~~~~~~~~~~~~~~~Security check level 1: On article data~~~~~~~~~~~~~~~~~~~~
  // IF: the user intentionally remove the article's query `id`
  if(!searchParams.id){
    return (
      <h1>404 Not Found</h1>
    )
  }

  const article = await getArticle(searchParams.id,{headers:{"Cache-Control":"no-store"}})
  // console.log("article=",article)

  if(article.data===null){
    return (
      <pre>{JSON.stringify(article, null, 4)}</pre>
    )
  }

  // ~~~~~~~~~~~~~~~~~~~~Security check level 2: On user authenticity~~~~~~~~~~~~~~~~~~~~
  const user = await getUser({username:params.user})
  console.log("user=",user)

  // IF: user does not exist --> display 404
  if(!user.data){
    return (
      <pre>{JSON.stringify(user, null, 4)}</pre>
    )
  }

  const cookieStore = cookies()

  const userCredToken = cookieStore.get('userCredToken')
  // console.log("userCredToken=",userCredToken)

  // IF: there is not JWT, I.E. the user has never logged in before
  if(!userCredToken){
    return (
      <h1>401 Unauthorized</h1>
    )
  }

  let verifiedUser: {
    status: string;
    message: any;
    data: any;
  } = {
    status: "",
    message: "",
    data: null
  }
  // IF: there is a JWT
  if(userCredToken){
    // verify JWT
    verifiedUser = await postVerifyUser(userCredToken.value)
    // console.log("verifiedUser=",user)
  }

  // IF the JWT is not valid
  if(!verifiedUser.data){
    return (
      <pre>{JSON.stringify(verifiedUser, null, 4)}</pre>
    )
  }
  
  return (
    <EditArticle initArticle={article.data} />
  )
}