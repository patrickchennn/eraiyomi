/* Notes
Currently this feature is limited. Only the developer can access this feature. No one should be able to access this feature.

The reason it is limited because to implement for global users, I guess, it needs a tons of work to do.
*/
"use client"

// react
import {useState, useRef, useEffect, createContext, Dispatch, SetStateAction, RefObject} from 'react'

// custom hook
import useDidMountEffect from '@/hooks/useDidMountEffect';

import PostBtn from './PostBtn';
// import PreviewBtn from './PreviewBtn';
// import SaveDraftBtn from './create-new-post-components/SaveDraftBtn';
import CategoryInput from './create-new-post-components/CategoryInput';
import ThumbnailInput from './create-new-post-components/ThumbnailInput';
import DescInput from './create-new-post-components/DescInput';
import APIKeyInput from './create-new-post-components/APIKeyInput';
import EditorChoice from './create-new-post-components/EditorChoice';
import 'highlight.js/styles/atom-one-dark.css';
import TitleInput from './create-new-post-components/TitleInput';
import { ArticlePostRequestBody } from '@shared/Article';


interface CreateNewPostStateCtxType{
  articleDataState: [ArticlePostRequestBody, Dispatch<SetStateAction<ArticlePostRequestBody>>]
  rawTextState:[string, Dispatch<SetStateAction<string>>]
  API_keyState:[string, Dispatch<SetStateAction<string>>]
  mdInputUploadRef:RefObject<HTMLInputElement>
  thumbnailRef:RefObject<HTMLInputElement>
}
export const CreateNewPostStateCtx = createContext<CreateNewPostStateCtxType|null>(null);



export default function CreateNewPost(){
  const btnClass = 'border rounded py-1 px-2 bg-zinc-50 dark:bg-zinc-900 shadow-inner text-sm hover:shadow';
  const inpEditorClass = {
    main:'rounded px-2 w-full bg-slate-50 dark:bg-zinc-800 valid:bg-slate-100 focus:bg-white font-bold',
    category:'rounded px-2 bg-slate-50 dark:bg-zinc-800 valid:bg-slate-100 focus:bg-white font-bold',
  };


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const previewSectionRef = useRef<HTMLDivElement>(null)
  const editorSectionRef = useRef<HTMLDivElement>(null)
  const mdInputUploadRef = useRef<HTMLInputElement>(null)
  const thumbnailRef = useRef<HTMLInputElement>(null)

  const [previewElem,setPreviewElem] = useState<JSX.Element>()
  const [API_key,set_API_key] = useState<string>("")
  const [rawText, setRawText] = useState('');

  const [articleData, setArticleData] = useState<any>({
    title:"",
    shortDescription: "",
    category: [],
    totalWordCounts: 0,
  });



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
    articleData.title,
    articleData.shortDescription,
    articleData.category,
  ])





  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <CreateNewPostStateCtx.Provider 
      value={{
        articleDataState:[articleData,setArticleData],
        rawTextState: [rawText, setRawText],  
        API_keyState: [API_key,set_API_key],
        mdInputUploadRef,
        thumbnailRef:thumbnailRef
      }}
    >
      <div className='w-full flex items-center flex-col'>

      <div className='my-3 p-5 border dark:border-zinc-900 rounded-xl w-3/4 bg-slate-100 flex flex-col gap-y-5 dark:bg-zinc-950' ref={editorSectionRef}>
        <div className='[&>button]:mx-1'>
          {/* <PreviewBtn setPreviewElem={setPreviewElem} className={btnClass}/> */}

          <PostBtn previewElem={previewElem} className={btnClass} />

          {/* <SaveDraftBtn className={btnClass}/> */}
        </div>
        
        <APIKeyInput />
      
        <TitleInput />

        <DescInput />

        <CategoryInput />

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