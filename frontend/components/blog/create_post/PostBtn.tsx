"use client"

import React, { useContext } from 'react'
import { useUserInfo } from '@/hooks/appContext';
import { CreateNewPostStateCtx } from './CreateNewPost';
import isEmpty from 'lodash.isempty';
import chalk from 'chalk';
import getCookie from '@/utils/getCookie';
import { postArticle } from '@/services/article/articleService';
import { postArticleContent } from '@/services/article/articleContentService';
import { postArticleThumbnail } from '@/services/article/articleThumbnailService';
import { postArticleImgContent } from '@/services/article/articleImageContentService';


interface PostBtnProps{
  previewElem: JSX.Element|undefined,
  className: string
}
export default function PostBtn({previewElem,className}: PostBtnProps) {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [userInfo] = useUserInfo()
  const c = useContext(CreateNewPostStateCtx)!
  const [articleData] = c.articleDataState
  const [API_key] = c.API_keyState
  const mdInputUploadRef = c.mdInputUploadRef
  const thumbnailRef = c.thumbnailRef

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const handlePost = async () => {
    console.log(chalk.blueBright.bgBlack("[INF] @handlePost()"))

    // 0. Client-side check
    console.log("API_key=",API_key)
    // Client-side check IF: API key is not provided
    if(isEmpty(API_key)) return alert("API key is needed")

    console.log("userInfo=",userInfo)
    // Client-side check IF: the user have not login
    if(!userInfo){
      return alert("Authentication needed")
    }

    const JWT_token = getCookie("userCredToken")
    console.log("JWT_token=",JWT_token)
    // Client-side check IF: the user have not login (2) or maybe intentionally remove JWT
    if(JWT_token===null){
      return alert("No JWT provided")
    }




    // 1. Handle the non-uploaded-type-data
    console.log(chalk.blueBright.bgBlack("[INF] Handle the non-uploaded-type-data"))
    const nonUploadArticleData = {
      title: articleData.title,
      shortDescription: articleData.shortDescription,
      status:"published",
      category: articleData.category,
      contentStructureType: "markdown",
      totalWordCounts: articleData.totalWordCounts
    }
    console.log("nonUploadArticleData=",nonUploadArticleData)
    const postArticleRes = await postArticle(
      API_key,
      JWT_token,
      nonUploadArticleData,
    )

    console.log("postArticleRes=",postArticleRes)

    if(postArticleRes.data===null){
      return alert(postArticleRes.message)
    }

    const articleId = postArticleRes.data._id

    // 2. Handle thumbnail 
    if (thumbnailRef.current!==null && thumbnailRef.current.files!==null) {
      console.log(chalk.blueBright.bgBlack("[INF] Handle thumbnail"))
      const thumbnailForm = new FormData()
      
      const thumbnail = thumbnailRef.current.files[0];
      console.log("thumbnail=",thumbnail)
  
      thumbnailForm.append('thumbnail', thumbnail); 
      const postThumbnailRes = await postArticleThumbnail(
        API_key, JWT_token, articleId, thumbnailForm
      )
      console.log("postThumbnailRes=",postThumbnailRes)
    }

    console.log("mdInputUploadRef.current=",mdInputUploadRef.current)

    // 3. Handle the uploaded-type-data: article.content and its images
    if (mdInputUploadRef.current!==null && mdInputUploadRef.current.files!==null) {
      console.log(chalk.blueBright.bgBlack("[INF] Handle content and image-content"))
      const contentForm = new FormData()
      const imageContentForm = new FormData()
      
      const files = mdInputUploadRef.current.files;
  
      const fileList = Array.from(files);
      console.log("fileList=",fileList)
  
      const imageContentMetadata: {[key: string]: string} = {}
      fileList.forEach(file => {
        if(file.type==="text/markdown"){
          contentForm.append('content', file); 
        }else if(file.type==="image/png" || file.type==="image/jpeg"){
          imageContentForm.append('image-content', file);
          imageContentMetadata[file.name] = file.webkitRelativePath
        }
      });

      imageContentForm.append("image-content", JSON.stringify(imageContentMetadata))

      await postArticleContent(
        API_key, JWT_token, articleId, contentForm
      )
      await postArticleImgContent(
        API_key, JWT_token, articleId, imageContentForm
      )
    }
  }



  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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