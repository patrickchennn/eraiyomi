"use client"

import React, { RefObject } from 'react'

import {ArticleMetadataType} from "../CreateNewPost"

import { useUserInfo } from '@/hooks/appContext';

import { POST_ReqBodyArticle } from '@eraiyomi/types/Article';

import { postArticle } from "@/services/articleService";
import { PUT_articleAsset } from '@/services/articleAssetService';
import ReactQuill from 'react-quill';
import { revalidatePath } from 'next/cache';




interface PostBtnProps{
  textEditorRef: RefObject<ReactQuill>
  articleMetadata: ArticleMetadataType
  API_key: string
  previewElem: JSX.Element|undefined
}
export default function PostBtn({
  textEditorRef,articleMetadata,API_key,previewElem
}: PostBtnProps) {
  const [userInfo] = useUserInfo()

  const handlePost = async () => {
  
    // console.log(previewSectionRef.current)
  
    // IF have not preview the writing --> must have preview it first in order to post the writing
    // if(!previewElem){
    //   return alert("preview it first in order to post your work")
    // }
  
  
    // IF the user have not login --> login first
    if(!userInfo.email.trim()){
      return alert("login first in order to post your work (only the admin/dev are allowed)")
    }
    // console.log("userInfo=",userInfo)
    // console.log("contentImages=",contentImages)



    const reqBodyPostArticle: POST_ReqBodyArticle = {
      title: articleMetadata.title,
      shortDescription: articleMetadata.shortDescription,
      status:"published",
      author: userInfo.username,
      email: userInfo.email,
      category: articleMetadata.category
    }
    console.log("reqBodyPostArticle=",reqBodyPostArticle)

    // const textEditorElem = document.querySelector(".ql-editor")
    // console.log("textEditorElem=",textEditorElem)
    
    const postArticleRes = await postArticle(reqBodyPostArticle,API_key)
    console.log("postArticleRes=",postArticleRes)


    if(
      postArticleRes!==undefined &&
      (articleMetadata.thumbnail||articleMetadata.content)
    ){
      const formData = new FormData();
      // TODO: fix the type `as any`, use more specific type
      formData.append('thumbnail', articleMetadata.thumbnail as File);
      formData.append('content', JSON.stringify(articleMetadata.content));
      formData.append('title', articleMetadata.title);

      console.log("putArticleAssetReqBody=",...formData)
      await PUT_articleAsset(
        postArticleRes.data._id, 
        formData, 
        API_key
      )
    }

  }



  // render
  return (
    <button 
      type='button'
      className='border rounded py-1 px-2 bg-zinc-50 shadow-inner text-sm hover:shadow' 
      onClick={handlePost}
    >
      Post
    </button>
  )
}
