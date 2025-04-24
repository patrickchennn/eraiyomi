"use client"

import React, { useRef, useState } from 'react'

import { Article, ArticlePostRequestBody} from '@shared/Article';
import EditInputTitle from './edit-article-utils/EditInputTitle';
import EditInputDesc from './edit-article-utils/EditInputDesc';
import EditInputCategory from './edit-article-utils/EditInputCategory';
import EditInputThumbnail from './edit-article-utils/EditInputThumbnail';
import EditSelectStatus from './edit-article-utils/EditSelectStatus';
import EditEditorChoice from './edit-article-utils/EditEditorChoice';
import EditAPIKeyInput from './edit-article-utils/EditAPIKeyInput';
import SaveBtn from './SaveBtn';
import DeleteBtn from './DeleteBtn';
import chalk from 'chalk';

export type ArticleState = [ArticlePostRequestBody, React.Dispatch<React.SetStateAction<ArticlePostRequestBody>>]

export type ImgContentRefType = Array<{
  type:"aws"|"file"
  file:File|null, 
  localPreviewImgSrc: string|null,
  s3Url: string|null,
  fileName: string,
  relativePath: string|null,
  mimeType: string
}>

const buttonStyle = 'border rounded py-1 px-2 bg-zinc-50 dark:bg-zinc-900 shadow-inner text-sm hover:shadow'


interface EditArticleProps{
  initArticle: Article
}
export default function EditArticle({initArticle}: EditArticleProps){
  console.log(chalk.bgBlack.blueBright("Component: @EditArticle"))

  // ~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~
  const contentActionRef = useRef<"default"|"change"|"delete">("default")
  const mdEditorRef = useRef<HTMLInputElement>(null)
  const imgContentRef = useRef<ImgContentRefType>([])

  const thumbnailRef = useRef<HTMLInputElement|null>(null)
  const thumbnailActionRef = useRef<"default"|"change"|"delete">("default")

  const [API_key, set_API_key] = useState<string>("")

  const [article,setArticle] = useState<ArticlePostRequestBody>({
    title: initArticle.title,
    shortDescription: initArticle.shortDescription,
    category: initArticle.category,
    status: initArticle.status,
    totalWordCounts:initArticle.totalWordCounts,
    contentStructureType:"markdown",
  })
  // console.log("article=",article)
  const articleState: ArticleState = [article,setArticle]

  const articleDefaultDataRef = useRef<ArticlePostRequestBody>({
    title: initArticle.title,
    shortDescription: initArticle.shortDescription,
    category: initArticle.category,
    status: initArticle.status,
    totalWordCounts:initArticle.totalWordCounts,
    contentStructureType:"markdown",
  })

  // ~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~
  return(
    <div className='w-full flex items-center flex-col'>
      <div className='p-5 border rounded-xl w-5/6 bg-slate-100 flex flex-col gap-y-5 dark:bg-zinc-900'>
        <div>
          <SaveBtn 
            buttonStyle={buttonStyle}
            API_key={API_key}
            articleId={initArticle._id}
            article={article}
            articleDefaultDataRef={articleDefaultDataRef}
            contentActionRef={contentActionRef}
            mdEditorRef={mdEditorRef}
            imgContentRef={imgContentRef}
            thumbnailRef={thumbnailRef}
            thumbnailActionRef={thumbnailActionRef}
          />
          <button className={buttonStyle}>Reset All</button>
          <DeleteBtn 
            buttonStyle={buttonStyle}
            API_key={API_key}
            articleId={initArticle._id}
          />
        </div>

        <EditAPIKeyInput API_keyState={[API_key,set_API_key]}/>

        <EditInputTitle 
          articleState={articleState}
          articleDefaultDataRef={articleDefaultDataRef}
        />

        <EditInputDesc 
          articleState={articleState}
          articleDefaultDataRef={articleDefaultDataRef}
        />

        <EditInputCategory 
          articleState={articleState}
          articleDefaultDataRef={articleDefaultDataRef}
        />

        <EditSelectStatus 
          articleState={articleState}
          articleDefaultDataRef={articleDefaultDataRef}
        />

        <EditInputThumbnail 
          articleId={initArticle._id}
          thumbnailRef={thumbnailRef}
          thumbnailActionRef={thumbnailActionRef}
        />

        <EditEditorChoice 
          articleId={initArticle._id}
          mdEditorRef={mdEditorRef}
          imgContentRef={imgContentRef}
          contentActionRef={contentActionRef}
        />
      </div>
    </div>
  )
}