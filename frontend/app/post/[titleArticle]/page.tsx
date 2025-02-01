
import HeaderSection from "@/components/blog/HeaderSection";
import convertDate from "@/utils/convertDate";

import 'highlight.js/styles/atom-one-dark.css';

import chalk from "chalk";
import { Metadata, ResolvingMetadata } from "next";
import CreateTitle from "@/components/blog/CreateTitle";
import { GET_articleAsset } from "@/services/article-asset/GET_articleAsset";
import { getArticle } from "@/services/article/getArticle";
import getReadEstimation from "@/utils/getReadEstimation";
import dynamic from "next/dynamic";

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
  console.log(chalk.blueBright.bgBlack(`[INF] Rendering /post/${params.titleArticle} page`))


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
      <pre>{JSON.stringify(articleAssetRes, null, 4)}</pre>
    )
  }

  const articleAsset = articleAssetRes.data
  // console.log("articleAsset.contentStructureType=",articleAsset.contentStructureType)
  // console.log("articleAsset.content=",articleAsset.content)

  const article = articleRes.data
  
  let MainContent = <></>
  if(articleAsset.contentStructureType==="markdown"){
    if("rawHTML" in articleAsset){
      console.info(chalk.blueBright.bgBlack("[INF] handle Markdown data that is already converted to HTML strings"))
      // assuming `rawHTML` is safes
      // @ts-ignore
      MainContent = <div dangerouslySetInnerHTML={{__html: articleAsset.rawHTML}} />
    }
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
          {/* <HeaderSection pict={articleAsset.thumbnail.dataURL} caption=""/> */}

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
