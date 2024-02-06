import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import HeaderSection from "@/components/blog/HeaderSection";
import LikeDislikeArticle from "@/components/blog/LikeDislikeArticle";
import OtherPosts from "@/components/blog/OtherPosts";
import { TableOfContents } from "@/components/blog/TableOfContents";

import convertDate from "@/utils/convertDate";

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css';
import chalk from "chalk";
import { Metadata, ResolvingMetadata } from "next";
import CreateTitle from "@/components/blog/CreateTitle";
import { GET_articleAsset } from "@/services/article-asset/GET_articleAsset";
import { getArticle } from "@/services/article/getArticle";
import DisqusEmbed from "@/components/blog/DisqusEmbed";


 



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
  console.log(chalk.blue(`app/post/${params.titleArticle}/page.tsx Page()`))


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

  let imgIdxs: number[] =[]
  const articleAsset = articleAssetRes.data
  const article = articleRes.data
  


  for(let i=0; i<articleAsset.content.length; i++){
    const data = articleAsset.content[i]
    // @ts-ignore
    if(Object.hasOwn(data.insert,"image")){
      imgIdxs.push(i)
    }
  }

  // documentation: https://github.com/nozer/quill-delta-to-html#readme
  const converter = new QuillDeltaToHtmlConverter(
    articleAsset.content,
    // TODO: make the code block highlighted
    // {
    //   customTag(format, op) {
    //     // console.log(format)
    //     // console.log(op)
    //     if(op.isCodeBlock()){
    //       // console.log("op.isCodeBlock()")
    //     }
    //   },
    //   customTagAttributes(op) {
    //     if(op.isCodeBlock()){
    //       console.log("op.isCodeBlock()")
    //       return {class:"language-javascript"}
    //     }
    //   },
    // }
  );

  // @ts-ignore
  converter.beforeRender((groupType, data)=>{
    // console.log("groupType=",groupType)
    // console.log("data=\t",data.ops)
    // console.log()
    if(groupType==="inline-group"){
      // @ts-ignore
      for(const op of data.ops){
        
        /* fail implementation of feature
          the main problem: https://github.com/nozer/quill-delta-to-html/issues/95
          
          This shit is supposed to help me constructing an `img` tag that is looks like: <img src="" alt="" data-[attribute]/>. You see there are several attributes on that img tag, and I want those attributes to, of course, enrich the `img` information. Current solution I can only use, `op.insert.value = src`, to set the `src` attribute which you can see in here

          the first solution approach(1st) is to use the `beforeRender` method. It worked but only for the `src` attribute
          
          another approach(2nd) is to use the `customTagAttributes` method on the second argument of `QuillDeltaToHtmlConverter` class. But, in short, it's not fking working because whenever I set/return the attribute, the same fking data is again being loop which cause some unnecessary cycle
          
          3rd approach is using the `urlSanitizer`, not working

          so, in short, i can only set the `src` attribute, I can't add like `alt`, let alone the `data-` attribute
        */
        if(op.insert.type==="image"){
          // console.log("found an image")
          // console.log(op)

          const src = articleAsset.content[imgIdxs[0]].insert.image.src
          // const dataFilename = articleAsset.content.quill[imgIdxs[0]].insert.image["data-filename"]
          // console.log("idx=",imgIdxs[0])
          // console.log("dataFilename=",dataFilename)
          // console.log("src=",src.slice(0,30))
          // pop the first element for preparing the next img
          imgIdxs.shift()
          op.insert.value = src
          // op.attributes = {
          //   "data-file-name":dataFilename
          // }
        }

      }
    }
  });
  
  
  const content = converter.convert(); 
  // console.log("content=",content)



  return (
    <>
      <div className="px-16 py-5 relative max-[576px]:px-1">
        {/* other posts/content, server component */}
        {/* <OtherPosts 
          style="p-5 border border-zinc-300 rounded-xl h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800 max-[1024px]:hidden" 
          currArticleId={article._id}
        /> */}

        {/* main content (write here) and header (thumbnail)*/}
        <div className="border border-zinc-300 dark:border-[midnightblue] rounded-xl post-glass dark:bg-[rgba(0,0,0,0.6)]">

          {/* header (thumbnail), supposed to be server component */}
          <HeaderSection pict={articleAsset.thumbnail.dataURL} caption=""/>

          <CreateTitle 
            titlePage={article.titleArticle.title}
            miscInfo={{
              date:convertDate(article.publishedDate),
              category:article.category,
              author:article.author,
              wordCount:0,
              readingTime:"_"
            }}
          />

          <main
            id="main-content"
            className="px-16 py-8 transition-all duration-250 ease-[linear] max-[1024px]:px-14 max-[576px]:px-8"
            dangerouslySetInnerHTML={{__html:content}}
          ></main>

          {/* like or dislike the article, client component */}
          <LikeDislikeArticle articleInit={article}/>
        </div>

        {/* table of content (>1024px), client component*/}
        {/* <TableOfContents /> */}

        {/* Disqus library, client component */}
        <DisqusEmbed articleId={article._id}/>
      </div>
    </>
  )
}

// function Commentary(){
//   /**
//   *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
//   *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
//   /*
//   */
//   var disqus_config = function () {
//     this.page.url = metadata.title;  // Replace PAGE_URL with your page's canonical URL variable
//     // this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
//   };

//   (function() { // DON'T EDIT BELOW THIS LINE
//     var d = document;
//     const s = d.createElement('script');
//     s.src = 'https://eraiyomi.disqus.com/embed.js';
//     s.setAttribute('data-timestamp', +new Date());
//     (d.head || d.body).appendChild(s);
//   })();
//   return (
//     <div id="disqus_thread"></div>

//   )
// }