import { BlockGroup, InlineGroup, QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import HeaderSection from "@/components/blog/HeaderSection";
import convertDate from "@/utils/convertDate";

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css';

import chalk from "chalk";
import { Metadata, ResolvingMetadata } from "next";
import CreateTitle from "@/components/blog/CreateTitle";
import { GET_articleAsset } from "@/services/article-asset/GET_articleAsset";
import { getArticle } from "@/services/article/getArticle";
import getReadEstimation from "@/utils/getReadEstimation";
import dynamic from "next/dynamic";
import {MarkdownRenderer,markdownRenderStr} from "@/utils/MarkdownRenderer";

// solve the problem `ReferenceError: window is not defined on client component`
const DynamicDisqusEmbed = dynamic(
  () => import('@/components/blog/DisqusEmbed'),
  { 
    ssr: false ,
    loading:()=><div className='loader'></div>
  }
)
 



interface PageProps{
  params: { 
    titleArticle: string
  }
  searchParams: { id: string };
}
// Dynamic metadata
export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Step 1: Remove '-' and split the string into an array of words
  let titleArray = params.titleArticle.split('-');

  // Step 2: Capitalize each word
  let capitalizedTitleArray = titleArray.map(word => word.charAt(0).toUpperCase() + word.slice(1));

  // Step 3: Join the words back into a single string
  let modTitle = capitalizedTitleArray.join(' ');

  return {
    title: modTitle,
  }
}



export default async function Page({ 
  params,
  searchParams 
}: PageProps) {
  console.log(chalk.yellow(`@app/post/${params.titleArticle}/page.tsx Page()`))


  if(!searchParams.id){
    return (
      <>
        <h1>404 Not Found</h1>
        <p>article not found</p>
      </>
    )
  }
  const articleRes = await getArticle(searchParams.id,params.titleArticle)
  // console.log("articleRes=",articleRes)

  if(!articleRes.data){
    return (
      <>
        <h1>{articleRes.status}</h1>
        <p>{articleRes.errMsg}</p>
      </>
    )
  }

  const articleAssetRes = await GET_articleAsset(searchParams.id)
  // console.log("articleAssetRes=",articleAssetRes)

  if(!articleAssetRes.data){
    return (
      <>
        <h1>{articleAssetRes.status}</h1>
        <p>{articleAssetRes.errMsg}</p>
      </>
    )
  }

  const articleAsset = articleAssetRes.data
  const article = articleRes.data
  
  let MainContent = <></>
  if(articleAsset.contentStructureType==="markdown"){
    if(typeof articleAsset.content !== "string"){
      return alert("error: typeof articleAsset.content !== 'string'")
    }
    MainContent = <MarkdownRenderer markdownText={articleAsset.content}/>
  }else if(articleAsset.contentStructureType===undefined||articleAsset.contentStructureType==="quilljs"){
    
    if(!Array.isArray(articleAsset.content)){
      return alert("error: `articleAsset.content` is not an array")
    }

    const content = handleQuilljs(articleAsset.content)
    // Assuming content is sanitized and safe to use
    MainContent = <div dangerouslySetInnerHTML={{ __html: content }} />;

  }



  return (
    <>
      <div className="px-16 py-5 relative max-[576px]:px-1">
        {/* other posts/content, server component */}
        {/* <OtherPosts 
          style="p-5 border border-zinc-300 rounded-xl h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800 max-[1024px]:hidden" 
          currArticleId={article._id}
        /> */}

        {/* main content (write here) and header (thumbnail)*/}
        <div className="border border-zinc-300 dark:border-[rgb(21,7,53)] rounded-xl post-glass dark:bg-[rgba(0,0,0,0.6)]">

          {/* header (thumbnail), supposed to be server component */}
          <HeaderSection pict={articleAsset.thumbnail.dataURL} caption=""/>

          <CreateTitle 
            titlePage={article.titleArticle.title}
            miscInfo={{
              date:convertDate(article.publishedDate),
              category:article.category,
              author:article.author,
              wordCount:articleAsset.totalWordCounts,
              readingTime:getReadEstimation(articleAsset.totalWordCounts)
            }}
          />

          <main
            id="main-content"
            className="px-16 py-8 transition-all duration-250 ease-[linear] max-[1024px]:px-14 max-[576px]:px-8"
          >{MainContent}</main>

          {/* like or dislike the article, client component */}
          {/* <LikeDislikeArticle articleInit={article}/> */}
        </div>

        {/* table of content (>1024px), client component*/}
        {/* <TableOfContents /> */}

        {/* Disqus library, client component */}
        <DynamicDisqusEmbed articleId={article._id}/>
      </div>
    </>
  )
}

function handleQuilljs(content: []){
  let imgIdxs: number[] =[]
  // FOR: search all imgs and keep the index
  for(let i=0; i<content.length; i++){
    const data = content[i] as {[key: string]: any}
    if(Object.hasOwn(data.insert,"image")){
      imgIdxs.push(i)
    }
  }

  // documentation: https://github.com/nozer/quill-delta-to-html#readme
  const converter = new QuillDeltaToHtmlConverter(content);

  // this function is supposed to return a `string` type. But I had no idea what to return, I did not understand the doc
  // currently, it returns void, obviously, an error type. So to simplify task, I just add `@ts-ignore`
  // @ts-ignore
  converter.beforeRender((groupType, data)=>{
    if(groupType==="inline-group"){
      // console.log(chalk.magenta.bgBlack("IF: groupType===inline-group"))
      const inlineData = data as InlineGroup
      // console.log("inlineData=",inlineData)

      for(const op of inlineData.ops){
        
        /* fail implementation of feature
          the main problem: "img src attribute is set to [object Object] #95": https://github.com/nozer/quill-delta-to-html/issues/95
          
          This supposed to help me constructing an `img` tag that is looks like: <img src="" alt="" data-[attribute]/>. You see there are several attributes on that img tag, and I want those attributes to, of course, enrich the `img` information. Current solution I can only use, `op.insert.value = src`, to set the `src` attribute which you can see in here

          the first solution approach(1st) is to use the `beforeRender` method. It worked but only for the `src` attribute
          
          another approach(2nd) is to use the `customTagAttributes` method on the second argument of `QuillDeltaToHtmlConverter` class. But, in short, it's not working because whenever I set/return the attribute, the same data is again being loop which cause some unnecessary cycle
          
          3rd approach is using the `urlSanitizer`, not working

          so, in short, i can only set the `src` attribute, I can't add like attribute `alt`, let alone the `data-` attribute
        */
        if(op.insert.type==="image"){
          // console.log(chalk.magenta.bgBlack("found an image"))
          // console.log("op=",op)
          // console.log("op.insert=",op.insert)
          // console.log("op.insert.value=",op.insert.value)

          // console.log("idx=",imgIdxs[0])

          const imgObj = content[imgIdxs[0]] as {[key: string]: any}
          // console.log("imgObj=",imgObj)

          const src = imgObj.insert.image.src

          // const dataPublicId = imgObj.insert.image["data-public_id"]

          
          // pop the first element for preparing the next img
          imgIdxs.shift()

          // set img src
          // original error: Cannot assign to 'value' because it is a read-only property.ts(2540)
          // @ts-ignore
          op.insert.value = src

          // set additional attributes for the img
          // op.attributes = {
          //   "data-file-name":dataPublicId
          // }
        }
      }
    }else if(groupType==="block"){
      // console.log(chalk.magenta.bgBlack("IF: groupType===block"))
      // `blockData` points to `data`. This existed for sake of typecasting. Initially I can use the `as` typescript typecast utility but it took many variable to typecast for each
      const blockData = data as BlockGroup

      // console.log("data=",data)
      // console.log("data.op=",data.op)
      
      // make the code block highlighted
      if(blockData.op.isCodeBlock()){
        // console.log(chalk.magenta.bgBlack("IF: op.isCodeBlock()"))
        // console.log("data=",data)
        // console.log("data.op=",data.op)
        // console.log("data.ops=",data.ops)

        let codeContent = blockData.ops.map(op => op.insert.value).join('');
        // console.log("codeContent=",codeContent)

        // const highlightedCode = hljs.highlight(codeContent, { language: 'python' })
        // console.log("highlightedCode=",highlightedCode)

        const autoHighlightCode = hljs.highlightAuto(codeContent)
        // console.log("autoHighlightCode=",autoHighlightCode)
        return `<pre><code class="hljs">${autoHighlightCode.value}</code></pre>`;

      }
    }
  });
  return converter.convert(); 
}