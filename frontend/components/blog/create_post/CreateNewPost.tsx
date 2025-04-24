/* Notes
Currently this feature is limited. Only the developer can access this feature. No one should be able to access this feature.

The reason it is limited because to implement for global users, I guess, it needs a tons of work to do.
*/
"use client"

// react
import {useState, useRef, useEffect} from 'react'

// custom hook
import useDidMountEffect from '@/hooks/useDidMountEffect';

import PostBtn from './PostBtn';
import CategoryInput from './create-new-post-components/CategoryInput';
import ThumbnailInput from './create-new-post-components/ThumbnailInput';
import DescInput from './create-new-post-components/DescInput';
import APIKeyInput from './create-new-post-components/APIKeyInput';
import EditorChoice from './create-new-post-components/EditorChoice';
import 'highlight.js/styles/atom-one-dark.css';
import TitleInput from './create-new-post-components/TitleInput';
import chalk from 'chalk';
import { ArticlePostRequestBody } from '@shared/Article';


export type ImgContentRefType = Array<{file:File, localPreviewImgSrc: string}>

export default function CreateNewPost(){ 
  console.log(chalk.bgBlack.blueBright("Component: @CreateNewPost"))

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const editorSectionRef = useRef<HTMLDivElement>(null)
  const mdEditorRef = useRef<HTMLInputElement>(null)
  const thumbnailRef = useRef<HTMLInputElement>(null)

  const imgContentRef = useRef<ImgContentRefType>([])

  const [API_key,set_API_key] = useState<string>("")

  const [articleData, setArticleData] = useState<ArticlePostRequestBody>({
    title:"",
    shortDescription: "",
    status:"published",
    category: [],
    totalWordCounts: 0,
    contentStructureType:"markdown"
  });

  useEffect(()=>{
    const articleDataLS = window.localStorage.getItem("article-data")
    if(!articleDataLS) return console.warn("articleDataLS is ",articleDataLS)

    console.log("articleDataLS=",articleDataLS)

    const parsedData = JSON.parse(articleDataLS)
    console.log("parsedData=",parsedData)

    setArticleData(prev=>({...prev,...parsedData}))
  },[])

  useDidMountEffect(() => {
    // console.log("articleData=",articleData)
    // console.log("firstTimeRender=",firstTimeRender)
 
    window.localStorage.setItem("article-data",JSON.stringify(articleData))
    
  },[
    articleData.title,
    articleData.shortDescription,
    articleData.category,
  ])

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <div className='w-full flex items-center flex-col'>

      <div className='my-3 p-5 border dark:border-zinc-900 rounded-xl w-5/6 bg-slate-100 flex flex-col gap-y-5 dark:bg-zinc-950' ref={editorSectionRef}>
        <div className='[&>button]:mx-1'>
          <PostBtn 
            articleData={articleData}
            mdEditorRef={mdEditorRef}
            API_key={API_key}
            thumbnailRef={thumbnailRef}
            imgContentRef={imgContentRef}
          />
        </div>
        
        <APIKeyInput apiKeyState={[API_key,set_API_key]}/>
      
        <TitleInput articleDataState={[articleData, setArticleData]}/>

        <DescInput articleDataState={[articleData, setArticleData]}/>

        <CategoryInput articleDataState={[articleData, setArticleData]}/>

        <ThumbnailInput thumbnailRef={thumbnailRef}/>

        <EditorChoice 
          mdEditorRef={mdEditorRef}
          imgContentRef={imgContentRef}
        />
      </div>
    </div>
  )
}