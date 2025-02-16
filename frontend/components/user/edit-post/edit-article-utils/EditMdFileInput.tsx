"use client"

import { useEffect } from "react"
import { BsTrash3 } from "react-icons/bs";

import MarkdownEditor from "@uiw/react-markdown-editor";
import debounce from "lodash.debounce";
import isEmpty from "lodash.isempty";
import { Article } from "../EditArticle";
import chalk from "chalk";
import { getArticleContent } from "@/services/article/articleContentService";


interface MdFileInputInputProps{
  articleId: string
  mdInputUploadRef: React.MutableRefObject<HTMLInputElement | null>
  contentActionRef: React.MutableRefObject<"default"|"change"|"delete">
  rawTextState: [string, React.Dispatch<React.SetStateAction<string>>]
}
function EditMdFileInput({
  articleId,
  mdInputUploadRef,
  contentActionRef,
  rawTextState
}: MdFileInputInputProps) {

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [rawText, setRawText] = rawTextState
  useEffect(() => {
    console.log("@useEffect fetch content from server")

    getArticleContent(articleId)
      .then(resData => {
        if(resData.data!==null) {
          setRawText(resData.data.rawText)
        }
      })
    ;
    
  }, [])


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const resetInputFile = () => {
    console.log(chalk.blueBright.bgBlack('@resetInputFile'));

    // Check if the file input is not null
    if (mdInputUploadRef.current) {
      mdInputUploadRef.current.value = "";
    }
    setRawText("")
    contentActionRef.current = "default"
  };

  const handleMarkdownFile = (e: React.ChangeEvent) => {
    console.log(chalk.blueBright.bgBlack('@handleMarkdownFile'));

    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (!files) return alert("files is null");

    const fileList = Array.from(files);
    console.log("fileList=",fileList)

    // Separate markdown files and assets
    const markdownFiles = fileList.filter((file) => file.type === 'text/markdown');
    console.log("markdownFiles=",markdownFiles)

    const assetFiles = fileList.filter((file) => file.type !== 'text/markdown');
    console.log("assetFiles=",assetFiles)


    if (markdownFiles.length === 0) {
      alert("No Markdown file found. Please upload only one '.md' file.");
      return;
    }

    contentActionRef.current = "change"

    // Handle the first markdown file (assuming you want to process only one for now)
    const mdFile = markdownFiles[0];
    console.log('mdFile=', mdFile);

    // `reader` is about read the markdown file, like actually extract the text
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result as string;
      console.log('Markdown content:', content);

      setRawText(content)
    };

    reader.readAsText(mdFile);

    // Handle the asset files (if any)
    if (assetFiles.length > 0) {
      console.log('Asset files:', assetFiles);
      // You can process assets and store their references in the state as needed
    }
  };

  // Update the content in the editor after a delay
  const debouncedSetContent = debounce(setRawText, 500);

  const handleEditorChange = (value: string) => {
    debouncedSetContent(value);
  };



  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <>
      <form
        encType="multipart/form-data" 
        method='post'
        className='w-fit'
      >
        <input
          type="file"
          id="doc_file_upload"
          name="doc_file_upload"
          accept="text/markdown"
          onChange={handleMarkdownFile}
          ref={mdInputUploadRef}
          multiple
          // @ts-ignore
          webkitdirectory="true"
        />
        <button type="button" onClick={resetInputFile}>
          <BsTrash3 className="inline"/>
        </button>
      </form>

      <br />

      <MarkdownEditor
        value={rawText}
        onChange={handleEditorChange}
      />
    </>
  )
}

export default EditMdFileInput