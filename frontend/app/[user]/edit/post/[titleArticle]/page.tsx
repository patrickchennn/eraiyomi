"use server"

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
  console.info(chalk.blueBright.bgBlack(`[INF] Rendering ${params.user}/edit/post/${params.titleArticle}?id=${searchParams.id} Page`))


  console.log("params=",params)
  console.log("searchParams=",searchParams)

  // SECURITY client-side check IF: the user intentionally remove the query `id`
  if(!searchParams.id){
    return (
      <h1>404 Not Found</h1>
    )
  }


  const user = await getUser({username:params.user})
  // console.log("user=",user)

  // IF: user does not exist --> display 404
  if(!user.data){
    return (
      <pre>{JSON.stringify(user, null, 4)}</pre>
    )
  }

  const cookieStore = cookies()

  const userCredToken = cookieStore.get('userCredToken')
  // console.log("userCredToken=",userCredToken)

  // SECURITY client-side check IF: the user has never logged in before
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
  // IF the user has logged in before
  if(userCredToken){
    // verify the user credential
    verifiedUser = await postVerifyUser(userCredToken.value)
    // console.log("verifiedUser=",user)
  }

  // IF the credential is not valid --> display non-privileged(non edit user feature) 
  if(!verifiedUser.data){
    return (
      <pre>{JSON.stringify(verifiedUser, null, 4)}</pre>
    )
  }
  
  const article = await getArticle(searchParams.id)
  // console.log("article=",article)


  if(article.data===null){
    return (
      <pre>{JSON.stringify(article, null, 4)}</pre>
    )
  }

  
  return (
    <div className='p-5 border rounded-xl w-3/4 bg-slate-100 flex flex-col gap-y-5 dark:bg-zinc-900'>
      <EditArticle initArticle={article.data} />
    </div>
  )
}