import dynamic from 'next/dynamic'
import { useContext } from 'react'
import EditMdFileInput from './EditMdFileInput'
import { EditArticleDataCxt } from '../EditArticle'

// https://stackoverflow.com/questions/69386843/nextjs-referrenceerror-document-is-not-defined
const ReactQuillWithNoSSR = dynamic(
  () => import('@/components/TextEditor'),
  { 
    ssr: false, // <-- not including this component on server-side
    loading:()=><div className='loader'></div>
  } 
)

function EditorChoice() {
  const c = useContext(EditArticleDataCxt)!
  const [articleData,] = c.articleDataState
  const [content,setContent] = c.contentState


  return (
    <>
      editor type: {articleData.contentStructureType}
      <button>show editor</button>
      {articleData.contentStructureType === 'markdown' && (
        <EditMdFileInput />
      )}
      {articleData.contentStructureType === 'quilljs' && (
        <ReactQuillWithNoSSR 
          contentState={[content, setContent]} 
          textEditorRef={c.textEditorRef}
        />
      )}
    </>
  )
}

export default EditorChoice