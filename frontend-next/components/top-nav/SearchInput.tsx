"use client"

import { getArticles } from "@/services/articleService"
import { Article } from "@patorikkuuu/eraiyomi-types"
import isEmpty from "lodash.isempty"
import Link from "next/link"
import { useState, useRef, useEffect, useLayoutEffect } from "react"
import {FcSearch} from "react-icons/fc"
import {ImSearch} from "react-icons/im"

interface SearchInputProps{
}
export default function SearchInput({}: SearchInputProps){
  console.log("@SearchInput")
  // hooks
  const [keySearch,setKeySearch] = useState("")
  const typingTimer = useRef<number|NodeJS.Timeout>(0);

  const [articles, setArticles] = useState<Article[]>();

  const searchResultContainerRef = useRef<HTMLUListElement>(null)

  interface ArticleSearchResultRef{
    [key: string]:{
      articleTitle:HTMLHeadingElement|null,
      articleContainer:HTMLLIElement|null
    }
  }
  const articleSearchResultRef = useRef<ArticleSearchResultRef>({})

  const searchIsUnavailable = useRef<HTMLLIElement>(null)



  // methods
  const handleKeyPress =  (e: React.ChangeEvent) => {

  }

  const handleChange =  (e: React.ChangeEvent) => {
    if(typingTimer.current) clearTimeout(typingTimer.current);

    const target = e.target as HTMLInputElement
    const inputVal = target.value
    setKeySearch(inputVal)
    if(!inputVal.trim()){
      setArticles([])
    }
  
    // console.log("\tSearching for: ",inputVal)
  
  
    typingTimer.current = setTimeout(async () => {
      console.log("inputVal=",inputVal)
      if(inputVal.trim()){
        const articles = await getArticles({
          status:"published",sort:"newest",search:inputVal
        },"no-store")
        console.log("articles=",articles)
        setArticles(articles.data)
      }
    }, 300);
  }

  const handleKeyRelease = () => {

  }



  // render
  return (
    <div className='w-[30%] relative basis-2/4'>

      {/* the search input element */}
      <div className='border border-stone-100 rounded-md flex focus-within:outline focus-within:outline-2 focus-within:outline-[hotpink] dark:border-stone-700'>
        <input 
          id="search-bar" 
          onChange={handleChange}
          // onKeyDown={handleKeyPress} 
          // onKeyUp={handleKeyRelease}
          value={keySearch}
          className="px-3 outline-0 rounded-l-md w-full h-9 shadow-inner dark:bg-zinc-900" 
          type="text" 
          placeholder='Search'
        />
        <label htmlFor='search-bar' className='px-2 rounded-r-md flex bg-slate-100 shadow-inner dark:bg-zinc-900'>
          <ImSearch className='self-center'/>
        </label>
      </div>

      {/* show the result of the search */}
      <ul 
        data-cy="search-container"
        ref={searchResultContainerRef}
        className='border border-gray-100 w-full h-fit bg-[#fdfdfd] overflow-auto absolute z-[2] dark:bg-zinc-900'
      >
        {
          !isEmpty(articles) ? 
          articles!.map((article: Article) => (
            <li key={article._id} className='hover:bg-slate-100 dark:hover:bg-sky-900'>
              <div className='flex'>
                <FcSearch className="text-[1.5rem] self-center"/>
                <h2>
                  <Link href={article.titleArticle.URLpath} target="_blank" className="after:content-[''] after:block after:w-0 after:h-0.5 after:bg-black after:transition-[width] after:duration-500 after:ease-in after:hover:w-full after:dark:bg-white">
                    {article.titleArticle.title}
                  </Link>
                </h2>
              </div>


              {/* keywords */}
              <div>
                {
                  article.category.map((val,idx) => (
                    <span key={idx} className="px-2 hover:font-black">
                      <span>#</span>{val}
                    </span>
                  ))
                }
              </div>
            </li>
          ))
          :
          // {/* IF nothing is found --> display this specific li element, this element is created particularly when indeed nothing is found */}
          keySearch && <li ref={searchIsUnavailable} className='' data-cy="unavailable-element">
            <h2 className='text-center text-gray-400'>
              <mark className='bg-gray-200'>{keySearch}</mark> is unavailable
            </h2>
          </li>
        }
      </ul>
    </div>
  )
}


/*
The search algorithm is always running when the search input bar changed (onChange behavior).
It always run for n times, n is the length of the list, and k times where k is the length of the string.
Thus, the worstcase for this algo is O(n*k).
It could be O(n*1) or reduced to O(n), iif the input value is only 1.
*/