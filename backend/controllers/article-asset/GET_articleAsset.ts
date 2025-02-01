import { Request,Response } from "express"
import { articleAssetModel } from "../../schema/articleAssetSchema.js"
import { articleModel } from "../../schema/articleSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { s3Client, AWS_BUCKET_NAME } from "../../index.js";
import chalk from "chalk";
import { marked, Tokens } from "marked";
import axios from "axios";

import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
// import 'highlight.js/styles/atom-one-dark.css';


// Use marked-highlight as a plugin
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    // Options for marked-highlight
    highlight: (code,lang, info) => {
      // console.log("lang=",lang)
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const hlCode = hljs.highlight(code, { language })
      return hlCode.value;
    }
  }),
)

marked.use({
  breaks: true,
  renderer:{
    heading:({depth, text}) => {
      console.info(chalk.blueBright.bgBlack("[INF] `marked.use` @heading()"))
      console.log("depth=",depth)
      console.log("text=",text)

      if(depth===1) return ""
      return `<h${depth}>${text}</h${depth}>`
    },
    list: (token: Tokens.List) => {
      console.log(chalk.blueBright.bgBlack("[INF] `marked.use` @list()"))
      console.log("token=",token)
      const listType = token.ordered ? "ol" : "ul";
      const listStyle = token.ordered ? "list-decimal" : "list-disc";

      return `<${listType} class="pl-10 ${listStyle}">${token.raw}</${listType}>`;
      
    },
    codespan: ({text}) => {
      console.log(chalk.blueBright.bgBlack("[INF] `marked.use` @codespan"))

      console.log("text=",text)
      return `<code class="rounded-sm px-1 bg-gray-800 shadow-inner text-green-400">${text}</code>`
    },
  }
})

/**
 * @desc get an article asset
 * @route GET /api/article-asset/?id=${articleId}}
 * @access public
 */
export const GET_articleAsset =  async (
  req: Request<{}, {}, {title: string},{id:string,title:string}>,
  res: Response
) => {
  const {id} = req.query


  const articleAsset = await articleAssetModel.findOne({articleIdRef:id}).lean()
  console.log("articleAsset=",articleAsset)

  if(articleAsset===null){
    return retResErrJson(res,404,`article-asset with id "${id} is not found"`)
  }

  const article = await articleModel.findOne({id}, 'titleArticle.URLpath')
  // console.log("article=",article)
  
  if(article===null){
    return retResErrJson(res,500,`Article with id=${id} is not found, but article-asset is found, with id=${articleAsset._id}. It's 500 Internal Server Error because article and article-asset were suppossed to be exist respectively.`)
  }

  // console.log("typeof articleAsset.content=",typeof articleAsset.content)

  if(articleAsset.contentStructureType==="markdown"){
    let rawHTML
    let rawText = ""

    if(Array.isArray(articleAsset.content)){
      for(let i=0; i<articleAsset.content.length; i++){
        const file = articleAsset.content[i]
        const getObjectParams = {
          Bucket: AWS_BUCKET_NAME,
          Key: file.relativePath
        }
        const command = new GetObjectCommand(getObjectParams);
        let remoteUrl;
        try {
          // @ts-ignore
          remoteUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
          articleAsset.content[i].remoteUrl = remoteUrl
          if(file.mimeType==="text/markdown"){
            delete file.remoteUrl
  
            console.info(chalk.blueBright.bgBlack("[INF] HTTP Request to that S3 for retrieving the actual data of the main/entry markdown file"));
            console.log("remoteUrl=",remoteUrl)
            // Make the HTTP GET request to the remoteUrl
            const response = await axios.get(remoteUrl, { responseType: "text" });
            // console.log("response=",response)
            // console.log("response.data=",response.data)
            rawText = response.data
          }
          
        } catch (error) {
          console.error(error)
        }
        
      }
      marked.use({
        // breaks: false,
        renderer:{

          image: (tokenImg: Tokens.Image) => {
            console.info(chalk.blueBright.bgBlack("[INF] `marked.use` @image()"))
            console.log("before: tokenImg=",tokenImg)
  
            for(let i=0; i<articleAsset.content.length; i++){
               const file = articleAsset.content[i]
               const remoteUrl = file.remoteUrl
               delete file.remoteUrl
               if(file.mimeType==="image/png"){
                tokenImg.href = remoteUrl
                console.log("after: tokenImg=",tokenImg)
                return `<img src="${remoteUrl}" alt="${tokenImg.text}">`
              }
            }
  
            return false
          }
        }
      })
      rawHTML = marked(rawText);
      console.log("rawHTML=",rawHTML)
    }
    // ELSE IF: `articleAsset.content` typeof `string` --> it means the data is in there, the actual markdown data. So we still need to handle it, to convert it to HTML string
    else if(typeof articleAsset.content === "string"){
      console.info(chalk.blueBright.bgBlack("[INF] handle raw Markdown data"))
      rawHTML = marked(articleAsset.content);
    }

    return res.status(200).json({
      ...articleAsset,
      rawHTML, // Added extra property here
      rawText
    });
  }

  return res.status(200).json(articleAsset)
}
