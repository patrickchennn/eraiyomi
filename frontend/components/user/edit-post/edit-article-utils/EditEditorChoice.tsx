import chalk from 'chalk'
import EditMdFileInput from './EditMdFileInput'
import { useState } from 'react'
import { AiOutlineFileMarkdown } from 'react-icons/ai'


interface EditorChoiceProps{
  articleAssetState: any
  markdownFilesState:any
  rawMarkdownStringState:any
}
const EditorChoice = ({
  articleAssetState,
  markdownFilesState,
  rawMarkdownStringState
}: EditorChoiceProps) => {

  const [selectedEditor, setSelectedEditor] = useState(""); // New state for tracking the selected editor

  const handleEditorChoice = (e: React.MouseEvent) => {

    console.log(chalk.blueBright.bgBlack("@handleEditorChoice"))
    const target = e.target as HTMLElement
    console.log("target=",target)
    console.log("target.textContent=",target.textContent)
    
    setSelectedEditor(target.textContent as string); // Update the selected editor based on button text

  }

  return (
    <>
      <div>
        <label>Editor:</label>
        <ul onClick={handleEditorChoice} className='flex'>
          <button className='px-2 border rounded bg-slate-100 dark:bg-zinc-900'>Markdown<AiOutlineFileMarkdown className='inline'/></button>
        </ul>
      </div>
      <div>
        {selectedEditor === 'Markdown' && (
          <EditMdFileInput 
            articleAssetState={articleAssetState} 
            markdownFilesState={markdownFilesState}
            rawMarkdownStringState={rawMarkdownStringState}
          />
        )}
      </div>
    </>
  )
}

export default EditorChoice