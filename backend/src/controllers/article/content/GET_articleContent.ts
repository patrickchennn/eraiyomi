import { Request,Response } from "express"
import axios from "axios"
import chalk from "chalk"
import { marked } from "marked"
import isEmpty from "lodash.isempty"
import hljs from "highlight.js"
import { markedHighlight } from "marked-highlight"
import retResErrJson from "../../../utils/retResErrJson.js"
import getS3SignedUrl from "../../../utils/S3_getSignedUrl.js"
import { articleModel } from "../../../schema/articleSchema.js"
import { replaceMarkdownImageSyntax } from "../../../utils/markdown.js"

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
      // console.log(chalk.blueBright.bgBlack("[INF] `marked.use` @heading()"))
      // console.log("depth=",depth)
      // console.log("text=",text)

      // Remove <h1> tag because by default we will rely on database `article.title` for the article's title
      // Also we will add extra spacing `<br>` before the heading element

      if(depth===1) return ""
      return `<br/><h${depth}>${text}</h${depth}>`
    },
    // list: (token: Tokens.List) => {
    //   console.log(chalk.blueBright.bgBlack("[INF] `marked.use` @list()"))
    //   console.log("token=",token)
    //   const listType = token.ordered ? "ol" : "ul";
    //   const listStyle = token.ordered ? "list-decimal" : "list-disc";

    //   return `<${listType} class="pl-10 ${listStyle}">${token.raw}</${listType}>`;
      
    // },
    codespan: ({text}) => {
      // console.log(chalk.blueBright.bgBlack("[INF] `marked.use` @codespan"))

      // console.log("text=",text)
      return `<code class="rounded-sm px-1 bg-gray-800 shadow-inner text-green-400">${text}</code>`
    },
    // blockquote: (token: Tokens.Blockquote) => {
    //   console.log(chalk.blueBright.bgBlack("[INF] `marked.use` @blockquote()"))

    //   console.log(token)
    //   return `<blockquote>${token.text}</blockquote>`
    // }
  }
})




/**
 * @desc Get the article content data: text (markdown) and its images
 * @endpoint GET /api/article/{articleId}/content
 * @access public
 */
export const GET_articleContent = async (req: Request, res:Response) => {
  let {articleId} = req.params
  
  const article = await articleModel.findById(articleId).lean()
  
  if(article===null){
    return retResErrJson(res,404,"Article not found")
  }

  let rawHtml, rawText = "";

  // 1. Fetching the markdown
  if(!isEmpty(article.content)){
    try {
      const remoteUrl = await getS3SignedUrl(`${article.title}/${article.content.relativePath}`)

      if(remoteUrl.isError){
        return retResErrJson(res,404,"Article not found")
      }
  
      // Make the HTTP GET request to the remoteUrl
      const response = await axios.get(remoteUrl.url!, { responseType: "text" });
      // console.log("response=",response)
      // console.log("response.data=",response.data)

      
      rawText= response.data

    } catch (err) {
      // If error response is available (non-2xx), it will be caught here
      if (axios.isAxiosError(err) && err.response) {
        console.error(err.message)
      }
    }
  }

  // 2. Fetching the image-content assets
  const imgContentAttributes = []
  if(!isEmpty(article.imageContent)){
    // Fetch all content image from S3, just the URL
    for(let i=0; i<article.imageContent.length; i++){
      const img = article.imageContent[i];

      const remoteUrl = await getS3SignedUrl(`${article.title}/${img.relativePath}`)

      imgContentAttributes.push({
        ...article.imageContent[i],
        s3Url:remoteUrl.url,
      })

      rawText = replaceMarkdownImageSyntax(
        rawText, 
        img.relativePath, 
        remoteUrl.url as string
      )
    }
  }
  console.log(chalk.blueBright.bgBlack("After fetching all the image content `imageContentRemoteUrl`:"), imgContentAttributes)

  rawHtml = marked(rawText);
  // console.log("rawHtml=",rawHtml)

  return res.status(200).json({
    data:{
      rawHtml,
      rawText,
      images: imgContentAttributes,
    }
  });
}