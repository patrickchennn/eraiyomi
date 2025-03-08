"use client"

import "@/assets/globals.css"
import { getArticlesAnalytic } from "@/services/analytics/articleAnalyticService";
import { getArticles } from "@/services/article/articleService";
import articleTitleToUrlSafe from "@/utils/articleTitleToUrlSafe";
import { Article, ArticlesAnalytic } from "@shared/Article";
import chalk from "chalk";
import isEmpty from "lodash.isempty";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { BsEye } from "react-icons/bs";

export default function App(){
  console.log(chalk.blueBright.bgBlack("[INF] Rendering /"))
  
  const [isLoading, setLoading] = useState(true)
  const [articles, setarticles] = useState<Article[]|null>(null)
  const [articlesAnalytic, setArticlesAnalytic] = useState<ArticlesAnalytic|null>(null)

  
  useEffect(() => {
    getArticles({
      sort:"newest",status:"published"
    },"no-store")
      .then((resArticles) => {
        console.log("resArticles",resArticles)
        setarticles(resArticles.data)
        setLoading(false)
      })
    ;

    getArticlesAnalytic()
      .then((resArticlesAnalytic) => {
        console.log("resArticlesAnalytic",resArticlesAnalytic)
        setArticlesAnalytic(resArticlesAnalytic.data)
        setLoading(false)
      })
    ;

  }, [])

  if (isLoading) return <div className="loader">Loading...</div>
  if (!articles) return <p>No data</p>

  return (
    <div className='py-3 w-1/2 mx-auto flex flex-col gap-y-3 max-[576px]:w-3/4 max-[768px]:w-2/3'>

      <ShowArticles 
        articles={articles} 
        articlesAnalytic={articlesAnalytic}
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
    if(isEmpty(articlesAnalytic)){
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