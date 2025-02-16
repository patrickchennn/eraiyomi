"use client"

import chalk from 'chalk'
import EditMdFileInput from './EditMdFileInput'
import { useState } from 'react'
import { AiOutlineFileMarkdown } from 'react-icons/ai'
import { Article } from '../EditArticle'

interface EditorChoiceProps {
  article: Article
  mdInputUploadRef: React.MutableRefObject<HTMLInputElement | null>
  contentActionRef: React.MutableRefObject<"default"|"change"|"delete">
  rawTextState: [string, React.Dispatch<React.SetStateAction<string>>]
}
const EditorChoice = ({
  article,
  mdInputUploadRef,
  contentActionRef,
  rawTextState,
}: EditorChoiceProps) => {

  const [selectedEditor, setSelectedEditor] = useState<"markdown" | null>(null)

  const handleMarkdown = async () => {
    console.log(chalk.blueBright.bgBlack("@handleMarkdown"))

    // Set the selected editor to "markdown"
    setSelectedEditor("markdown")
  }

  return (
    <>
      <div>
        <label>Editor:</label>
        <ul onClick={handleMarkdown} className='flex'>
          <button className='px-2 border rounded bg-slate-100 dark:bg-zinc-900'>
            Markdown <AiOutlineFileMarkdown className='inline' />
          </button>
        </ul>
      </div>
      <div>
        {selectedEditor === "markdown" && (
          <EditMdFileInput
            articleId={article._id}
            mdInputUploadRef={mdInputUploadRef}
            contentActionRef={contentActionRef}
            rawTextState={rawTextState}
          />
        )}
      </div>
    </>
  )
}

export default EditorChoice
