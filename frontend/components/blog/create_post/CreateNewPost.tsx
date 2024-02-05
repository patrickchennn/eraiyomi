/* Notes
Currently this feature is limited. Only the developer(@patrick.chen31@gmail.com) can access this feature. No one should be able to access this feature.

The reason it is limited because to implement for global users, I guess, it needs a tons of work to do.
*/
"use client"


// react
import {useState, useRef, useCallback, useEffect} from 'react'
import { createPortal } from 'react-dom';


import PostBtn from './create-new-post-components/PostBtn';
import PreviewBtn from './create-new-post-components/PreviewBtn';
import SaveDraftBtn from './create-new-post-components/SaveDraftBtn';
import CategoryInput from './create-new-post-components/CategoryInput';
import ThumbnailInput from './create-new-post-components/ThumbnailInput';
import DescInput from './create-new-post-components/DescInput';
import TitleInput from './create-new-post-components/TitleInput';
import APIKeyInput from './create-new-post-components/APIKeyInput';
import ReactQuill from 'react-quill';
import dynamic from 'next/dynamic';

// https://stackoverflow.com/questions/69386843/nextjs-referrenceerror-document-is-not-defined
const ReactQuillWithNoSSR = dynamic(
  () => import('@/components/TextEditor'),
  { 
    ssr: false, // <-- not including this component on server-side
    loading:()=><div className='loader'></div>
  } 
)

export interface ArticleMetadataType{
  title:string,
  shortDescription:string,
  category:Array<string>,
  thumbnail:File|string|null,
  content:[]
}


export default function CreateNewPost(){

  // hooks
  const previewSectionRef = useRef<HTMLDivElement>(null)
  const editorSectionRef = useRef<HTMLDivElement>(null)
  const textEditorRef = useRef<ReactQuill>(null)
  const firstTimeRender = useRef(true)

  const [previewElem,setPreviewElem] = useState<JSX.Element>()
  const [previewRef, setPreviewRef] = useState<HTMLDivElement>();
  const [API_key,set_API_key] = useState<string>("")
  const [content, setContent] = useState('');

  const [articleMetadata,setArticleMetadata] = useState<ArticleMetadataType>({
    title:"",
    shortDescription:"",
    category:[],
    thumbnail:null,
    content:[]
  })


  const onPreviewRefSet = useCallback((e:HTMLDivElement) => {
    // console.log(e)
    setPreviewRef(e);
  },[]);
  

  useEffect(()=>{
    const articleMetadataLS = window.localStorage.getItem("article-metadata")
    if(!articleMetadataLS) return console.warn("articleMetadataLS is ",articleMetadataLS)

    // console.log("articleMetadataLS=",articleMetadataLS)

    const parsedData = JSON.parse(articleMetadataLS)
    // console.log("parsedData=",parsedData)

    setArticleMetadata(parsedData)

  },[])


  useEffect(() => {
    // console.log("articleMetadata=",articleMetadata)
    // console.log("firstTimeRender=",firstTimeRender)
    if(firstTimeRender.current){
      firstTimeRender.current = false
      return
    }

    const { content, thumbnail, ...rest } = articleMetadata;
    window.localStorage.setItem("article-metadata",JSON.stringify(rest))
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[
    articleMetadata.category,
    articleMetadata.shortDescription,
    articleMetadata.title
  ])

  useEffect(() => {
    if(firstTimeRender.current){
      firstTimeRender.current = false
      return
    }
    
    const deltaContents = textEditorRef.current?.editor?.getContents()
    // console.log("deltaContents=",deltaContents)

    setArticleMetadata(prev=>({
      ...prev,
      content:deltaContents?.ops as []
    }))
  },[content])






  // methods


  const handleEditorView = () => {
    // console.log(previewSectionRef.current)
    editorSectionRef.current!.classList.remove("hidden")
    previewSectionRef.current!.classList.add("!hidden")
  }





  // render
  return (
    <div className='w-full flex items-center flex-col'>
      <div className='[&>button]:mx-1'>
        {/* TODO: all of these button have the same class, try to simplify it */}
        {/* <button className='border rounded py-1 px-2 bg-zinc-50 shadow-inner text-sm hover:shadow' onClick={handleEditorView}>Editor</button> */}

        <PreviewBtn 
          textEditorRef={textEditorRef}
          setPreviewElem={setPreviewElem}
          articleMetadata={articleMetadata}
          content={content}
        />

        <PostBtn 
          textEditorRef={textEditorRef}
          articleMetadata={articleMetadata} 
          API_key={API_key} 
          previewElem={previewElem}
        />

        <SaveDraftBtn articleMetadata={articleMetadata} API_key={API_key}/>

      </div>

      {/* editor section */}
      <div className='my-3 p-5 border rounded-xl w-3/4 bg-slate-100 flex flex-col gap-y-5 dark:bg-zinc-900' ref={editorSectionRef}>
      
        <TitleInput title={articleMetadata.title} setArticleData={setArticleMetadata}/>

        <DescInput desc={articleMetadata.shortDescription} setArticleData={setArticleMetadata}/>

        <CategoryInput category={articleMetadata.category} setArticleData={setArticleMetadata}/>

        <APIKeyInput API_keyState={[API_key,set_API_key]}/>

        <ThumbnailInput articleMetadataState={[articleMetadata,setArticleMetadata]}/>

        <ReactQuillWithNoSSR contentState={[content, setContent]} textEditorRef={textEditorRef}/>
      </div>

      {/* preview section, grid (container) */}
      <div ref={onPreviewRefSet} data-cy="preview-article-section">
        {
          previewRef && createPortal(previewElem,previewRef)
        }
      </div>
    </div>
  )
}


/**
 * reference
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 * c) bugs on execCommand() and queryCommandState() when the, in this case I was using <sup> and <sub> element, <sup> and <sub> were styled. Those two were getting styled default(-ly) by the tailwind.
 * - https://stackoverflow.com/questions/17166103/document-execcommand-to-execute-superscript-and-subscript-doesnt-work-in-firefo
 */