"use client"

import React, { createContext, useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill';
import isEqual from 'lodash.isequal';
import chalk from 'chalk';

import APIKeyInput from '@/components/blog/create_post/create-new-post-components/APIKeyInput';

import { Article } from '@patorikkuuu/eraiyomi-types';
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
import calculateWordCount from '@/utils/calculateWordCount';

export interface ArticleData{
  title:string
  shortDescription:string
  category:string[]
  status:"published"|"unpublished"
  thumbnail: File|null|"default"|ArticleAsset["thumbnail"]
  wordCounts:number
  content:ArticleAsset["content"]
  contentStructureType:ArticleAsset["contentStructureType"]

}

interface EditArticleDataCxtType {
  articleDataState: [ArticleData,React.Dispatch<React.SetStateAction<ArticleData>>]
  articleDefaultDataRef:React.MutableRefObject<ArticleData>
  contentState:[string,React.Dispatch<React.SetStateAction<string>>]
  contentMDState:[string,React.Dispatch<React.SetStateAction<string>>]
  textEditorRef: React.RefObject<ReactQuill>

}
export const EditArticleDataCxt = createContext<EditArticleDataCxtType|null>(null);

const buttonClass = 'border hover:border-white rounded-md px-2 py-1 bg-slate-50 hover:bg-white';

const RedStar = <span className='text-gray-600'>*</span>

interface EditArticleProps{
  article: Article
  articleAsset: ArticleAsset
}
export default function EditArticle({article,articleAsset}: EditArticleProps){

  // hooks
  const [content, setContent] = useState('');
  const [contentMD, setContentMD] = useState('');

  const [API_key,set_API_key] = useState<string>("")

  const textEditorRef = useRef<ReactQuill>(null)

  const [articleData,setArticleData] = useState<ArticleData>({
    title:article.titleArticle.title,
    shortDescription:article.shortDescription,
    category:article.category,
    status:article.status,
    thumbnail:"default",
    wordCounts:articleAsset.totalWordCounts,
    content:articleAsset.content,
    contentStructureType:articleAsset.contentStructureType,
  })
  const articleDefaultDataRef = useRef<ArticleData>({
    title:article.titleArticle.title,
    shortDescription:article.shortDescription,
    category:article.category,
    status:article.status,
    thumbnail:articleAsset.thumbnail,
    wordCounts:articleAsset.totalWordCounts,
    content:articleAsset.content,
    contentStructureType:articleAsset.contentStructureType,
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
    const {thumbnail} = articleData
    if(thumbnail instanceof File){
      console.log("thumbnail=",thumbnail,thumbnail instanceof File)

      articleAssetForm.append('thumbnail', thumbnail);

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
    <EditArticleDataCxt.Provider value={{
      articleDataState:[articleData,setArticleData],
      contentMDState:[contentMD,setContentMD],
      contentState:[content, setContent],
      articleDefaultDataRef,
      textEditorRef,
    }}>
      <div>
        <button onClick={handleSave} className={buttonClass}>Save</button>
        <button className={buttonClass}>Reset All</button>
      </div>

      <APIKeyInput API_keyState={[API_key,set_API_key]}/>

      <EditInputTitle />

      <EditInputDesc />

      <EditInputCategory />

      <EditSelectStatus />

      <EditInputThumbnail />

      <EditEditorChoice />
    </EditArticleDataCxt.Provider>
  )
}
