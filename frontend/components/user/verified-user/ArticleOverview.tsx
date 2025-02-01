"use client"

import { Article, ArticlesAnalytic } from "@patorikkuuu/eraiyomi-types"
import { useState } from "react"
import {AiOutlineEdit,AiTwotoneEdit} from "react-icons/ai"
import Link from "next/link"
import { ArticleAsset } from "@patorikkuuu/eraiyomi-types"
import { useUserInfo } from "@/hooks/appContext"
import Image from "next/image"
import isEmpty from "lodash.isempty"
import { IoTrashOutline, IoTrashSharp } from "react-icons/io5"
import getCookie from "@/utils/getCookie"
import { ImSearch } from "react-icons/im"
import { deleteArticle } from "@/services/article/deleteArticle"
import getArticles from "@/services/article/getArticles"
import chalk from "chalk"

interface ArticleOverviewProps{
  initArticles:Article[]|undefined
  initArticlesAnalytic: ArticlesAnalytic|null
  initArticlesAsset: ArticleAsset[]|undefined
}
export default function ArticleOverview({
  initArticles,initArticlesAnalytic,initArticlesAsset
}: ArticleOverviewProps){
  console.log(chalk.blueBright.bgBlack("@ArticleOverview"))
  // hooks
  const [userInfo] = useUserInfo()

  const [showArticles, setShowArticles] = useState<Article[]|undefined>(initArticles)
  const [articlesAnalytic,setArticlesAnalytic] = useState(initArticlesAnalytic)
  const [articlesAsset,setArticlesAsset] = useState<ArticleAsset[]|undefined>(initArticlesAsset)





  // methods
  const handleGetPublished = async () => {
    const publishedArticles = await getArticles({status:"published",sort:"newest"},"force-cache")
    setShowArticles(publishedArticles.data)
  }

  const handleGetUnpublished = async () => {
    const unpublishedArticles = await getArticles({status:"unpublished",sort:"newest"},"force-cache")
    setShowArticles(unpublishedArticles.data)
  }

  const handleGetAll = async () => {
    const articles = await getArticles({sort:"newest"},"force-cache")
    setShowArticles(articles.data)
  }

  const handleDelArticle = async (articleId: string) => {
    const token = getCookie("userCredToken")
    if(token)
      await deleteArticle(articleId,token)
    ;

    const tempFilteredArticles = showArticles?.filter(article=>article._id!==articleId)

    setShowArticles(tempFilteredArticles)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement
    // console.dir(target)

    const searchInputVal = (target[0] as HTMLInputElement).value
    
    console.log("searchInputVal=",searchInputVal)
    const articles = await getArticles({sort:"newest",search:searchInputVal},"force-cache")
    setShowArticles(articles.data)
  }


  // render
  return (
    <div className="w-full" id="my-post">
      <h1>
        My Post
      </h1>
      <hr />
      <form className='border border-stone-100 rounded-md flex dark:border-stone-700' onSubmit={handleSearch}>
        <input data-cy="search-articles" type="text" className="px-3 rounded-l-md w-full h-9 dark:bg-zinc-900"/>
        <button className='px-2 rounded-r-md flex bg-slate-100 shadow-inner dark:bg-zinc-900'>
          <ImSearch className='self-center'/>
        </button>
      </form>
      <div className="mt-4 mb-2">
        <button onClick={handleGetAll} className="p-1 rounded-full bg-slate-300 hover:bg-slate-800 shadow-md font-semibold hover:text-white text-sm active:text-[13.5px]">all</button>
        <button onClick={handleGetPublished} className="p-1 rounded-full bg-slate-300 hover:bg-slate-800 shadow-md font-semibold hover:text-white text-sm active:text-[13.5px]">published</button>
        <button onClick={handleGetUnpublished} className="p-1 rounded-full bg-slate-300 hover:bg-slate-800 shadow-md font-semibold hover:text-white text-sm active:text-[13.5px]">unpublished</button>
      </div>
      <div data-cy="articles-container-profile">
        {showArticles&&showArticles.map(article => {
          let bgColor=""
          if(article.status==="published") bgColor = "bg-green-50"
          else if(article.status==="unpublished") bgColor = "bg-red-50"
          const articleAsset = articlesAsset?.find(articleAsset => articleAsset.articleIdRef===article._id)

          return (
            <div key={article._id} className={bgColor+" border rounded-md p-3 shadow-inner dark:text-black"}>
              <div>
                {
                  articleAsset&&!isEmpty(articleAsset.thumbnail)?
                  <></>
                  // <Image 
                  //   width={0}
                  //   height={0}
                  //   unoptimized
                  //   src={articleAsset.thumbnail.src} 
                  //   alt="article thumbnail" 
                  // />
                  :
                  <></>
                }
              </div>
              <div>

                <div className="flex justify-between">
                  <Link 
                    href={{
                      pathname:"post/"+article.titleArticle.URLpath,
                      query: { id: article._id },
                    }} 
                    target="_blank" 
                    className="text-2xl font-bold after:content-[''] after:block after:w-0 after:h-0.5 after:bg-black after:transition-[width] after:duration-500 after:ease-in after:hover:w-full after:dark:bg-white"
                  >
                    {article.titleArticle.title}
                  </Link>
                  
                  <div>
                    <Link
                      data-cy="edit-article"
                      href={{
                        pathname:userInfo.username+"/edit/post/"+article.titleArticle.URLpath,
                        query: { id: article._id },
                      }} 
                      target="_blank" 
                      className="text-xs font-light align-top"
                    >
                      <span>Edit </span><AiOutlineEdit className="inline"/>
                    </Link>

                    <button data-cy="delete-article" onClick={()=>handleDelArticle(article._id)}>
                      <IoTrashOutline className="inline peer hover:hidden"/>
                      <IoTrashSharp className="text-red-500 hidden peer-hover:inline"/>
                    </button>
                  </div>
                </div>
                
                <div className="indent-4 text-gray-500">
                  {article.shortDescription}
                </div>
                <ul>
                  <li>
                    Status: {article.status}
                  </li>
                  <li>
                    Tags: {article.category.map(category => category)}
                  </li>
                  <li>
                    Like: {article.likeDislike.totalLike}
                  </li>
                  <li>
                    Dislike: {article.likeDislike.totalDislike}
                  </li>
                  <li>
                    View: {
                      articlesAnalytic &&
                      Object.hasOwn(articlesAnalytic,article.titleArticle.title) ? articlesAnalytic[article.titleArticle.title].screenPageViews : '-'
                    }
                  </li>
                  <li>
                    Total Comments: -
                  </li>
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}