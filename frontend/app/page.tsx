"use server"

import "@/assets/globals.css"
import { getArticlesAnalytic } from "@/services/analytics/articleAnalyticService";
import { getArticles } from "@/services/article/articleService";
import articleTitleToUrlSafe from "@/utils/articleTitleToUrlSafe";
import { Article, ArticlesAnalytic } from "@shared/Article";
import chalk from "chalk";
import Link from "next/link";
import { BiLike } from "react-icons/bi";
import { BsEye } from "react-icons/bs";

export default async function App(){
  console.log(chalk.blueBright.bgBlack("[INF] Rendering /"))

  const articles = await getArticles({
    sort:"newest",status:"published"
  },"no-store")
  // console.log("articles=",articles)
  
  if(articles.data===null){
    return (
      <pre>{JSON.stringify(articles, null, 4)}</pre>
    )
  }

  const articlesAnalyticData = await getArticlesAnalytic()
  console.log("articlesAnalyticData=",articlesAnalyticData)



  // IF fetch is succeed AND the (dynamically) imported blog page components is done
    // console.log(articlesState,components)
  return (
    <div className='py-3 w-1/2 mx-auto flex flex-col gap-y-3 max-[576px]:w-3/4 max-[768px]:w-2/3'>

      <ShowArticles 
        articles={articles.data} 
        articlesAnalytic={articlesAnalyticData.data}
      />
    </div>
  )
}

interface ShowArticlesProps {
  articles: Article[]
  articlesAnalytic: ArticlesAnalytic|null
}
const ShowArticles = ({articles, articlesAnalytic}: ShowArticlesProps) => {

  // Sub-component
  interface ShowArticleAnalyticsProps{
    articleId: string
  }
  const ShowArticleAnalytics = ({articleId}: ShowArticleAnalyticsProps) => {
    if(articlesAnalytic===null){
      return '-'
    }

    if(!Object.hasOwn(articlesAnalytic,articleId)){
      return '-'
    }

    return articlesAnalytic[articleId].screenPageViews
  }

  return articles.map(article => {
      let URLpathMod = articleTitleToUrlSafe(article.title)
      // console.log("URLpathMod=",URLpathMod)
      
      // TODO: convert this logic into server component
      if(article.status==="unpublished") return <></>
      return (
        // TODO: this `rounded-xl` not working
        <div key={article._id} className='p-3 rounded-xl'>
          <div className='flex justify-between'>
            <Link 
              href={{
                pathname:"post/"+URLpathMod,
                query: { id: article._id },
              }} 
              target="_blank" 
              className="text-2xl font-bold after:content-[''] after:block after:w-0 after:h-0.5 after:bg-black after:transition-[width] after:duration-500 after:ease-in after:hover:w-full after:dark:bg-white"
            >
              {article.title}
            </Link>
            <div className='text-center flex gap-x-2'>
              <dfn className='text-gray-400'>
                {article.publishedDate}
              </dfn>
              <div>
                <BsEye className='mx-auto'/>
                {/* get the view counter from google analytics. */}
                <ShowArticleAnalytics articleId={article._id}/>
              </div>
              <div>
                <BiLike className='mx-auto'/>
                {article.likeDislike.totalLike}
              </div>
            </div>
          </div>
          <div>
            {
              article.category.map((keyword: string,idx: number) => {
                return (
                  <span key={idx} className="px-2">
                    <span>#</span>{keyword}
                  </span>
                )
              })
            }
          </div>
          <p className='p-3 text-gray-600 dark:text-gray-300'>
            {article.shortDescription}
          </p>
        </div>
      )
    }
  )
}