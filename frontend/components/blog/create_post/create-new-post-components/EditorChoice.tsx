import { useState } from 'react'
import MdFileInput from './MdFileInput'
import { AiOutlineFileMarkdown } from "react-icons/ai";
import chalk from 'chalk';


function EditorChoice() {


  const [selectedEditor, setSelectedEditor] = useState(""); // state for tracking the selected editor

  const handleEditorChoice = (e: React.MouseEvent) => {
    console.log(chalk.blueBright.bgBlack("@handleEditorChoice"))
    const target = e.target as HTMLElement
    // console.log("target=",target)
    console.log("target.textContent=",target.textContent)
    
    setSelectedEditor(target.textContent as string); // Update the selected editor based on button text

  }

  return (
    <>
      {/* edtior choices */}
      <div>
        <button>Editor</button>
        <ul onClick={handleEditorChoice} className='flex'>
          <button className='px-2 border rounded bg-slate-100 dark:bg-zinc-900'>Markdown Editor<AiOutlineFileMarkdown className='inline'/></button>
        </ul>
      </div>

      <div>
        {selectedEditor === 'Markdown Editor' && (
          <MdFileInput />
        )}
      </div>
    </>
  )
}

export default EditorChoice