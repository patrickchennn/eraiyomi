import React from 'react'
import {BsFillMoonStarsFill,BsSunFill} from "react-icons/bs"
import {FaHome} from "react-icons/fa"
import { Link } from "react-router-dom"
import {FcSearch} from "react-icons/fc"
import {ImSearch} from "react-icons/im"

import {AiOutlineSearch} from "react-icons/ai"
import {MainContainerRef} from "./Layout"
import { AppContext } from '../App'

// my custom types
import { Article, ArticlesState } from '../../types/Article'

interface TopNavProps{
  rootElement: HTMLDivElement,
  mainContainerRef: React.MutableRefObject<MainContainerRef>,
}
const TopNav = ({rootElement,mainContainerRef}: TopNavProps) => {
  const {articlesState}: {articlesState: ArticlesState} = React.useContext(AppContext)

  const [isDark,setIsDark] = React.useState(false)
  const [keySearch,setKeySearch] = React.useState("")
  const searchResultContainerRef = React.useRef<HTMLUListElement>()
  interface ArticleSearchResultRef{
    [key: string]:{
      articleTitle:HTMLHeadingElement,
      articleContainer:HTMLLIElement
    }
  }
  const articleSearchResultRef = React.useRef<ArticleSearchResultRef>({})
  const searchIsUnavailable = React.useRef(true)

  React.useEffect(() => {
    
  },[])





  const handleDarkModeClick = () => {
    rootElement.classList.toggle("dark");
    setIsDark(prev=>!prev)
  }

  const handleSearchInputChange = (e: React.SyntheticEvent) => {
    searchIsUnavailable.current = true
    const target = e.target as HTMLInputElement
    const inputValue: string = target.value
    const searchResultContainer = searchResultContainerRef.current as HTMLUListElement
    setKeySearch(inputValue)
    console.log("\tSearching for: ",inputValue)
    mainContainerRef.current.bgSearch.style.display = "block"
    if(inputValue===" " || inputValue===""){
      console.log("nothing to search, just return you shit")
      searchResultContainer.style.display = "none"
      mainContainerRef.current.bgSearch.style.display = "none"
      return
    }else{
      searchResultContainer.style.display = "block"

    }
    // foreach articles
    (articlesState.message as Article[]).forEach((article) => {

      // (some string).toUpperCase(), is needed because I want it to be not case sensitive. This make the search process easier
      
      // get the title article from data.json
      // type TitleArticle = keyof typeof articleSearchResultRef;
      const titleArticle: string = article.titleArticle


      // get the actual search result DOM, so we can determine whether to hide it (if inputValue does not match any of the titleArticle) or display it (if it match)
      const searchResult: HTMLLIElement = articleSearchResultRef.current[titleArticle].articleContainer

      const first_idx: number = titleArticle.toUpperCase().indexOf(inputValue.toUpperCase())
      const last_idx: number = first_idx+inputValue.length
      console.log(titleArticle, first_idx, last_idx, titleArticle.slice(first_idx,last_idx))


      // get the index of the desired search value, match the input value and the titleArticle
      // if === -1, it means the search result is not there, then, display none
      if(( titleArticle.toUpperCase().indexOf(inputValue.toUpperCase()) ) === -1){
        // console.log("FUCK this ", li_h2_Title)
        searchResult.style.display="none"
      }else{
        searchIsUnavailable.current = false
        console.log(searchIsUnavailable)
        searchResult.style.display="block";
        articleSearchResultRef.current[titleArticle].articleTitle.innerHTML = `${titleArticle.slice(0,first_idx)}<mark>${titleArticle.slice(first_idx,last_idx)}</mark>${titleArticle.slice(last_idx)}`
      }
    });
    if(searchIsUnavailable.current){
      (searchResultContainer.children[0] as HTMLElement).style.display = "block"
      console.log("fuck is unavailable")
    }else{
      (searchResultContainer.children[0] as HTMLElement).style.display = "none"
    }
  }

  const handleSearchInputClick = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement
    // console.log(target.parentElement)
  }





  if(articlesState.isSuccess){
    return (
      <div className='py-2 px-6 bg-white  flex justify-between items-center dark:bg-zinc-900'>
  
        {/* go to root/home page */}
        <Link to='/' className=''><FaHome/></Link>
  
        {/* search input */}
        <div className='w-[30%] relative'>
          {/* the search input logic */}
          <div className='border border-stone-100 rounded-md flex focus-within:outline focus-within:outline-2 focus-within:outline-[hotpink] dark:border-stone-700'>
            <input id="search-bar" onClick={handleSearchInputClick} onChange={handleSearchInputChange} className="px-3 outline-0 rounded-l-md w-full h-9 shadow-inner dark:bg-zinc-900" type="text" placeholder='Search'/>
            <label htmlFor='search-bar' className='px-2 rounded-r-md flex bg-slate-100 shadow-inner dark:bg-zinc-900'>
              <ImSearch className='self-center'/>
            </label>
          </div>
  
          {/* show the result of the search */}
          <ul 
            ref={currEle => {
              searchResultContainerRef.current = currEle
              mainContainerRef.current.searchContainer = currEle
            }}
            className='border border-gray-100 w-full h-fit bg-[#fdfdfd] overflow-auto hidden absolute z-[2] dark:bg-zinc-900'
          >
            {/* if nothing is found, display this specific li element */}
            <li className='hidden'>
              <h2 className='text-center text-gray-400'>
                <mark className='bg-gray-100'>{keySearch}</mark> is unavailable
              </h2>
            </li>
            {
              (articlesState.message as Article[]).map((article) => (
                <li 
                  ref={currEle => {
                    const title: string = article.titleArticle
                    // console.log("li ",articleSearchResult,articleSearchResult===undefined)
                    if(!articleSearchResultRef.current.hasOwnProperty(title)){
                      articleSearchResultRef.current[title] = {
                        articleTitle: null,
                        articleContainer: null,
                      };
                    }
    
                      // console.log("before 1: ", articleSearchResult);
                      articleSearchResultRef.current[title] = {
                        ...articleSearchResultRef.current[title], "articleContainer": currEle
                      };
                      // console.log("after 1: ", articleSearchResult,'\n')
                  }} 
                  key={article._id} 
                  className='hidden hover:bg-slate-100 dark:hover:bg-sky-900'
                >
                  <div className='flex'>
                    <FcSearch  className="text-[1.5rem] self-center"/>
                    <h2 ref={currEle => {
                      const title: string = article.titleArticle
                      // console.log("h2 ", articleSearchResult,articleSearchResult===undefined)
  
                      if(!articleSearchResultRef.current.hasOwnProperty(title)){
                        articleSearchResultRef.current[title] = {
                          articleTitle: null,
                          articleContainer: null,
                        };
                      }
    
                      // console.log("before 2: ", articleSearchResult);
                      articleSearchResultRef.current[title] = {
                        ...articleSearchResultRef.current[title], "articleTitle": currEle
                      };
                      // console.log("after 2: ", articleSearchResult,'\n')
                    }}
                    >
                      <Link to={article.path} target="_blank" className="after:content-[''] after:block after:w-0 after:h-0.5 after:bg-black after:transition-[width] after:duration-500 after:ease-in after:hover:w-full after:dark:bg-white">
                        {article.titleArticle}
                      </Link>
                    </h2>
                  </div>
  
                  {/* keywords */}
                  <div>
                    {
                      article.keywords.map((keyword,idx) => (
                        <span key={idx} className="px-2 hover:font-black">
                          <span>#</span>{keyword}
                        </span>
                      ))
                    }
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
  
        {/* toogle dark / sign in(for future feature I guess) */}
        <nav>
          <ul className='flex gap-x-4 [&>*]:hover:cursor-pointer'>
            <li className=''>
              <button className='p-2 rounded-full flex items-center gap-x-3 hover:bg-gray-400' onClick={handleDarkModeClick}>
                {
                  isDark ? <BsSunFill/> : <BsFillMoonStarsFill/>
                }
              </button>
            </li>

          </ul>
        </nav>
      </div>
    )
  }
}

export default TopNav

/*
The search algorithm is always running when the search input bar changed (onChange behavior).
It always run for n times, n is the length of the list, and k times where k is the length of the string.
Thus, the worstcase for this algo is O(n*k).
It could be O(n*1) or O(n) iif the input value is only 1.
*/

/*

            <li className='self-center'>
                <Link to="/detail-profile">
                  <img className='rounded-full w-[35px] h-[35px]' src={profilePict ? profilePict : defaultProfile} alt="profile picture" />
                </Link>
                <Link to="/sign-in">
                  Sign in
                </Link>
            </li>
*/