/* Notes
Currently this feature is limited. Only the developer(@patrick.chen31@gmail.com) can access this feature. No one should be able to access this feature.

The reason it is limited because to implement for global users, I guess, it needs a tons of work to do.
*/
"use client"


// react
import {useState, useRef, useEffect, createContext} from 'react'
import useDidMountEffect from '@/hooks/useDidMountEffect';

import PostBtn from './create-new-post-components/PostBtn';
import PreviewBtn from './create-new-post-components/PreviewBtn';
import SaveDraftBtn from './create-new-post-components/SaveDraftBtn';
import CategoryInput from './create-new-post-components/CategoryInput';
import ThumbnailInput from './create-new-post-components/ThumbnailInput';
import DescInput from './create-new-post-components/DescInput';
import TitleInput from './create-new-post-components/TitleInput';
import APIKeyInput from './create-new-post-components/APIKeyInput';
import EditorChoice from './create-new-post-components/EditorChoice';
import chalk from 'chalk';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export interface ArticleDataType{
  title:string,
  shortDescription:string,
  category:Array<string>,
  thumbnail:File|string|null,
  content:string
  contentStructureType:string|"quilljs"|"markdown"
  wordCounts:number
}

interface CreateNewPostStateCtxType{
  articleDataState: [ArticleDataType,React.Dispatch<React.SetStateAction<ArticleDataType>>]
  contentState:[string,React.Dispatch<React.SetStateAction<string>>]
  contentMDState:[string,React.Dispatch<React.SetStateAction<string>>]
}
export const CreateNewPostStateCtx = createContext<CreateNewPostStateCtxType|null>(null);



export default function CreateNewPost(){
  const btnClass = 'border rounded py-1 px-2 bg-zinc-50 dark:bg-zinc-900 shadow-inner text-sm hover:shadow';
  const inpEditorClass = {
    main:'rounded px-2 w-full bg-slate-50 dark:bg-zinc-800 valid:bg-slate-100 focus:bg-white font-bold',
    category:'rounded px-2 bg-slate-50 dark:bg-zinc-800 valid:bg-slate-100 focus:bg-white font-bold',
  };


  // hooks
  const previewSectionRef = useRef<HTMLDivElement>(null)
  const editorSectionRef = useRef<HTMLDivElement>(null)

  const [previewElem,setPreviewElem] = useState<JSX.Element>()
  const [API_key,set_API_key] = useState<string>("")
  const [content, setContent] = useState('');
  const [contentMD, setContentMD] = useState('');


  const [articleData,setArticleData] = useState<ArticleDataType>({
    title:"",
    shortDescription:"",
    contentStructureType:"",
    category:[],
    thumbnail:null,
    content:"",
    wordCounts:0
  })



  useEffect(()=>{
    const articleDataLS = window.localStorage.getItem("article-data")
    if(!articleDataLS) return console.warn("articleDataLS is ",articleDataLS)

    console.log("articleDataLS=",articleDataLS)

    const parsedData = JSON.parse(articleDataLS)
    console.log("parsedData=",parsedData)

    setArticleData(parsedData)

  },[])


  useDidMountEffect(() => {
    // console.log("articleData=",articleData)
    // console.log("firstTimeRender=",firstTimeRender)
 
    const { content, thumbnail, ...rest } = articleData;
    window.localStorage.setItem("article-data",JSON.stringify(rest))
    
  },[
    articleData.category,
    articleData.shortDescription,
    articleData.title
  ])


  useEffect(() => {
    console.log(chalk.yellow.bgBlack("@useEffect(Function,[previewElem])"))
    // @TODO: this breaks the react rules: do not directly manipulate the DOM
    hljs.highlightAll()
  },[previewElem])




  // render
  return (
    <CreateNewPostStateCtx.Provider 
      value={{
        articleDataState:[articleData,setArticleData],
        contentState:[content, setContent],
        contentMDState:[contentMD,setContentMD]
      }}
    >
      <div className='w-full flex items-center flex-col'>
        <div className='[&>button]:mx-1'>

          <PreviewBtn setPreviewElem={setPreviewElem} className={btnClass}/>

          <PostBtn 
            API_key={API_key} 
            previewElem={previewElem}
            className={btnClass}
          />

          <SaveDraftBtn API_key={API_key} className={btnClass}/>

        </div>

        {/* editor section */}
        <div className='my-3 p-5 border dark:border-zinc-900 rounded-xl w-3/4 bg-slate-100 flex flex-col gap-y-5 dark:bg-zinc-950' ref={editorSectionRef}>
        
          <TitleInput />

          <DescInput />

          <CategoryInput />

          <APIKeyInput API_keyState={[API_key,set_API_key]}/>

          <ThumbnailInput />

          <EditorChoice />
        </div>

        {/* preview section, grid (container) */}
        <div data-cy="preview-article-section" className='w-full'>
          {previewElem && previewElem}
        </div>
      </div>
    </CreateNewPostStateCtx.Provider>
  )
}