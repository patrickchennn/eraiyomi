"use client"

import { Dispatch, SetStateAction } from 'react'
import CreateTitle from '../../CreateTitle';
import GeneratePreview from './GeneratePreview';
import { ArticleMetadataType } from '../CreateNewPost';
import { useUserInfo } from '@/hooks/appContext';
import customRound from '@/utils/customRound';
import ReactQuill from 'react-quill';
import convertDate from '@/utils/convertDate';


interface PreviewBtnProps{
  textEditorRef: React.RefObject<ReactQuill>
  setPreviewElem: Dispatch<SetStateAction<JSX.Element | undefined>>
  articleMetadata: ArticleMetadataType
  content: string,
}
export default function PreviewBtn({
  textEditorRef,
  setPreviewElem,
  articleMetadata,
  content,
}: PreviewBtnProps) {
  // hooks

  const [userInfo] = useUserInfo()
  

  // method
  const handlePreview = () => {
    // console.log("content=",content)

    const TOCData: {[key: string]:HTMLHeadingElement} = {};
  
    // hide the editor area because I just want to highlight the preview area
    // editorSectionRef.current.classList.add("hidden")
    // previewSectionRef.current.classList.remove("!hidden")
  
    // console.log("preview")
    const textEditorElem = document.querySelector<HTMLDivElement>(".quill")
    if(!textEditorElem) return console.error("textEditorElem is",textEditorElem)
    if(!textEditorRef.current) return console.error("textEditorRef.current is",textEditorRef)

    // @ts-ignore
    const wordCount = textEditorElem.textContent.match(/\S+/g).length
    // console.log("wordCount=",wordCount)

    const readingTime = wordCount < 200 ? "<1 min" : `${customRound(wordCount/200)} min`
    // console.log("readingTime=",readingTime)

    
    const TitleContent = <CreateTitle
      titlePage={articleMetadata.title}
      miscInfo={{
        date: convertDate(new Date().toISOString().slice(0, 10)),
        wordCount,
        author: userInfo.username,
        readingTime,
        category: articleMetadata.category,
      }}
    />

    // console.log("textEditorElem=",textEditorElem)

    const headings = textEditorElem.querySelectorAll<HTMLHeadingElement>("h2, h3")
    // console.log("headings=",headings)

    const TempMainContent = <div dangerouslySetInnerHTML={{__html: content}}></div>
    // console.log("TempMainContent=",TempMainContent)

    for(const heading of headings){
      // console.log("heading=",heading)
      TOCData[heading.textContent as string] = heading
    }
    // console.log("TOCData=",TOCData)

    setPreviewElem(
      <GeneratePreview 
        MainContent={TempMainContent} 
        TitleContent={TitleContent}
        TOCData={TOCData}
      />
    )
  }





  // render
  return (
    <button 
      onClick={handlePreview} 
      className='border rounded py-1 px-2 bg-zinc-50 shadow-inner text-sm hover:shadow'
    >
      Preview
    </button>
  )
}
