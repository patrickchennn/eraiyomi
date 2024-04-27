import { useContext, useRef, useState } from "react"
import chalk from "chalk"
import { BsTrash3 } from "react-icons/bs";
import words from "lodash.words";
import { EditArticleDataCxt } from "../EditArticle";
import MarkdownEditor from "@uiw/react-markdown-editor";
import debounce from "lodash.debounce";

interface MdFileInputInputProps{
}
function EditMdFileInput({
}: MdFileInputInputProps) {
  const c = useContext(EditArticleDataCxt)!
  const [articleData,setArticleData] = c.articleDataState
  
  const [contentMD_local,setContentMD_local] = useState<string>(articleData.content as string)

  const fileInputRef = useRef<null|HTMLInputElement>(null);

  // methods
  const resetInputFile = () => {
    // Check if the file input is not null
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setArticleData(prev=>({
        ...prev,
        contentStuctureType:"",
        content:"",
        wordCounts:0
      }))
    }
  };

  const handleMarkdownFile = (e: React.ChangeEvent) => {
    console.log(chalk.yellow.bgBlack("@handleMarkdownFile"))
    const target = e.target as HTMLInputElement
    console.log("target=",target)

    const file = target.files
    console.log("file=",file)

    if (file && file.length>0) {
      const mdFile = file[0]
      console.log("mdFile=",mdFile)

      // IF: the given file is NOT an .md type
      if(mdFile.type!=="text/markdown"){
        return alert("Wrong extention; wrong file. It supposed to be '.md' file")
      }


      // Create a new FileReader object
      const reader = new FileReader();

      // Define what happens when the reading succeeds
      reader.onload = (readEvent) => {
        if (readEvent.target === null) {
          return 
        }
        // The result attribute contains the contents of the file as a text string
        const content = readEvent.target.result;
        console.log("File content:", content);

        if (typeof content === 'string') { // Confirming it's a string
          console.log("File content:", content);
          // You can now handle the Markdown content as needed
          // e.g., setting it to state, parsing it, etc.
          setArticleData(prev=>({
            ...prev,
            contentStuctureType:"markdown",
            content,
            wordCounts:words(content).length
          }))
        } else {
          console.log("Expected string, received different type or null");
        }
      };

      // Read the file as text
      reader.readAsText(mdFile);
    }
  }
  
  // Update the content in the editor after a delay
  const debouncedSetContent = debounce(setContentMD_local, 500);

  const handleEditorChange = (value: string) => {
    debouncedSetContent(value);
  };

  // render
  return (
    <form
      encType="multipart/form-data" 
      method='post'
      className='w-fit'
    >
      <label htmlFor="doc_file_upload" className="block">upload a file:</label>
      <input
        type="file"
        id="doc_file_upload"
        name="doc_file_upload"
        accept="text/markdown, text/plain"
        onChange={handleMarkdownFile}
        ref={fileInputRef}  // Attach the ref to the file input
      />
      <button type="button" onClick={resetInputFile}>
        <BsTrash3 className="inline"/>
      </button>

      <MarkdownEditor
        value={contentMD_local}
        onChange={handleEditorChange}
      />
    </form>
  )
}

export default EditMdFileInput