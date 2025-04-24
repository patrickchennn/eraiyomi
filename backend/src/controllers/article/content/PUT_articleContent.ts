import { Request, Response } from "express";
import { articleModel } from "../../../schema/articleSchema.js";
import retResErrJson from "../../../utils/retResErrJson.js";
import createObjectS3 from "../../../utils/S3_createObject.js";
import S3_deleteObject from "../../../utils/S3_deleteObject.js";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { extractMarkdownImagesSyntaxArr, replaceMarkdownImageSyntax } from "../../../utils/markdown.js";

export default async function PUT_articleContent(
  req: Request<
    {articleId: string},
    {}, 
    {
      content: string,
      "image-content"?: string
    }
  >, 
  res: Response
){
  const {articleId} = req.params

  const article = await articleModel.findById(articleId)
  
  if(article===null){
    return retResErrJson(res,404,`Article is not found`)
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } ?? {};
  console.log("files=",files)

  console.log(chalk.blueBright.bgBlack("old article.content schema:"),article.content)
  console.log(chalk.blueBright.bgBlack("old article.imageContent schema:"),article.imageContent)
  
  
  const {body} = req
  console.log("body=",body)

  // ~~~~~~~~~~~~~~~~~~~~1. Handle the markdown content~~~~~~~~~~~~~~~~~~~~
  // Before inserting new content, we need to delete the content
  // IF: previous content already existed -->  delete the previous one first
  console.log(chalk.blueBright.bgBlack("Handle markdown content"))

  // ~~~~~~~~~~~~~~~1.1 Handle delete markdown content~~~~~~~~~~~~~~~
  if(article.content!==null){
    console.log(chalk.blueBright.bgBlack("Delete article.content=",article.content))

    const S3_deleteObjectRes = await S3_deleteObject(`${article.title}/${article.content.relativePath}`)

    if(S3_deleteObjectRes.isError){
      return retResErrJson(res,500,S3_deleteObjectRes.message)
    }
  }

  let markdownImgsSyntax!: {
    alt: string;
    url: string;
    filename: string;
  }[];

  let imageContentAttributes!: {
    type: "aws" | "file";
    localPreviewImgSrc: string | null;
    s3Url: string | null;
    fileName: string;
    relativePath: string | null;
    mimeType: string;
  }[];
  if(body['image-content']!==undefined){
    imageContentAttributes = JSON.parse(body["image-content"])
  }
  
  // ~~~~~~~~~~~~~~~1.2 Handle create markdown content~~~~~~~~~~~~~~~
  if(Object.hasOwn(body,"content")){
    const {content} = body

    const filename = `main-${nanoid(8)}.md`

    markdownImgsSyntax = extractMarkdownImagesSyntaxArr(content)
    console.log("markdownImgsSyntax=",markdownImgsSyntax)

    let newContent = content
    for(let i=0; i<Object.keys(markdownImgsSyntax).length; i++){
      const onMdImg = markdownImgsSyntax[i]

      if(imageContentAttributes!==undefined){
        imageContentAttributes.forEach(imgAttribute => {

          if(imgAttribute.type === "aws"){
            newContent = replaceMarkdownImageSyntax(
              newContent, 
              imgAttribute.s3Url as string, 
              imgAttribute.relativePath as string
            )
          }else if(
            imgAttribute.type === "file" && onMdImg.url === imgAttribute.localPreviewImgSrc
          ){
            files['image-content'].forEach((fileImg) => {
              if(fileImg.originalname === imgAttribute.fileName){
                newContent = replaceMarkdownImageSyntax(
                  newContent, 
                  imgAttribute.localPreviewImgSrc as string, 
                  fileImg.originalname
                )
              }
            });
          }
        });
      }
    }

    console.log("newContent=",newContent)

    const createObjectS3Res = await createObjectS3(
      `${article.title}/${filename}`,
      newContent,
      "text/markdown"
    );

    if(createObjectS3Res.isError){
      return retResErrJson(res,500,createObjectS3Res.message)
    }

    article.content = {
      fileName:filename,
      relativePath: filename,
      mimeType: "text/markdown"
    }
    console.log(chalk.blueBright.bgBlack("Create article.content=",article.content))

  }

  // ~~~~~~~~~~~~~~~~~~~~2. Handle the image-content (of the markdown~~~~~~~~~~~~~~~~~~~~
  // Before inserting new image-content, we need to delete the previous images
  console.log(chalk.blueBright.bgBlack("Handle markdown image-content"))
  console.log("imageContentAttributes=",imageContentAttributes)
  console.log("markdownImgsSyntax",markdownImgsSyntax)

  // ~~~~~~~~~~~~~~~2.1. Handle image-content deletion~~~~~~~~~~~~~~~
  if(article.imageContent.length>0){
    const indicesToBeDeleted = []

    for(let i=0; i<article.imageContent.length; i++){
      const onDbImg = article.imageContent[i]

      let toBeDeleted = true
      if(imageContentAttributes !== undefined){
        imageContentAttributes.forEach(givenImg => {
          if(givenImg.relativePath === onDbImg.relativePath){
            toBeDeleted = false
          }
        });
      }

      if(toBeDeleted){
        indicesToBeDeleted.push(i)
      }
    }

    for(let i=0; i<indicesToBeDeleted.length; i++){
      const idx = indicesToBeDeleted[i]

      console.log(chalk.bgBlack.blueBright("Delete image-content: "),article.imageContent[idx])

      const S3_deleteObjectRes = await S3_deleteObject(`${article.title}/${article.imageContent[idx].relativePath}`)
    
      if(S3_deleteObjectRes.isError){
        return retResErrJson(res,500,S3_deleteObjectRes.message)
      }

      article.imageContent.splice(idx,1)
    }
  }

  // ~~~~~~~~~~~~~~~2.2. Handle image-content creation~~~~~~~~~~~~~~~
  if(files['image-content'] !== undefined){
    for(let i=0; i<files['image-content'].length; i++){
      const fileImg = files['image-content'][i]

      for(let j=0; j<imageContentAttributes.length; j++){
        const givenImg = imageContentAttributes[j]
        
        if(givenImg.type === "file" && givenImg.fileName === fileImg.originalname){
          console.log(chalk.blueBright.bgBlack("Create image-content: "),fileImg)

          const src = decodeURIComponent(givenImg.fileName)

          const createObjectS3Res = await createObjectS3(
            `${article.title}/${src}`,
            fileImg.buffer,
            fileImg.mimetype
          );
          
          if(createObjectS3Res.isError){
            return retResErrJson(res,500,createObjectS3Res.message)
          }
    
          article.imageContent.push({
            fileName: fileImg.originalname,
            relativePath:src,
            mimeType: fileImg.mimetype,
          })
        }
      }
    }
  }

  console.log(chalk.blueBright.bgBlack("new article.content schema:"),article.content)
  console.log(chalk.blueBright.bgBlack("new article.imageContent schema:"),article.imageContent)

  await article.save()

  return res.status(201).json({message:"Successfully edit article"})
}