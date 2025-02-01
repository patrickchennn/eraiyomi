import EditArticle from '@/components/user/edit-post/EditArticle';
import { GET_articleAsset } from '@/services/article-asset/GET_articleAsset';
import { getArticle } from '@/services/article/getArticle';
import { GET_user } from '@/services/user/GET_user';
import { POST_verify } from '@/services/user/POST_verify';
import { User } from '@patorikkuuu/eraiyomi-types';
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
  console.info(chalk.blueBright.bgBlack(`[INF] @app/[user]/edit/post/[titleArticle] Page()`))


  console.log("params=",params)
  console.log("searchParams=",searchParams)

  const user = await GET_user(params.user)
  // console.log("user=",user)
  // IF user does not exist --> display 404
  if(!user){
    return (
      <>
        <h1>404 Not Found</h1>
        <p>{params.user} is not found.</p>        
      </>
    )
  }

  const cookieStore = cookies()

  const userCredToken = cookieStore.get('userCredToken')
  // console.log("userCredToken=",userCredToken)

  // IF: the user has never logged in before
  if(!userCredToken){
    return (
      <>
        <h1>401 Unauthorized</h1>
        <p>Login in order to edit!</p>
      </>
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
    verifiedUser = await POST_verify(userCredToken.value)
    console.log("verifiedUser=",user)
  }

  // IF the credential is not valid --> display non-privileged(non edit user feature) 
  if(!verifiedUser.data){
    return (
      <pre>{JSON.stringify(verifiedUser, null, 4)}</pre>
    )
  }
  
  const article = await getArticle(searchParams.id,params.titleArticle)
  // console.log("article=",article)

  const articleAsset = await GET_articleAsset(searchParams.id)
  // console.log("articleAsset=",articleAsset)

  if(!article.data || !articleAsset.data){
    return (
      <pre>
        {JSON.stringify(articleAsset, null, 4)}
        {JSON.stringify(article, null, 4)}
      </pre>
    )
  }

  
  return (
    <div className='p-5 border rounded-xl w-3/4 bg-slate-100 flex flex-col gap-y-5 dark:bg-zinc-900'>
    <EditArticle 
      article={article.data} 
      articleAsset={articleAsset.data} 
    />
    </div>
  )
}