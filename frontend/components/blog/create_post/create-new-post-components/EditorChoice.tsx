import { MutableRefObject, useRef, useState } from 'react'
import { AiOutlineFileMarkdown } from "react-icons/ai";
import chalk from 'chalk';
import debounce from 'lodash.debounce';
import { BsTrash3 } from 'react-icons/bs';
import { ImgContentRefType } from '../CreateNewPost';
import { extractMarkdownImagesSyntax, replaceMarkdownImageSyntax } from '@/utils/markdown';
import MDEditor, { ContextStore, TextAreaTextApi, TextState } from '@uiw/react-md-editor';

interface EditorChoiceProps {
  mdEditorRef: any
  imgContentRef:MutableRefObject<ImgContentRefType>
}
export default function EditorChoice({
  mdEditorRef,
  imgContentRef
}: EditorChoiceProps) {


  const [selectedEditor, setSelectedEditor] = useState(""); // state for tracking the selected editor

  const handleEditorChoice = (e: React.MouseEvent) => {
    console.log(chalk.blueBright.bgBlack("@handleEditorChoice()"))
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
          <MdFileInput 
            mdEditorRef={mdEditorRef}
            imgContentRef={imgContentRef}
          />
        )}
      </div>
    </>
  )
}




interface MdFileInputProps {
  mdEditorRef: any
  imgContentRef: MutableRefObject<ImgContentRefType>
}
function MdFileInput({
  // rawTextState,
  mdEditorRef,
  imgContentRef
}: MdFileInputProps) {
  // ~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~
  // const [rawText, setRawText] = rawTextState
  const [rawText, setRawText] = useState('');

  const mdInputUploadRef = useRef<HTMLInputElement>(null)

  // ~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~
  const handleResetMarkdownUploadInputFile = () => {
    console.log(chalk.blueBright.bgBlack("Function: @handleResetMarkdownUploadInputFile"))
    // Check if the file input is not null
    if (mdInputUploadRef.current) {
      mdInputUploadRef.current.value = "";
      setRawText("")
    }
  };

  const handleMarkdownUploadInputFile = (e: React.ChangeEvent) => {
    console.log(chalk.blueBright.bgBlack('Function: @handleMarkdownUploadInputFile'))

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

    reader.readAsText(mdFile);

    reader.onload = () => {
      console.log("Reading markdown content...");
      let content = reader.result as string;
    
      const extractedMdImgsSyntax = extractMarkdownImagesSyntax(content);
      console.log("extractedMdImgsSyntax=",extractedMdImgsSyntax)
    
      // Now handle the asset files (after content is loaded)
      if (assetFiles.length > 0) {
        console.log('Asset files:', assetFiles);
        const imgSrc: ImgContentRefType = []

        // Process assets and store their references in the state as needed
        assetFiles.forEach((img: File) => {
          let localPreviewImgSrc = ""
          extractedMdImgsSyntax.forEach((embeddedImgSyntax) => {
            if(embeddedImgSyntax.filename === img.name){

              localPreviewImgSrc = URL.createObjectURL(img)

              content = replaceMarkdownImageSyntax(
                content, 
                embeddedImgSyntax.url,
                localPreviewImgSrc
              )
            }
          });

          imgSrc.push({
            file: img,
            localPreviewImgSrc
          })
        });
        
        imgContentRef.current = imgSrc
        console.log("imgContentRef.current=", imgContentRef.current);
      }

      // Render the input
      setRawText(content);
    };
  }

  // Update the content in the editor after a delay
  const debouncedSetContent = debounce(setRawText, 100);

  const handleMarkdownEditorChange = (
    value?: string, 
    event?: React.ChangeEvent<HTMLTextAreaElement>, 
    state?: ContextStore
  ) => {
    console.log(chalk.bgBlack.blueBright("Function: @handleMarkdownEditorChange"))
    // debouncedSetContent(value);
    setRawText(value as string)
    console.log("state=",state)
  };

  // ~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~
  return (
    <>
      <form
        encType="multipart/form-data" 
        method='post'
        className='w-fit'
      >
        <input
          type="file"
          id="markdown-input"
          name="markdown-input"
          onChange={handleMarkdownUploadInputFile}
          multiple
          // @ts-ignore
          webkitdirectory="true"
          ref={mdInputUploadRef}
        />
        <button type="button" onClick={handleResetMarkdownUploadInputFile} title="Delete all">
          <BsTrash3 className="inline"/>
        </button>
      </form>

      <MDEditor
        data-cy="md-editor"
        value={rawText}
        ref={mdEditorRef}
        onChange={handleMarkdownEditorChange}
        height={1200}
        commandsFilter={(command, isExtra) => {
          // console.log("command=",command)
          // console.log("isExtra=",isExtra)
          if (command.name === "image") {
            command.execute = (state: TextState, api: TextAreaTextApi) => {
              
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.style.display = 'none';

              
              input.onchange = (event: any) => {
                const file = event.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  imgContentRef.current.push({
                    file: file,
                    localPreviewImgSrc: url
                  })
                  const markdownImageSyntax = `![uploaded-image](${url})\n`;
                  api.replaceSelection(markdownImageSyntax);
                }
              };
        
              document.body.appendChild(input);
              input.click();
              document.body.removeChild(input);
        
            };
          }
          return command;
        }}
      />
    </>
  )
}