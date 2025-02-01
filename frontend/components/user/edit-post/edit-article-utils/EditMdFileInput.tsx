import { useRef } from "react"
import { BsTrash3 } from "react-icons/bs";
import MarkdownEditor from "@uiw/react-markdown-editor";
import debounce from "lodash.debounce";
import { ArticleAssetState } from "../EditArticle";


interface MdFileInputInputProps{
  articleAssetState: ArticleAssetState
  markdownFilesState: any
  rawMarkdownStringState: any
}
function EditMdFileInput({
  articleAssetState,
  markdownFilesState,
  rawMarkdownStringState
}: MdFileInputInputProps) {
  const [articleAssetData,setArticleAssetData] = articleAssetState

  const [markdownFiles,setMarkdownFiles] = markdownFilesState
  const [rawMarkdownString, setRawMarkdownString] = rawMarkdownStringState

  const fileInputRef = useRef<null|HTMLInputElement>(null);

  // methods
  const resetInputFile = () => {
    // Check if the file input is not null
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setArticleAssetData(prev=>({
        ...prev,
        contentStructureType:null,
        content:"",
        totalWordCounts:0
      }))
    }
  };

  const handleMarkdownFile = (e: React.ChangeEvent) => {
    console.log('File(s) selected');

    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    console.log("fileList=",fileList)

    // Separate markdown files and assets
    const markdownFiles = fileList.filter((file) => file.type === 'text/markdown');
    console.log("markdownFiles=",markdownFiles)

    const assetFiles = fileList.filter((file) => file.type !== 'text/markdown');
    console.log("assetFiles=",assetFiles)


    if (markdownFiles.length === 0) {
      alert("No Markdown file found. Please upload at least one '.md' file.");
      return;
    }

    // Handle the first markdown file (assuming you want to process only one for now)
    const mdFile = markdownFiles[0];
    console.log('mdFile=', mdFile);

    // `reader` is about read the markdown file, like actually exract the text
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result as string;
      // console.log('Markdown content:', content);

      // Update state with the markdown content
      setArticleAssetData((prev) => ({
        ...prev,
        contentStructureType: 'markdown',
        totalWordCounts: content.split(/\s+/).length,
      }));
      setMarkdownFiles(fileList)
    };

    reader.readAsText(mdFile);

    // Handle the asset files (if any)
    if (assetFiles.length > 0) {
      console.log('Asset files:', assetFiles);
      // You can process assets and store their references in the state as needed
    }

    // setMarkdownFiles(fileList)
  };

    // Update the content in the editor after a delay
    const debouncedSetContent = debounce(setRawMarkdownString, 500);

  const handleEditorChange = (value: string) => {
    debouncedSetContent(value);
  };



  // render
  return (
    <>
      <form
        encType="multipart/form-data" 
        method='post'
        className='w-fit'
      >
        <label htmlFor="doc_file_upload" className="block">You can upload a single markdown file or markdown with its asset such as images:</label>
        <input
          type="file"
          id="doc_file_upload"
          name="doc_file_upload"
          accept="text/markdown"
          onChange={handleMarkdownFile}
          ref={fileInputRef}
          multiple
          // @ts-ignore
          webkitdirectory="true"
        />
        <button type="button" onClick={resetInputFile}>
          <BsTrash3 className="inline"/>
        </button>
      </form>

      <br />

      <label className="block">Or you can also just type directly in this markdown editor:</label>
      <MarkdownEditor
        value={rawMarkdownString}
        onChange={handleEditorChange}
      />
    </>
  )
}

export default EditMdFileInput
