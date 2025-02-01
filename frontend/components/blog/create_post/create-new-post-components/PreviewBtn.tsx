"use client"

import { Dispatch, SetStateAction, useContext } from 'react'
import CreateTitle from '../../CreateTitle';
import GeneratePreview from './GeneratePreview';
import { useUserInfo } from '@/hooks/appContext';
import convertDate from '@/utils/convertDate';
import chalk from 'chalk';
import getReadEstimation from '@/utils/getReadEstimation';
import { CreateNewPostStateCtx } from '../CreateNewPost';
import {MarkdownRenderer} from '@/utils/MarkdownRenderer';


interface PreviewBtnProps{
  setPreviewElem: Dispatch<SetStateAction<JSX.Element | undefined>>
  className:string
}
export default function PreviewBtn({
  setPreviewElem,className
}: PreviewBtnProps) {

  // hooks
  const [userInfo] = useUserInfo()
  const c = useContext(CreateNewPostStateCtx)!
  const [articleData] = c.articleDataState
  const [content] = c.contentMDState
  const [contentMD] = c.contentMDState


  // method
  const handlePreview = () => {
    console.log(chalk.yellow.bgBlack("@handlePreview"))
    console.log("contentMD=",contentMD)
    console.log("articleData=",articleData)

    // @TODO: give for each headings a some sort of "table of contents" like
    const TOCData: {[key: string]:HTMLHeadingElement} = {};


    let TempMainContent!: JSX.Element
    if(articleData.contentStructureType==="markdown"){
      TempMainContent = <MarkdownRenderer markdownText={contentMD}/>

    }else if(articleData.contentStructureType==="quilljs"){
      TempMainContent = <div dangerouslySetInnerHTML={{__html: content}}></div>
    }


    const readingTime = getReadEstimation(articleData.wordCounts)
    // console.log("readingTime=",readingTime)

    const TitleContent = <CreateTitle
      titlePage={articleData.title}
      miscInfo={{
        date: convertDate(new Date().toISOString().slice(0, 10)),
        wordCount:articleData.wordCounts,
        author: userInfo.username,
        readingTime,
        category: articleData.category,
      }}
    />

    const PrevElem = <GeneratePreview 
      MainContent={TempMainContent} 
      TitleContent={TitleContent}
      TOCData={TOCData}
    />
    setPreviewElem(PrevElem)
    // localStorage.setItem('article-content-md', JSON.stringify(PrevElem));
  }





  // render
  return (
    <button 
      onClick={handlePreview} 
      className={className}
    >
      {/* <Link
        href={{
          pathname:"post/compose/preview"
        }} 
        target="_blank" 
      >
        Preview
      </Link> */}
      Preview
    </button>
  )
}
