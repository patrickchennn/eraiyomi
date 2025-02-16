"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {AiOutlineEdit} from "react-icons/ai"
import Link from "next/link"
import chalk from "chalk"
import { useUserInfo } from "@/hooks/appContext"
import { ImSearch } from "react-icons/im"
import { IoTrashOutline, IoTrashSharp } from "react-icons/io5"
import getCookie from "@/utils/getCookie"
import { deleteArticle, getArticles } from "@/services/article/articleService"

import { Article, ArticlesAnalytic } from "@shared/Article"
import { User } from "@shared/User"
import { getArticlesAnalytic } from "@/services/analytics/articleAnalyticService"
import articleTitleToUrlSafe from "@/utils/articleTitleToUrlSafe"


export default function ArticleOverview(){
  console.log(chalk.blueBright.bgBlack("@ArticleOverview"))

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [userInfo] = useUserInfo()

  const [articles, setArticles] = useState<Article[] | null>(null)
  const [articlesAnalytic,setArticlesAnalytic] = useState<ArticlesAnalytic | null>(null)


  useEffect(() => {
    getArticles({sort:"newest"})
      .then(resData => {
        if(resData.data!==null) setArticles(resData.data)
      })
    ;

    getArticlesAnalytic()
      .then(resData => {
        if(resData.data!==null) setArticlesAnalytic(resData.data)
      })
    ;

  }, [])

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Methdos~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const handleGetPublished = async () => {
    const publishedArticles = await getArticles({status:"published",sort:"newest"},"force-cache")
    setArticles(publishedArticles.data)
  }

  const handleGetUnpublished = async () => {
    const unpublishedArticles = await getArticles({status:"unpublished",sort:"newest"},"force-cache")
    setArticles(unpublishedArticles.data)
  }

  const handleGetAll = async () => {
    const articles = await getArticles({sort:"newest"},"force-cache")
    setArticles(articles.data)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement
    // console.dir(target)

    const searchInputVal = (target[0] as HTMLInputElement).value
    
    console.log("searchInputVal=",searchInputVal)
    const articles = await getArticles({sort:"newest",search:searchInputVal},"force-cache")

    setArticles(articles.data)
  }


  // render
  return (
    <div className="w-full" id="my-post">
      <h1>My Post</h1>
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
        {
          articles &&
          <ShowArticles 
            articlesState={[articles,setArticles]}
            articlesAnalytic={articlesAnalytic}
            userInfo={userInfo!}
          />
        }
      </div>
    </div>
  )
}


interface ShowArticlesProps {
  articlesState: [Article[], Dispatch<SetStateAction<Article[]|null>>]
  articlesAnalytic: ArticlesAnalytic|null
  userInfo: User
}
const ShowArticles = ({
  articlesState,
  articlesAnalytic,
  userInfo
}: ShowArticlesProps) => {


  // Hooks
  const [articles,setArticles] = articlesState
  const handleDelArticle = async (articleId: string) => {
    const JWT = getCookie("userCredToken")

    if(!JWT) return alert("JWT is empty")

    // Confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this article?");
    if (!isConfirmed) return;

    const res = await deleteArticle(JWT, articleId)
    if(res.status!=="204 No Content"){
      return alert(res.message)
    }

    const tempFilteredArticles = articles?.filter(article=>article._id!==articleId)

    setArticles(tempFilteredArticles)
  }

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

  if(articles===null){
    return (
      <div className="loader"></div>
    )
  }

  return articles.map(article => {
    let bgColor=""
    if(article.status==="published") bgColor = "bg-green-50"
    else if(article.status==="unpublished") bgColor = "bg-red-50"

    let URLpathMod = articleTitleToUrlSafe(article.title)
    // console.log("URLpathMod=",URLpathMod)

    return (
      <div key={article._id} className={bgColor+" border rounded-md p-3 shadow-inner dark:text-black"}>
        <div>
        </div>
        <div>

          <div className="flex justify-between">
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
            
            <div>
              <Link
                data-cy="edit-article"
                href={{
                  pathname:userInfo.username+"/edit/post/"+URLpathMod,
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
              View: <ShowArticleAnalytics articleId={article._id}/>
            </li>
            <li>
              Total Comments: -
            </li>
          </ul>
        </div>
      </div>
    )
  })
}