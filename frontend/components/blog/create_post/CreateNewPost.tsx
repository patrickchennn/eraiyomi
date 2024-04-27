/* Notes
Currently this feature is limited. Only the developer(@patrick.chen31@gmail.com) can access this feature. No one should be able to access this feature.

The reason it is limited because to implement for global users, I guess, it needs a tons of work to do.
*/
"use client"


// react
import {useState, useRef, useEffect, createContext} from 'react'
import ReactQuill from 'react-quill';
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

  textEditorRef: React.RefObject<ReactQuill>
}
export const CreateNewPostStateCtx = createContext<CreateNewPostStateCtxType|null>(null);



export default function CreateNewPost(){

  // hooks
  const previewSectionRef = useRef<HTMLDivElement>(null)
  const editorSectionRef = useRef<HTMLDivElement>(null)
  const textEditorRef = useRef<ReactQuill>(null)

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

  // @todo: is this necessary though?
  useDidMountEffect(() => {
    const deltaContents = textEditorRef.current?.editor?.getContents()
    console.log("deltaContents=",deltaContents)


    const txt = textEditorRef.current?.editor?.getText().trim()
    setArticleData(prev=>({
      ...prev,
      contentStuctureType:"quilljs",
      content:JSON.stringify(deltaContents?.ops as []),
      wordCounts:txt ? txt.split(/\s+/).length : 0
    }))
  },[content])


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
        textEditorRef,
        contentMDState:[contentMD,setContentMD]
      }}
    >
      <div className='w-full flex items-center flex-col'>
        <div className='[&>button]:mx-1'>

          <PreviewBtn setPreviewElem={setPreviewElem}/>

          <PostBtn 
            API_key={API_key} 
            previewElem={previewElem}
          />

          <SaveDraftBtn API_key={API_key}/>

        </div>

        {/* editor section */}
        <div className='my-3 p-5 border rounded-xl w-3/4 bg-slate-100 flex flex-col gap-y-5 dark:bg-zinc-900' ref={editorSectionRef}>
        
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