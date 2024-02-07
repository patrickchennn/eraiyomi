"use client"

import TextEditor from '@/components/TextEditor';
import APIKeyInput from '@/components/blog/create_post/create-new-post-components/APIKeyInput';

import { Article } from '@patorikkuuu/eraiyomi-types';
import { ArticleAsset } from '@patorikkuuu/eraiyomi-types';

import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill';

import EditInputTitle from './edit-article-utils/EditInputTitle';
import EditInputDesc from './edit-article-utils/EditInputDesc';
import EditInputCategory from './edit-article-utils/EditInputCategory';
import EditInputThumbnail from './edit-article-utils/EditInputThumbnail';


import EditSelectStatus from './edit-article-utils/EditSelectStatus';

import isEqual from 'lodash.isequal';
import { PUT_articleAsset } from '@/services/article-asset/PUT_articleAsset';
import { PUT_thumbnail } from '@/services/article-asset/PUT_thumbnail';
import { putArticle } from '@/services/article/putArticle';
import chalk from 'chalk';
import calculateWordCount from '@/utils/calculateWordCount';

export interface ArticleData{
  title:string
  shortDescription:string
  category:string[]
  status:"published"|"unpublished"
}
export interface ArticleAssetData{
  thumbnail: File|null|"default"
}

interface EditArticleProps{
  // initContent: string
  article: Article
  articleAsset: ArticleAsset
}
export default function EditArticle({
  // initContent,
  article,
  articleAsset
}: EditArticleProps){
  // console.log("initContent=",initContent)

  // hooks
  // const [content, setContent] = useState(initContent);
  const [content, setContent] = useState("");

  const [API_key,set_API_key] = useState<string>("")

  const textEditorRef = useRef<ReactQuill>(null)

  const [articleData,setArticleData] = useState<ArticleData>({
    title:article.titleArticle.title,
    shortDescription:article.shortDescription,
    category:article.category,
    status:article.status

  })
  const articleDefaultDataRef = useRef<ArticleData>({
    title:article.titleArticle.title,
    shortDescription:article.shortDescription,
    category:article.category,
    status:article.status
  })

  const [articleAssetData,setArticleAssetData] = useState<ArticleAssetData>({
    thumbnail:"default",
  })

  const articleAssetDefaultDataRef = useRef({
    thumbnail:articleAsset.thumbnail.dataURL,
  })

  useEffect(() => {
    // console.log("content=",content)
    // console.log("textEditorRef=",textEditorRef)

    textEditorRef.current?.editor?.setContents(
      articleAsset.content as any
    )
  },[articleAsset.content])



  // methods
  const handleSave = async () => {
    console.log(chalk.yellow("@handleSave()"))
    if(!API_key) return alert("API key is needed.")

    const articleDataReqBody: {[key: string]:any} = {} 

    Object.keys(articleData).forEach((key)=>{
      const newValue = articleData[key as keyof ArticleData];
      const defualtValue = articleDefaultDataRef.current[key as keyof ArticleData]


      if(newValue!==defualtValue){
        articleDataReqBody[key] = newValue
        console.log(`${key} is changed: ${defualtValue}->${newValue}`)
      }
    })
    if(Object.keys(articleDataReqBody).length>0){
      const modifiedArticle = await putArticle(API_key,article._id,articleDataReqBody)
      console.log("modifiedArticle=",modifiedArticle)
    }

    
    const articleAssetForm = new FormData()

    // IF the thumbnail is changed
    if(articleAssetData.thumbnail!=="default" && articleAssetData.thumbnail!==null){
      console.log("articleAssetData.thumbnail=",articleAssetData.thumbnail,articleAssetData.thumbnail instanceof File)

      articleAssetForm.append('thumbnail', articleAssetData.thumbnail);

      const updatedThumbnail = await PUT_thumbnail(article._id,articleAssetForm,API_key)
      console.log("updatedThumbnail=",updatedThumbnail)
    }

    // preparing for hitting API `PUT /api/article-asset/${articleId}`
    const textEditorElem = document.querySelector<HTMLDivElement>(".quill")
    
    if(!textEditorElem) return console.error("textEditorElem=",textEditorElem)

    if(!textEditorRef.current) return console.error("textEditorRef.current=",textEditorRef)

    const deltaContent = textEditorRef.current.unprivilegedEditor?.getContents()
    // console.log("deltaContent=",deltaContent)

    // handling the "main content" logic
    // IF: `deltaContent` is exist, i.e. not undefined
    if(deltaContent){

      
      
      // IF: the previous "main content" is NOT the same anymore, meaning there is a change being made on the "main content"
      if(!isEqual(articleAsset.content,deltaContent.ops)){
        console.log(
          chalk.magenta("IF: !isEqual(articleAsset.content,deltaContent.ops)="),
          !isEqual(articleAsset.content,deltaContent.ops)
        );

        console.log("articleAsset.content=",articleAsset.content)
        console.log("deltaContent=",deltaContent)

        // get all of the text inside the editor
        const textEditorElemTextContent = textEditorElem.textContent;
        // make sure it won't return null
        if (textEditorElemTextContent === null) {
          return console.error("textEditorElemTextContent is null");
        }


        const wordCount = calculateWordCount(".quill");

        articleAssetForm.append('content', JSON.stringify(deltaContent.ops));
        articleAssetForm.append('totalWordCounts', wordCount.toString());
  
        const updatedArticleAsset = await PUT_articleAsset(article._id,articleAssetForm,API_key)
        console.log("updatedArticleAsset=",updatedArticleAsset)
      }
    }
  }




  // render
  return(
    <>
      <div>
        <button onClick={handleSave} className='border hover:border-white rounded-md px-2 py-1 bg-slate-50 hover:bg-white'>Save</button>
        <button className='border hover:border-white rounded-md px-2 py-1 bg-slate-50 hover:bg-white'>Reset</button>
      </div>

      <APIKeyInput API_keyState={[API_key,set_API_key]}/>

      <EditInputTitle defaultTitle={articleDefaultDataRef.current.title} title={articleData.title} setArticleData={setArticleData}/>

      <EditInputDesc defaultDesc={articleDefaultDataRef.current.shortDescription} desc={articleData.shortDescription} setArticleData={setArticleData}/>

      <EditInputCategory defaultCategory={articleDefaultDataRef.current.category} category={articleData.category} setArticleData={setArticleData}/>

      <EditSelectStatus articleStatus={articleData.status} defaultArticleStatus={articleDefaultDataRef.current.status} setArticleData={setArticleData}/>

      <EditInputThumbnail defaultThumbnail={articleAssetDefaultDataRef.current.thumbnail} setArticleAssetData={setArticleAssetData}/>

      <label htmlFor="">content</label>
      <TextEditor contentState={[content, setContent]} textEditorRef={textEditorRef}/>
    </>
  )
}
