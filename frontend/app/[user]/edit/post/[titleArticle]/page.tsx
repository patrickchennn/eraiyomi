import EditArticle from '@/components/user/edit-post/EditArticle';
import { GET_articleAsset } from '@/services/articleAssetService';
import { getArticle } from '@/services/articleService';
import { GET_user, POST_verify } from '@/services/userService';
import { User } from '@patorikkuuu/eraiyomi-types';
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

  let verifiedUser: undefined|User
  // IF the user has logged in before
  if(userCredToken){
    // verify the user credential
    verifiedUser = await POST_verify(userCredToken.value)
    // console.log("verifiedUser=",user)
  }

  // IF the credential is not valid --> display non-privileged(non edit user feature) 
  if(!verifiedUser){
    return (
      <>
        <h1>403 Forbidden</h1>
        <p>The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.</p>
      </>
    )
  }
  
  const article = await getArticle(searchParams.id,params.titleArticle)
  // console.log("article=",article)

  const articleAsset = await GET_articleAsset(searchParams.id)
  // console.log("articleAsset=",articleAsset)

  if(!article.data || !articleAsset.data){
    return (
      <>
        <h1>{article.errMsg}</h1>
        <p>article with title "{params.titleArticle}" does not exist</p>
      </>
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