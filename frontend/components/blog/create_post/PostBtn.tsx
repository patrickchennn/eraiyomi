"use client"

import React, { MutableRefObject, RefObject } from 'react'
import { useUserInfo } from '@/hooks/appContext';
import isEmpty from 'lodash.isempty';
import chalk from 'chalk';
import getCookie from '@/utils/getCookie';
import { postArticle } from '@/services/article/articleService';
import { postArticleContent } from '@/services/article/articleContentService';
import { postArticleThumbnail } from '@/services/article/articleThumbnailService';
import { ArticlePostRequestBody } from '@shared/Article';
import { ImgContentRefType } from './CreateNewPost';
import { extractMarkdownImagesSyntax, replaceMarkdownImageSyntax } from '@/utils/markdown';
import calculateWordCount from '@/utils/calculateWordCount';


interface PostBtnProps{
  articleData: ArticlePostRequestBody
  mdEditorRef: any
  API_key: string
  thumbnailRef:RefObject<HTMLInputElement>
  imgContentRef: MutableRefObject<ImgContentRefType>
}
export default function PostBtn({
  articleData,
  mdEditorRef,
  API_key,
  thumbnailRef,
  imgContentRef
}: PostBtnProps) {
  // ~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~
  const [userInfo] = useUserInfo()

  // ~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~
  const handlePost = async () => {
    console.log(chalk.blueBright.bgBlack("Function: @handlePost"))

    // ~~~~~~~~~~~~~~~~~~~~0. Client-side check~~~~~~~~~~~~~~~~~~~~
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

    let isSingleError = false;

    console.log("mdEditorRef.current=",mdEditorRef.current)

    // ~~~~~~~~~~~~~~~~~~~~1. Handle the non-uploaded-type-data~~~~~~~~~~~~~~~~~~~~
    console.log(chalk.blueBright.bgBlack("Handle the non-uploaded-type-data"))
    console.log("articleData=",articleData)

    const totalWordCounts = Number(calculateWordCount(mdEditorRef.current.markdown))
    console.log("totalWordCounts=",totalWordCounts)

    const postArticleRes = await postArticle(
      API_key,
      JWT_token,
      {
        title: articleData.title,
        shortDescription: articleData.shortDescription,
        category: articleData.category,
        status: articleData.status,
        totalWordCounts,
        contentStructureType: articleData.contentStructureType,
      }
    )

    console.log("postArticleRes=",postArticleRes)

    if(postArticleRes.data===null){
      isSingleError = true;
      return alert(postArticleRes.message)
    }

    const articleId = postArticleRes.data._id

    // Use this for testing
    // const articleId = "67d55683459f60d49ad6245f"

    // ~~~~~~~~~~~~~~~~~~~~2. Handle thumbnail~~~~~~~~~~~~~~~~~~~~
    if (
      thumbnailRef.current!==null
      && thumbnailRef.current.files!==null
      && thumbnailRef.current.files[0]!==undefined
    ) {
      console.log(chalk.blueBright.bgBlack("Handle thumbnail"))
      const thumbnailForm = new FormData()
      
      const thumbnail = thumbnailRef.current.files[0];
      console.log("thumbnail=",thumbnail)
  
      thumbnailForm.append('thumbnail', thumbnail); 
      const postThumbnailRes = await postArticleThumbnail(
        API_key, JWT_token, articleId, thumbnailForm
      )
      console.log("postThumbnailRes=",postThumbnailRes)
      if(postThumbnailRes!==null && postThumbnailRes.data===null) isSingleError = true
    }


    // ~~~~~~~~~~~~~~~~~~~~3. Handle the article.content and its images~~~~~~~~~~~~~~~~~~~~
    console.log(chalk.blueBright.bgBlack("Handle content and image-content"))
    const contentForm = new FormData()

    const extractedMdImgsSyntax = extractMarkdownImagesSyntax(mdEditorRef.current.markdown);
    console.log("extractedMdImgsSyntax=",extractedMdImgsSyntax)

    console.log("imgContentRef.current=",imgContentRef.current)

    let updatedMdText = mdEditorRef.current.markdown

    extractedMdImgsSyntax.forEach((currImg) => {  
      imgContentRef.current.forEach((imgContentAttribute) => {
        if(currImg.url === imgContentAttribute.localPreviewImgSrc){
          updatedMdText = replaceMarkdownImageSyntax(
            updatedMdText, 
            currImg.url,
            imgContentAttribute.file.name
          )
          contentForm.append('image-content', imgContentAttribute.file);
        }
      });
    });
    contentForm.append('content', updatedMdText);

    console.log("contentForm=",...contentForm)

    const postArticleContentRes = await postArticleContent(
      API_key, JWT_token, articleId, contentForm
    )
    console.log("postArticleContentRes=",postArticleContentRes)
    
    if(isSingleError){
      alert("Error creating article")
    }else{
      alert("Successfully creating article")
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~
  return (
    <button 
      type='button'
      className='border rounded py-1 px-2 bg-zinc-50 dark:bg-zinc-900 shadow-inner text-sm hover:shadow'
      onClick={handlePost}
    >
      Post
    </button>
  )
}