"use client"

import Quill, { Sources } from 'quill';
import 'react-quill/dist/quill.snow.css';

import { Dispatch, RefObject, SetStateAction, useMemo, useRef } from 'react'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css';
import { UnprivilegedEditor } from 'react-quill';

import ReactQuill from 'react-quill';
import chalk from 'chalk';





// https://github.com/quilljs/quill/blob/develop/formats/image.ts
const ImageBase = Quill.import('formats/image');

// https://stackoverflow.com/questions/59503488/data-attribute-for-image-tag-in-quill
class CustomImage extends ImageBase {
  static create(value: any) {
    // console.log("value=",value)
    const node = super.create();
    Object.getOwnPropertyNames(value).forEach((attribute_name) => {
      node.setAttribute(attribute_name, value[attribute_name]);
    });

    return node;
  }

  /**
   * Converts the image blot to HTML tag
   * @param node
   */
  static value(node: HTMLElement) {

    const blot: { [key: string]: string | null } = {};
    node.getAttributeNames().forEach((attribute_name) => {
      blot[attribute_name] = node.getAttribute(attribute_name);
    });
    // console.log("blot=",blot)
    return blot;
  }
}
Quill.register('formats/image', CustomImage);


// https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
const toBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = reject;
  });
}


interface TextEditorProps{
  contentState:[string, Dispatch<SetStateAction<string>>]
  textEditorRef: RefObject<ReactQuill>
}

export default function TextEditor({contentState,textEditorRef}: TextEditorProps) {
  // hooks
  const saveEditorContentTimeout = useRef<NodeJS.Timeout|null>(null)

  const [content,setContent] = contentState


  // methods
  // custom image handler
  function imageHandler(){
    console.log(chalk.yellow("@imageHandler"))

    // @ts-ignore
    // NOTE TO `@ts-ignore`: the type should be an `Toolbar` object(just console.log it `this`) but it's nowhere to found in the React Quill library.
    console.log("this=",this)

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = async () => {
      const file = input.files![0];
      console.log("file=",file)

      // file type is only image.
      if (/^image\//.test(file.type)) {
        const dataURL = await toBase64(file)
        // console.log("dataURL=",dataURL)
    
        // setContentImages(prev=>[...prev,file])

        // saveToServer(file);
        // @ts-ignore
        insertToEditor(dataURL,this,file)
      } else {
        console.warn('You could only upload images.');
      }
    };
  }

  function insertToEditor(dataURL: string, editor: any,file: File){
    // push image url to rich editor.
    const pointerRange = editor.quill.getSelection();
    console.log("pointerRange=",pointerRange)

    editor.quill.insertEmbed(
      pointerRange.index, 
      "image",
      {
        src:dataURL,
        "data-filename":file.name
      },
      "user"
    );
  }


  // use `useMemo` hook to prevent this rendered for any every state change
  const modules = useMemo(
    () => ({
      toolbar: {
        container:[
          [{ 'header': [2, 3, false] },{ 'font': [] }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }, { 'background': [] }],
          ['blockquote', 'code-block'],
          [{ 'script': 'sub'}, { 'script': 'super' },'strike'],
          [{'list': 'ordered'}, {'list': 'bullet'}, { 'align': [] }, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
        handlers:{
          "image":imageHandler
        },
      },
      syntax: {
        highlight: (text: string) => {
          // console.log("@highlight(): text=",text)
          return hljs.highlightAuto(text).value
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  
  const handleTextEditorChange = (
    val: string, 
    delta: any, 
    source: Sources, 
    editor: UnprivilegedEditor
  ) => {
    // console.log("val=",val)
    // console.log("delta=",delta)
    // console.log("source=",source)
    // console.log("editor.getSelection()=",editor.getSelection())
    // console.log("editor.getContents()=",editor.getContents())
    // console.log("editor.getLength=",editor.getLength())


    setContent(val)


    if(saveEditorContentTimeout.current){
      // console.log("clear the auto save editor timeout ")
      clearTimeout(saveEditorContentTimeout.current)
      saveEditorContentTimeout.current = null
    }
    saveEditorContentTimeout.current = setTimeout(() => {
      // console.log("save the text editor content!")
      window.localStorage.setItem("textEditorContent",val)
    },1000)
  }



  // render
  return (
    <ReactQuill 
      theme="snow" 
      value={content} 
      onChange={handleTextEditorChange} 
      ref={textEditorRef}
      modules={modules}
    />
  )
}