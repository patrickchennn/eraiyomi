"use client"

import { useEffect, useRef, useState } from "react"
import { BsTrash3 } from "react-icons/bs";

import debounce from "lodash.debounce";
import chalk from "chalk";
import { getArticleContent } from "@/services/article/articleContentService";
import MDEditor, { TextState, TextAreaTextApi, ContextStore } from "@uiw/react-md-editor";
import { ImgContentRefType } from "../EditArticle";
import { extractMarkdownImagesSyntax, replaceMarkdownImageSyntax } from "@/utils/markdown";


interface MdFileInputInputProps{
  articleId: string
  mdEditorRef: any
  imgContentRef: React.MutableRefObject<ImgContentRefType>
  contentActionRef: React.MutableRefObject<"default"|"change"|"delete">
}
export default function EditMdFileInput({
  articleId,
  mdEditorRef,
  imgContentRef,
  contentActionRef,
}: MdFileInputInputProps) {

  // ~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~
  const [rawText, setRawText] = useState<string>('');
  const mdInputUploadRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    console.log(chalk.bgBlack.blueBright("Hook: @useEffect fetch content from server"))

    getArticleContent(articleId,{headers:{"Cache-Control":"no-store"}})
      .then(resData => {
        if(resData.data!==null) {
          console.log("resData.data=",resData.data)

          const imgSrc: ImgContentRefType = []

          resData.data.images.forEach((img) => {
            imgSrc.push({
              type:"aws",
              file: null,
              localPreviewImgSrc: img.s3Url,
              s3Url: img.s3Url,
              fileName: img.fileName,
              relativePath: img.relativePath,
              mimeType: img.mimeType,
            })
          });
          console.log("imgSrc=",imgSrc)

          imgContentRef.current = imgSrc

          console.log("imgContentRef.current=", imgContentRef.current)

          setRawText(resData.data.rawText)
        }
      })
    ;
    
  }, [])


  // ~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~
  const handleResetMarkdownUploadInputFile = () => {
    console.log(chalk.blueBright.bgBlack('Function: @handleResetMarkdownUploadInputFile'));

    // Check if the file input is not null
    if (mdInputUploadRef.current) {
      mdInputUploadRef.current.value = "";
    }
    setRawText("")
    contentActionRef.current = "default"
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
            type:"file",
            file: img,
            localPreviewImgSrc,
            s3Url: null,
            fileName: img.name,
            relativePath: null,
            mimeType: img.type,
          })
        });
        
        imgContentRef.current = imgSrc
        console.log("imgContentRef.current=", imgContentRef.current);
      }

      // Render the input
      setRawText(content);

      contentActionRef.current = "change"
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

    contentActionRef.current = "change"
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
          accept="text/markdown"
          onChange={handleMarkdownUploadInputFile}
          ref={mdInputUploadRef}
          multiple
          // @ts-ignore
          webkitdirectory="true"
        />
        <button type="button" onClick={handleResetMarkdownUploadInputFile}>
          <BsTrash3 className="inline"/>
        </button>
      </form>

      <br />

      <MDEditor
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
                    type:"file",
                    file,
                    localPreviewImgSrc: url,
                    s3Url: null,
                    fileName: file.name,
                    relativePath: null,
                    mimeType: file.type,
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