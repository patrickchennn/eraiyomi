"use client"

import React, { useContext } from 'react'
import { useUserInfo } from '@/hooks/appContext';
import { POST_ReqBodyArticle } from '@patorikkuuu/eraiyomi-types';
import { postArticle } from '@/services/article/postArticle';
import { PUT_articleAsset } from '@/services/article-asset/PUT_articleAsset';
import chalk from 'chalk';
import { CreateNewPostStateCtx } from '../CreateNewPost';



interface PostBtnProps{
  API_key: string
  previewElem: JSX.Element|undefined,
  className: string
}
export default function PostBtn({API_key,previewElem,className}: PostBtnProps) {
  // hooks
  const [userInfo] = useUserInfo()
  const c = useContext(CreateNewPostStateCtx)!
  const [articleData] = c.articleDataState
  const [contentMD] = c.contentMDState
  const [content] = c.contentState


  // methods
  const handlePost = async () => {
    console.log(chalk.yellow("@handlePost()"))

    // console.log(previewSectionRef.current)

    // TODO: decide whether this conditional is necessary or not
    // IF the user have not login --> login first
    if(!userInfo.email.trim()){
      return alert("login first in order to post your work (only the admin/dev are allowed)")
    }
    
    // IF have not preview the writing --> must have preview it first in order to post the writing
    // if(!previewElem){
    //   return alert("preview it first in order to post your work")
    // }

    if(!API_key){
      return alert("API key is needed for creating an article.")
    }
    
    let finContent!: string
    if(articleData.contentStructureType==="markdown"){
      finContent = contentMD
    }else if(articleData.contentStructureType==="quilljs"){
      finContent = content
    }
    
    // console.log("userInfo=",userInfo)
    // console.log("contentImages=",contentImages)



    const reqBodyPostArticle: POST_ReqBodyArticle = {
      title: articleData.title,
      shortDescription: articleData.shortDescription,
      status:"published",
      author: userInfo.username,
      email: userInfo.email,
      category: articleData.category
    }
    console.log("reqBodyPostArticle=",reqBodyPostArticle)

    
    const postArticleRes = await postArticle(reqBodyPostArticle,API_key)
    console.log("postArticleRes=",postArticleRes)


    // IF: the request on `POST /api/article` executed by the function `postArticle()` succeed, meaning not undefined AND `thumbnail` or `content` exist --> we would call the next API route `PUT_articleAsset()`
    if(
      postArticleRes.data!==null
    ){
      const putArticleAssetReqBody = new FormData();
      putArticleAssetReqBody.append('thumbnail', articleData.thumbnail as File);
      putArticleAssetReqBody.append('contentStructureType', articleData.contentStructureType);
      putArticleAssetReqBody.append('content', finContent);
      putArticleAssetReqBody.append('totalWordCounts', articleData.wordCounts.toString());
      console.log("putArticleAssetReqBody=",...putArticleAssetReqBody)

      await PUT_articleAsset(
        postArticleRes.data._id, 
        putArticleAssetReqBody, 
        API_key
      )
    }

  }



  // render
  return (
    <button 
      type='button'
      className={className}
      onClick={handlePost}
    >
      Post
    </button>
  )
}
