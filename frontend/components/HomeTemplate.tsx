"use client"

// react
import { useRef, useState } from 'react'

// icons
import {BsEye} from "react-icons/bs"
import {BiLike} from "react-icons/bi"
import {HiOutlineArrowDown,HiOutlineArrowUp} from  "react-icons/hi"

import { v4 as uuidv4 } from 'uuid';
import Link from "next/link";

// my custom types
import { Article, ArticlesAnalytic } from '@patorikkuuu/eraiyomi-types'
import getArticles from '@/services/article/getArticles'

interface HomeTemplateProps{
  initArticles: Article[]
  articlesAnalytic:ArticlesAnalytic|undefined
}
export default function HomeTemplate ({
  initArticles,articlesAnalytic
}: HomeTemplateProps){
  console.log("@HomeTemplate")
  // hooks

  const [showArrow,setShowArrow] = useState(true) 
  const ulRef = useRef<HTMLUListElement>(null)
  // first idx is for sort by latest date, second idx is sort for earliest date
  interface ArticlesSorted{
    "newest":Article[],
    "oldest":Article[],
    "popular":Article[],
    "unpopular":Article[]
  }
  const [articlesSorted,setArticlesSorted] = useState<ArticlesSorted>({
    "newest":initArticles,
    "oldest":[],
    "popular":[],
    "unpopular":[]
  })
  const sortByTitleRef = useRef(null)

  // methods
  const handleSortMenuClick = () => {
    ulRef.current!.classList.toggle("!visible")
    setShowArrow(prev=>!prev)
  }

  const sortBy = async (type: "newest" | "oldest" | "popular" | "unpopular") => {
    console.log("type=",type) 

    if(!articlesSorted[type].length){
      const data = await getArticles({sort:type})
      setArticlesSorted( prev => ({
          ...prev,
          [type as string]:data
        })
      )
    }
  }



  const showArticles = (sortBy="newest") => {
    const whichOne: Article[] = articlesSorted[sortBy as keyof ArticlesSorted]
    // console.log(articlesSorted)

    return whichOne.map(article => {
        const pagePath = `/post/${article.titleArticle.URLpath}`
        // TODO: convert this logic into server component
        if(article.status==="unpublished") return <></>
        return (
          <div key={uuidv4()}>
            <div className='p-3 '>
              <div className='flex justify-between'>
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
                <div className='text-center flex gap-x-2'>
                  <dfn className='text-gray-400'>
                    {article.publishedDate}
                  </dfn>
                  <div>
                    <BsEye className='mx-auto'/>
                    {/* get the view counter from google analytics. */}
                    {
                      articlesAnalytic &&
                      Object.hasOwn(articlesAnalytic,pagePath) ? articlesAnalytic[pagePath].screenPageViews : '-'
                    }
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
              <p className='p-3 text-gray-600'>
                {article.shortDescription}
              </p>
            </div>
          </div>
        )
      }
    )
  }




  // render
  return (
    <div className='flex justify-center'>
      <div className='my-3 rounded-xl w-1/2 flex flex-col gap-y-3 [&>*]:border dark:[&>*]:border-black	[&>*]:rounded-xl [&>*]:bg-white dark:[&>div]:bg-zinc-900 max-[576px]:w-3/4 max-[768px]:w-2/3'>
        <div>
          <div className='w-fit relative'>
            <div className='relative'>
              <button ref={sortByTitleRef} onClick={handleSortMenuClick} className='p-3 text-xl font-black flex [&+svg]:hover:visible'>
                newest post
              </button>
              {
                showArrow ? 
                  <HiOutlineArrowUp className='self-center invisible absolute top-2/4 right-0 -translate-y-2/4'/> 
                  : 
                  <HiOutlineArrowDown className='self-center invisible absolute top-2/4 right-0 -translate-y-2/4'/>
              }
            </div>
            <ul ref={ulRef} className='bg-white invisible absolute left-2/4 -translate-x-2/4 [&>button]:px-1 [&>button]:border [&>button]:w-full'>
              <span className='px-2'>Sort by:</span>
              <button className='hover:bg-slate-100' onClick={e=>sortBy(e.currentTarget.textContent as "newest")}>newst</button>
              <button className='hover:bg-slate-100' onClick={e=>sortBy(e.currentTarget.textContent as "oldest")}>oldest</button>
              <button className='hover:bg-slate-100' onClick={e=>sortBy(e.currentTarget.textContent as "popular")}>popular</button>
              <button className='hover:bg-slate-100' onClick={e=>sortBy(e.currentTarget.textContent as "unpopular")}>unpopular</button>
            </ul>
          </div>
        </div>
        <div data-cy="articles-container">
          {
            showArticles()
          }
        </div>
      </div>
    </div>
  )
}