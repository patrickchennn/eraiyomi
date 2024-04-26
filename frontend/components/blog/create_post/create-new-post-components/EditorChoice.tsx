import dynamic from 'next/dynamic'
import { useContext, useState } from 'react'
import MdFileInput from './MdFileInput'
import { ArticleDataType, CreateNewPostStateCtx } from '../CreateNewPost'
import chalk from 'chalk'

// https://stackoverflow.com/questions/69386843/nextjs-referrenceerror-document-is-not-defined
const ReactQuillWithNoSSR = dynamic(
  () => import('@/components/TextEditor'),
  { 
    ssr: false, // <-- not including this component on server-side
    loading:()=><div className='loader'></div>
  } 
)

function EditorChoice() {
  const c = useContext(CreateNewPostStateCtx)
  const [content,setContent] = c.contentState

  const [selectedEditor, setSelectedEditor] = useState(null); // New state for tracking the selected editor

  const handleEditorChoice = (e) => {
    console.log(chalk.yellow.bgBlack("@handleEditorChoice"))
    const target = e.target as HTMLElement
    console.log("target=",target)
    
    setSelectedEditor(target.textContent); // Update the selected editor based on button text

  }

  return (
    <>
      {/* edtior choices */}
      <div>
        <button>
          editor
        </button>
        <ul onClick={handleEditorChoice}>
          <li>
            <button>
              markdown
            </button>
          </li>
          <li>
            <button>
              quilljs
            </button>
          </li>
        </ul>
      </div>

      <div>
        {selectedEditor === 'markdown' && (
          <MdFileInput />
        )}
        {selectedEditor === 'quilljs' && (
          <ReactQuillWithNoSSR 
            contentState={[content, setContent]} 
            textEditorRef={c.textEditorRef}
          />
        )}
      </div>
    </>
  )
}

export default EditorChoice