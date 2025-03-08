"use client"

import { useContext } from "react"
import { CreateNewPostStateCtx } from "../CreateNewPost"
import chalk from "chalk"
import { BsTrash3 } from "react-icons/bs";
import MarkdownEditor from "@uiw/react-markdown-editor";
import debounce from 'lodash.debounce';
import calculateWordCount from "@/utils/calculateWordCount";


function MdFileInput() {
  // ~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~
  const c = useContext(CreateNewPostStateCtx)!
  const [rawText, setRawText] = c.rawTextState
  const [article,setArticle] = c.articleDataState
  const mdInputUploadRef = c.mdInputUploadRef

  // ~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~
  const resetInputFile = () => {
    console.log(chalk.blueBright.bgBlack("@resetInputFile"))
    // Check if the file input is not null
    if (mdInputUploadRef.current) {
      mdInputUploadRef.current.value = "";
      setRawText("")
    }
  };

  const handleMarkdownFile = (e: React.ChangeEvent) => {
    console.log(chalk.blueBright.bgBlack('@handleMarkdownFile'))

    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (files===null) return;

    const fileList = Array.from(files);
    console.log("fileList=",fileList)

    // Separate markdown files and assets
    const markdownFiles = fileList.filter((file) => file.type === 'text/markdown');

    const assetFiles = fileList.filter((file) => file.type !== 'text/markdown');
    console.log("assetFiles=",assetFiles)


    if (markdownFiles.length === 0) {
      alert("No Markdown file found. Please upload only one '.md' file.");
      return;
    }

    // Handle the first markdown file (assuming you want to process only one for now)
    const mdFile = markdownFiles[0];
    console.log('mdFile=', mdFile);

    // `reader` is about read the markdown file, like actually extract the text
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result as string;
      // console.log('Markdown content:', content);

      // Adjust the word counts
      setArticle(data => ({
        ...data,
        totalWordCounts:calculateWordCount(content)
      }))

      // Render the input
      setRawText(content)
    };

    reader.readAsText(mdFile);

    // Handle the asset files (if any)
    if (assetFiles.length > 0) {
      console.log('Asset files:', assetFiles);
      // You can process assets and store their references in the state as needed
    }
  }

  // Update the content in the editor after a delay
  const debouncedSetContent = debounce(setRawText, 500);

  const handleEditorChange = (value: string) => {
    debouncedSetContent(value);
  };


  // ~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~
  return (
    <div>
      <form
        encType="multipart/form-data" 
        method='post'
        className='w-fit'
      >
        <input
          type="file"
          id="markdown-input"
          name="markdown-input"
          accept="*"
          onChange={handleMarkdownFile}
          multiple
          // @ts-ignore
          webkitdirectory="true"
          ref={mdInputUploadRef}
        />
        <button type="button" onClick={resetInputFile}>
          <BsTrash3 className="inline"/>
        </button>
      </form>

      {/* @TODO: still laggy for large input like 700+ lines of text, temporarily off */}
      <MarkdownEditor
        value={rawText}
        onChange={handleEditorChange}
      />
    </div>
  )
}

export default MdFileInput