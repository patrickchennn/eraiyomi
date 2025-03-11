import React from "react"
import chalk from "chalk"
import isEmpty from "lodash.isempty"
import isEqual from "lodash.isequal"
import getCookie from "@/utils/getCookie"
import { putArticle } from "@/services/article/articleService"
import { putArticleImgContent } from "@/services/article/articleImageContentService"
import { deleteArticleThumbnail, putArticleThumbnail } from "@/services/article/articleThumbnailService"
import { putArticleContent } from "@/services/article/articleContentService"
import { ArticlePostRequestBody } from "@shared/Article"

interface SaveBtnProps {
  buttonStyle: string
  API_key: string
  articleId: string
  article: ArticlePostRequestBody
  articleDefaultDataRef: React.MutableRefObject<ArticlePostRequestBody>
  thumbnailRef :React.MutableRefObject<HTMLInputElement|null>
  thumbnailActionRef: React.MutableRefObject<"default"|"change"|"delete">
  mdInputUploadRef: React.MutableRefObject<HTMLInputElement|null>
  contentActionRef: React.MutableRefObject<"default"|"change"|"delete">
}
export default function SaveBtn({
  buttonStyle,
  API_key,
  articleId,
  article,
  articleDefaultDataRef,
  thumbnailRef,
  thumbnailActionRef,
  mdInputUploadRef,
  contentActionRef,
}: SaveBtnProps){
  const handleSave = async () => {
    console.log(chalk.blueBright.bgBlack("@handleSave()"))
    
    
    // CLIENT-SIDE-SECURITY-CHECK IF: API key is not provided
    console.log("API_key=",API_key)
    if(!API_key) return alert("API key is needed.")

    const JWT_token = getCookie("userCredToken")
    console.log("JWT_token=",JWT_token)
    // CLIENT-SIDE-SECURITY-CHECK IF: the user have not login or maybe intentionally remove JWT
    if(JWT_token===null){
      return alert("No JWT provided")
    }

    let isSingleError = false;


    // 1. Handle data other than thumbnail, content, imageContent

    // `changedArticle` is used to collectively store article data that is changed
    const changedArticle: {[key: string]:any} = {} 

    // This logic is about checking whether the article data is changed from the original one. If changed simply put that on that object `changedArticle`
    // The sole reason this kind of logic exist is to make sure that when calling the API there is a data in it, so if there no data need to be changed, it won't call the API hence reduce the unnecessary call to server.
    for (const [key, newVal] of Object.entries(article)) {
      // console.log("newVal=",newVal)

      const defaultVal = articleDefaultDataRef.current[key as keyof ArticlePostRequestBody]
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
        console.log(chalk.blueBright.bgBlack(`${key} is changed:`,defaultVal,"-->",newVal))
      }
    }

    // IF: there is something in that `changedArticle` object --> it means the user decided to edit/changed the article meta data (which we already handle it on the previous logic)
    if(!isEmpty(changedArticle)){
      console.log(chalk.blueBright.bgBlack(`There is some changes on article data --> calling the edit article API`))

      // Simply call the API to make the change
      const articleMetadataRes = await putArticle(API_key, JWT_token,articleId,changedArticle)
      console.log("articleMetadataRes=",articleMetadataRes)

      if(articleMetadataRes!==null && articleMetadataRes.data===null) isSingleError = true
    }
    

    

    // 2. Handle the uploaded-type-data: article.thumbnail
    let thumbnailRes = null

    // console.log("thumbnailRef=",thumbnailRef)

    console.log("thumbnailActionRef.current=",thumbnailActionRef.current)

    if(thumbnailActionRef.current!=="default"){
      console.log(chalk.blueBright.bgBlack("Handle thumbnail"))
      
      if(thumbnailActionRef.current==="change"){
        // ASSUMPTION: `thumbnailRef.current` and `thumbnailRef.current.files` won't be null 
        const thumbnailFiles = thumbnailRef.current!.files!;
    
        const thumbnailFile = thumbnailFiles[0]
        console.log("thumbnailFile=",thumbnailFile)

        const thumbnailForm = new FormData()

        thumbnailForm.append("thumbnail",thumbnailFile)

        thumbnailRes = await putArticleThumbnail(API_key,JWT_token,articleId,thumbnailForm)
        console.log("thumbnailRes=",thumbnailRes)

      }else if(thumbnailActionRef.current==="delete"){
        thumbnailRes = await deleteArticleThumbnail(API_key,JWT_token,articleId)
        console.log("thumbnailRes=",thumbnailRes)
      }
    }

    if(thumbnailRes!==null && thumbnailRes.data===null) isSingleError = true


    // 3. Handle the content and image-content
    let contentRes = null

    console.log("mdInputUploadRef=",mdInputUploadRef)

    if (contentActionRef.current!=="default") {
      console.log(chalk.blueBright.bgBlack("Handle the content and image-content"))

      const contentForm = new FormData()

      // Assuming: `mdInputUploadRef.current` and `mdInputUploadRef.current.files` won't be null 
      const files = mdInputUploadRef.current!.files!;
  
      const fileList = Array.from(files);
      console.log("fileList=",fileList)


      fileList.forEach(file => {
        if(file.type==="text/markdown"){
          contentForm.append('content', file); 
        }else if(file.type==="image/png" || file.type==="image/jpeg"){
          contentForm.append('image-content', file);
        }
      });


      contentRes = await putArticleContent(API_key, JWT_token, articleId, contentForm)
    }

    if(contentRes!==null && contentRes.data===null) isSingleError = true


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