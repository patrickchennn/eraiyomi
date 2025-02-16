import React from "react"
import chalk from "chalk"
import isEmpty from "lodash.isempty"
import isEqual from "lodash.isequal"
import { Article } from "./EditArticle"
import getCookie from "@/utils/getCookie"
import { putArticle } from "@/services/article/articleService"
import { putArticleImgContent } from "@/services/article/articleImageContentService"
import { deleteArticleThumbnail, putArticleThumbnail } from "@/services/article/articleThumbnailService"
import { putArticleContent } from "@/services/article/articleContentService"

interface SaveBtnProps {
  buttonStyle: string
  API_key: string
  article: Article
  mdInputUploadRef: React.MutableRefObject<HTMLInputElement|null>
  contentActionRef: React.MutableRefObject<"default"|"change"|"delete">
  articleDefaultDataRef: React.MutableRefObject<Article>
  thumbnailRef :React.MutableRefObject<HTMLInputElement|null>
  thumbnailActionRef: React.MutableRefObject<"default"|"change"|"delete">
}
export default function SaveBtn({
  buttonStyle,
  API_key,
  article,
  mdInputUploadRef,
  contentActionRef,
  articleDefaultDataRef,
  thumbnailRef,
  thumbnailActionRef
}: SaveBtnProps){
  const handleSave = async () => {
    console.info(chalk.blueBright.bgBlack("[INF] @handleSave()"))
    
    
    // Client-side check IF: API key is not provided
    console.log("API_key=",API_key)
    if(!API_key) return alert("API key is needed.")

    const JWT_token = getCookie("userCredToken")
    console.log("JWT_token=",JWT_token)
    // Client-side check IF: the user have not login or maybe intentionally remove JWT
    if(JWT_token===null){
      return alert("No JWT provided")
    }

    let isSingleError = false;


    // 1. Handle data other than thumbnail, content, imageContent

    // `changedArticle` is used to collectively store article data that is changed
    const changedArticle: {[key: string]:any} = {} 

    // This logic is about checking whether the article data is changed from the original one. If changed simply put that on that object `changedArticle`
    for (const [key, newVal] of Object.entries(article)) {
      // console.log("newVal=",newVal)

      const defaultVal = articleDefaultDataRef.current[key as keyof Article]
      // console.log("defaultVal=",defaultVal)


      // Skip if we meet these keyword because it will gets handled separately below
      if(key==="thumbnail" || key==="content" || key==="imageContent") continue
      
      /**
       * Here is the actual logic where it determines whether the article data is changed or not 
       * `isEqual` is used because it gives a deep comparasion. When using normal comparasion `===`/`==` particularly it does not validate array comparasion correctly. 
       * https://www.geeksforgeeks.org/how-to-compare-two-arrays-in-javascript/
       * https://www.geeksforgeeks.org/lodash-_-isequal-method/
       */
      if(!isEqual(newVal,defaultVal)){
        changedArticle[key] = newVal
        console.info(chalk.blueBright.bgBlack(`[INF] ${key} is changed:`,defaultVal,"-->",newVal))
      }
    }

    let articleMetadataRes = null
    // IF: there is something in that `changedArticle` object --> it means the user decided to edit/changed the article meta data (which we already handle it on the previous logic)
    if(!isEmpty(changedArticle)){
      console.info(chalk.blueBright.bgBlack(`[INF] There is some changes on article data --> calling the edit article API`))

      // Simply call the API to make the change
      articleMetadataRes = await putArticle(API_key, JWT_token,article._id,changedArticle)
      console.log("articleMetadataRes=",articleMetadataRes)
    }
    

    if(articleMetadataRes!==null && articleMetadataRes.data===null) isSingleError = true
    

    let thumbnailRes = null
    // 2. Handle the uploaded-type-data: article.thumbnail
    // console.log("thumbnailRef=",thumbnailRef)
    console.log("thumbnailActionRef.current=",thumbnailActionRef.current)
    if(thumbnailActionRef.current!=="default"){
      console.log(chalk.blueBright.bgBlack("[INF] Handle thumbnail"))
      
      if(thumbnailActionRef.current==="change"){
        // Assuming: `thumbnailRef.current` and `thumbnailRef.current.files` won't be null 
        const thumbnailFiles = thumbnailRef.current!.files!;
    
        const thumbnailFile = thumbnailFiles[0]
        console.log("thumbnailFile=",thumbnailFile)

        const thumbnailForm = new FormData()

        thumbnailForm.append("thumbnail",thumbnailFile)

        thumbnailRes = await putArticleThumbnail(API_key,JWT_token,article._id,thumbnailForm)
        console.log("thumbnailRes=",thumbnailRes)

      }else if(thumbnailActionRef.current==="delete"){
        thumbnailRes = await deleteArticleThumbnail(API_key,JWT_token,article._id)
        console.log("thumbnailRes=",thumbnailRes)
      }
    }

    if(thumbnailRes!==null && thumbnailRes.data===null) isSingleError = true


    let contentRes = null, imageContentRes = null
    // 3. Handle the content and image-content
    console.log("mdInputUploadRef=",mdInputUploadRef)
    if (contentActionRef.current!=="default") {
      console.log(chalk.blueBright.bgBlack("[INF] Handle the content and image-content"))

      const contentForm = new FormData()
      const imageContentForm = new FormData()

      // Assuming: `mdInputUploadRef.current` and `mdInputUploadRef.current.files` won't be null 
      const files = mdInputUploadRef.current!.files!;
  
      const fileList = Array.from(files);
      console.log("fileList=",fileList)


      const imageContentMetadata: {[key: string]: string} = {}
      fileList.forEach(file => {
        if(file.type==="text/markdown"){
          contentForm.append('content', file); 
        }else if(file.type==="image/png" || file.type==="image/jpeg"){
          imageContentForm.append('image-content', file);
          imageContentMetadata[file.name] = file.webkitRelativePath
        }
      });

      imageContentForm.append("image-content", JSON.stringify(imageContentMetadata))

      contentRes = await putArticleContent(API_key, JWT_token, article._id, contentForm)
      imageContentRes = await putArticleImgContent(API_key, JWT_token, article._id, imageContentForm) 
    }

    if(contentRes!==null && contentRes.data===null) isSingleError = true
    if(imageContentRes!==null && imageContentRes.data===null) isSingleError = true


    if(isSingleError){
      alert("Error editing article")
    }else{
      alert("Successfully editing article")
    }
  }

  
  return (
    <button onClick={handleSave} className={buttonStyle}>Save</button>
  )
}