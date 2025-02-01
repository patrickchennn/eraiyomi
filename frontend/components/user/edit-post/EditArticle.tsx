"use client"

import React, { useEffect, useRef, useState } from 'react'

import chalk from 'chalk';

import APIKeyInput from '@/components/blog/create_post/create-new-post-components/APIKeyInput';

import { Article, HTTPGetArticleAssetRes } from '@patorikkuuu/eraiyomi-types';
import { ArticleAsset } from '@patorikkuuu/eraiyomi-types';

import EditInputTitle from './edit-article-utils/EditInputTitle';
import EditInputDesc from './edit-article-utils/EditInputDesc';
import EditInputCategory from './edit-article-utils/EditInputCategory';
import EditInputThumbnail from './edit-article-utils/EditInputThumbnail';
import EditSelectStatus from './edit-article-utils/EditSelectStatus';
import EditEditorChoice from './edit-article-utils/EditEditorChoice';

import { PUT_articleAsset } from '@/services/article-asset/PUT_articleAsset';
import { PUT_thumbnail } from '@/services/article-asset/PUT_thumbnail';
import { putArticle } from '@/services/article/putArticle';


export interface ArticleData{
  title:string
  shortDescription:string
  category:string[]
  status:"published"|"unpublished"
}

export type ArticleDataState = [ArticleData, React.Dispatch<React.SetStateAction<ArticleData>>]

export type ArticleAssetData = Omit<ArticleAsset, "_id"|"articleIdRef">;

export type ArticleAssetState = [ArticleAssetData, React.Dispatch<React.SetStateAction<ArticleAssetData>>]

const buttonClass = 'border hover:border-white rounded-md px-2 py-1 bg-slate-50 hover:bg-white';


interface EditArticleProps{
  article: Article
  articleAsset: HTTPGetArticleAssetRes
}
export default function EditArticle({article,articleAsset}: EditArticleProps){

  // hooks
  const [rawMarkdownString, setRawMarkdownString] = useState('');
  const [markdownFiles,setMarkdownFiles] = useState<  File[]>([])
  const [thumbnail,setThumbnail] = useState<File|null>(null)

  const [API_key,set_API_key] = useState<string>("")


  const [articleAssetData,setArticleAssetData] = useState<ArticleAssetData>({
    thumbnail:articleAsset.thumbnail,
    totalWordCounts:articleAsset.totalWordCounts,
    contentStructureType:articleAsset.contentStructureType,
    content:articleAsset.content,
  })
  const articleAssetState: ArticleAssetState = [articleAssetData,setArticleAssetData]

  const articleAssetOriginalDataRef = useRef<ArticleAssetData>({
    thumbnail:articleAsset.thumbnail,
    totalWordCounts:articleAsset.totalWordCounts,
    contentStructureType:articleAsset.contentStructureType,
    content:articleAsset.content,
  })


  const [articleData,setArticleData] = useState<ArticleData>({
    title:article.titleArticle.title,
    shortDescription:article.shortDescription,
    category:article.category,
    status:article.status,
  })
  const articleDataState: ArticleDataState = [articleData,setArticleData]

  const articleDefaultDataRef = useRef<ArticleData>({
    title:article.titleArticle.title,
    shortDescription:article.shortDescription,
    category:article.category,
    status:article.status,
  })

  useEffect(() => {
    if(
      Object.hasOwn(articleAsset,"rawText") 
      && articleAsset.rawText!==undefined
    ) {
      setRawMarkdownString(articleAsset.rawText)
    }
  }, [])


  // methods
  const handleSave = async () => {
    console.info(chalk.blueBright.bgBlack("[INF] @handleSave()"))
    console.log("articleAssetData=",articleAssetData)
    console.log("markdownFiles=",markdownFiles)
    if(!API_key) return alert("API key is needed.")

    // `articleDataReqBody` this object is used to collectively store changed article meta data
    const articleDataReqBody: {[key: string]:any} = {} 

    // This logic is about checking whether the article meta data is changed from the original one. If changed simply put that on that object `articleDataReqBody`
    Object.keys(articleData).forEach((key)=>{
      const newValue = articleData[key as keyof ArticleData];
      const defualtValue = articleDefaultDataRef.current[key as keyof ArticleData]

      // Here is the condition where it determines whether the article meta data is changed or not 
      if(newValue!==defualtValue){
        articleDataReqBody[key] = newValue
        console.info(chalk.blueBright.bgBlack(`[INF] ${key} is changed: ${defualtValue}-->${newValue}`))
      }
    })
    // IF: there is something in that `articleDataReqBody` object --> it means the user decided to edit/changed the article meta data (which we already handle it on the previous logic)
    if(Object.keys(articleDataReqBody).length>0){
      console.info(chalk.blueBright.bgBlack(`[INF] There is some changes on article data --> calling the edit article API`))

      // Simply call the API to make the change
      const modifiedArticle = await putArticle(API_key,article._id,articleDataReqBody)
      console.log("modifiedArticle=",modifiedArticle)
    }

    
    const articleAssetForm = new FormData()

    // IF: the thumbnail is changed
    if(thumbnail instanceof File){
      console.info(chalk.blueBright.bgBlack(`[INF] handle thumbnail image`))

      console.log("thumbnail=",thumbnail)
      console.log("thumbnail instanceof File=", thumbnail instanceof File)

      articleAssetForm.append('thumbnail', thumbnail);
      const updatedThumbnail = await PUT_thumbnail(article._id,articleAssetForm,API_key)
      console.log("updatedThumbnail=",updatedThumbnail)
    }

    if(markdownFiles.length>0){

      console.info(chalk.blueBright.bgBlack(`[INF] handle upload markdown files`))

      const metadata = markdownFiles.map((file) => ({
        webkitRelativePath: file.webkitRelativePath,
      }));
      
      // Add the JSON metadata to FormData as a separate field
      articleAssetForm.append("metadataContent", JSON.stringify(metadata));
  
      markdownFiles.forEach((file) => {
        // Use a unique key for each file, `content` can be treated as an array on the server
        articleAssetForm.append('content-files', file); 
      });

      articleAssetData.contentStructureType &&
      articleAssetForm.append("contentStructureType",articleAssetData.contentStructureType);

      articleAssetForm.append("totalWordCounts",articleAssetData.totalWordCounts.toString())
      console.log("articleAssetForm=",...articleAssetForm)
  
      const resData = await PUT_articleAsset(article. _id,articleAssetForm, API_key)
      console.log("resData=",resData)
    }
    // else if(typeof articleAssetData.content==="string"){
    //   console.info(chalk.blueBright.bgBlack(`[INF] handle upload markdown raw string`))

    //   articleAssetForm.append("content",rawMarkdownString)
    //   articleAssetForm.append("totalWordCounts",articleAssetData.totalWordCounts)
    // }

  }




  // render
  return(
      <>
        <div>
          <button onClick={handleSave} className={buttonClass}>Save</button>
          <button className={buttonClass}>Reset All</button>
        </div>

        <APIKeyInput API_keyState={[API_key,set_API_key]}/>

        <EditInputTitle 
          articleDataState={articleDataState}
          articleDefaultDataRef={articleDefaultDataRef}
        />

        <EditInputDesc 
          articleDataState={articleDataState}
          articleDefaultDataRef={articleDefaultDataRef}
        />

        <EditInputCategory 
          articleDataState={articleDataState}
          articleDefaultDataRef={articleDefaultDataRef}
        />

        <EditSelectStatus 
          articleDataState={articleDataState}
          articleDefaultDataRef={articleDefaultDataRef}
        />

        <EditInputThumbnail 
          articleAssetState={articleAssetState}
          articleAssetOriginalDataRef={articleAssetOriginalDataRef}
          thumbnailState={[thumbnail,setThumbnail]}
        />

        <EditEditorChoice 
          articleAssetState={articleAssetState}
          markdownFilesState={[markdownFiles,setMarkdownFiles]}
          rawMarkdownStringState={[rawMarkdownString, setRawMarkdownString]}
        />
      </>
  )
}
