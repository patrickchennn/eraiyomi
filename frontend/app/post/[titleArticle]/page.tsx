"use server"

import chalk from "chalk";
import 'highlight.js/styles/atom-one-dark.css';
import { Metadata, ResolvingMetadata } from "next";

import convertDate from "@/utils/convertDate";
import getReadEstimation from "@/utils/getReadEstimation";

import HeaderSection from "@/components/blog/HeaderSection";
import CreateTitle from "@/components/blog/CreateTitle";
import { getArticleContent } from "@/services/article/articleContentService";
import { getArticle } from "@/services/article/articleService";
import { getUser } from "@/services/user/userService";
import { getArticleThumbnail } from "@/services/article/articleThumbnailService";
import GoogleAnalytics from "@/components/GoogleAnalytics";


interface PageProps{
  params: { 
    titleArticle: string
  }
  searchParams: { id: string };
}
/**
 * https://nextjs.org/docs/13/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ensure id is present
  if (!searchParams.id) {
    return { title: "Article Not Found" };
  }

  const articleRes = await getArticle(searchParams.id,"no-store")
  // console.log("articleRes=",articleRes)

  if(!articleRes.data){
    return (
      {title:"Article Not Found"}
    )
  }

  const article = articleRes.data
  // console.log("article=",article)
  // console.log("process.env.NEXT_PUBLIC_SITE_URL=",process.env.NEXT_PUBLIC_SITE_URL)

  const metadata: Metadata = {
    title: article.title,
    description: article.shortDescription,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8005"),
  };

  const thumbnailRes = await getArticleThumbnail(article._id,"no-store")

  if(thumbnailRes.data!==null) {
    metadata.openGraph = {
      title:article.title,
      description: article.shortDescription,
      images:[
        {
          url: thumbnailRes.data
        }
      ]
    }
  }
  return metadata
}



export default async function Page({ params, searchParams }: PageProps) {
  console.log(chalk.blueBright.bgBlack(`[INF] Rendering /post/${params.titleArticle}?id=${searchParams.id}`))


  // IF the user intentionally remove the query id
  if(!searchParams.id){
    return (
      <h1>404 Not Found</h1>
    )
  }
  const articleRes = await getArticle(searchParams.id,"no-store")
  // console.log("articleRes=",articleRes)

  if(!articleRes.data){
    return (
      <pre>{JSON.stringify(articleRes, null, 4)}</pre>
    )
  }

  const article = articleRes.data
  // console.log("article=",article)

  const articleContentRes = await getArticleContent(searchParams.id,"no-store")

  if(!articleContentRes.data){
    return (
      <pre>{JSON.stringify(articleRes, null, 4)}</pre>
    )
  }

  const articleContent = articleContentRes.data
  // console.log("articleContent=",articleContent)

  const userRes = await getUser({id: article.userIdRef})
  // console.log("userRes=",userRes)

  const user = userRes.data!

  const thumbnailRes = await getArticleThumbnail(article._id,"no-store")

  


  // ~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <>
      <GoogleAnalytics />
      <div className="px-16 py-5 relative max-[576px]:px-1">
        {/* other posts/content, server component */}
        {/* <OtherPosts 
          style="p-5 border border-zinc-300 rounded-xl h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800 max-[1024px]:hidden" 
          currArticleId={article._id}
        /> */}

        {/* main content (write here) and header (thumbnail)*/}
        <div className="border border-zinc-300 dark:border-[rgb(21,7,53)] rounded-xl post-glass dark:bg-[rgba(0,0,0,0.6)]">

          {/* Thumbnail image: server component */}
          <HeaderSection thumbnailSrc={thumbnailRes.data? thumbnailRes.data : null}/>

          <CreateTitle 
            titlePage={article.title}
            miscInfo={{
              date:convertDate(article.publishedDate),
              category:article.category,
              author:user.name,
              wordCount:article.totalWordCounts,
              readingTime:getReadEstimation(article.totalWordCounts)
            }}
          />

          <main
            id="main-content"
            className="px-16 py-8 transition-all duration-250 ease-[linear] max-[1024px]:px-14 max-[576px]:px-8 article-content-style"
            // NOTE: security issuse, this might result XSS
            dangerouslySetInnerHTML={{__html: articleContent.rawHtml}}
            // dangerouslySetInnerHTML={{__html: ""}}
          ></main>

          {/* like or dislike the article, client component */}
          {/* <LikeDislikeArticle articleInit={article}/> */}
        </div>

        {/* table of content (>1024px), client component*/}
        {/* <TableOfContents /> */}

        {/* Disqus library, client component */}
        {/* <DynamicDisqusEmbed articleId={article._id}/> */}
      </div>
    </>
  )
}