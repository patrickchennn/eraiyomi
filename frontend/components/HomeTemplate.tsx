"use client"

import chalk from 'chalk'

// react
import { useRef, useState } from 'react'

// icons
import {BsEye} from "react-icons/bs"
import {BiLike} from "react-icons/bi"
import {HiOutlineArrowDown,HiOutlineArrowUp} from  "react-icons/hi"

import Link from "next/link";

// my custom types
import { Article, ArticlesAnalytic } from '@shared/Article'

import { getArticles } from '@/services/article/articleService'

interface ArticlesSorted{
  "newest":Article[],
  "oldest":Article[],
  "popular":Article[],
  "unpopular":Article[]
}
interface HomeTemplateProps{
  initArticles: Article[]
  articlesAnalytic:ArticlesAnalytic|null
}
export default function HomeTemplate ({initArticles,articlesAnalytic}: HomeTemplateProps){
  console.log(chalk.blueBright.bgBlack("[INF] Rendering @HomeTemplate component"))

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [showArrow,setShowArrow] = useState(true) 
  const [loading, setLoading] = useState(false); // Loading state
  const [sortType,setSortType] = useState("newest") 
  const ulRef = useRef<HTMLUListElement>(null)
  // first idx is for sort by latest date, second idx is sort for earliest date

  const [articlesSorted,setArticlesSorted] = useState<ArticlesSorted>({
    "newest":initArticles,
    "oldest":[],
    "popular":[],
    "unpopular":[]
  })
  const sortByTitleRef = useRef(null)

  

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const handleSortMenuClick = () => {
    ulRef.current!.classList.toggle("!visible")
    setShowArrow(prev=>!prev)
  }

  const sortBy = async (type: "newest" | "oldest" | "popular" | "unpopular") => {
    console.log("type=",type) 
    setSortType(type)

    // IF: each of different `type` of sort is never been used/called --> it's our job to save it to hook state
    // this condition also says one thing: for each different `type` of sort, it's guaranteed it would be called once
    if(!articlesSorted[type].length){
      setLoading(true);
      const articles = await getArticles({sort:type})
      setArticlesSorted( prev => ({
          ...prev,
          [type as string]:articles.data
        })
      )
      setLoading(false);
    }

  }




  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <div>
      <div className='w-fit relative'>
        <div className='flex'>
          <button ref={sortByTitleRef} onClick={handleSortMenuClick} className='p-3 text-xl font-black flex [&>svg]:hover:visible'>
            newest post
            {
              showArrow ? 
                <HiOutlineArrowUp className='self-center invisible'/> 
                : 
                <HiOutlineArrowDown className='self-center invisible'/>
            }
          </button>
        </div>
        <SortDropdown sortBy={sortBy} ulRef={ulRef}/>
      </div>
    </div>

  )
}

type SortOption = "newest" | "oldest" | "popular" | "unpopular";

interface SortDropdownProps {
  sortBy: (option: SortOption) => void,
  ulRef: React.RefObject<HTMLUListElement>
}
const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, ulRef }) => {

  const sortOptions: SortOption[] = ["newest", "oldest", "popular", "unpopular"];

  return (
    <ul ref={ulRef} className="bg-white invisible absolute left-2/4 -translate-x-2/4 [&>button]:px-1 [&>button]:border [&>button]:w-full dark:dark-single-component">
      <span className="px-2 x">Sort by:</span>
      {sortOptions.map((option) => (
        <button
          key={option}
          className="hover:bg-slate-100 dark:hover:bg-zinc-800"
          onClick={() => sortBy(option)}
        >
          {option}
        </button>
      ))}
    </ul>
  );
};