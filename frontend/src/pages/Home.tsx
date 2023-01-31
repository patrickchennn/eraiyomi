// react
import React from 'react'
import { AppContext } from '../App';

import {BsEye} from "react-icons/bs"
import {BiLike} from "react-icons/bi"
import {HiOutlineArrowDown,HiOutlineArrowUp} from  "react-icons/hi"
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom'

// my custom types
import { Article } from '../../types/Article';
import { ArticlesState } from '../../types/Article';

const Home = () => {
  const {articlesState}: {articlesState: ArticlesState} = React.useContext(AppContext)

  const [showArrow,setShowArrow] = React.useState(true) 
  const ulRef = React.useRef(null)
  // first idx is for sort by latest date, second idx is sort for earliest date
  const [isSorted,setIsSorted] = React.useState([false,false])
  const [articlesSorted,setArticlesSorted] = React.useState({
    "latest":[],
    "earliest":[],
  })
  const sortByTitleRef = React.useRef(null)

  React.useEffect(() => {

    // rootElement.classList.add("dark")
    // rootElement.classList.add("overflow-y-hidden")
  }, [])
  
  
  const handleSortMenuClick = (e: React.SyntheticEvent) => {
    console.log(ulRef.current)
    ulRef.current.classList.toggle("!visible")
    setShowArrow(prev=>!prev)
  }

  const sortByLatestDate = () => {
    // this condition is always true when the same button (this button) clicked again and again 
    if(isSorted[0]){
      return
    }
    setArticlesSorted(prev => ({
      ...prev,
      latest: 
        (articlesState.message as Article[]).sort((a,b)=>{
          let aa = a.publishedDate.split('/').reverse().join();
          let bb = b.publishedDate.split('/').reverse().join();
          return (aa > bb) ? -1 : (aa < bb ? 1 : 0);
        })
    })) 
    console.log("sort_Articles_By_Latest_Date ", articlesSorted.latest)
    sortByTitleRef.current.textContent = "Latest Post"
  }

  const sortByEarliestDate = () => {
    // this condition is always true when the same button (this button) clicked again and again 
    if(isSorted[1]){
      return
    }
    setArticlesSorted(prev => ({
      ...prev,
      earliest: 
        (articlesState.message as Article[]).sort((a,b)=>{
          let aa = a.publishedDate.split('/').reverse().join();
          let bb = b.publishedDate.split('/').reverse().join();
      
          return aa < bb ? -1 : (aa > bb ? 1 : 0)
        })
    })) 

    console.log("sort_Articles_By_Earliest_Date",articlesSorted.earliest)
    sortByTitleRef.current.textContent = "Earliest Post"
    setIsSorted([false,true])
  }
  
  const showArticles = () => {
    let whichOne: Article[]
    if(isSorted[0]){
      whichOne = articlesSorted.latest
    }else if(isSorted[1]){
      whichOne = articlesSorted.earliest
    }else{
      whichOne = articlesState.message
    }

    return whichOne.map(article => 
      (
        <div key={uuidv4()}>
          <div className='p-3 '>
            <div className='flex justify-between'>
              <Link to={article.path} target="_blank" className="text-2xl font-bold after:content-[''] after:block after:w-0 after:h-0.5 after:bg-black after:transition-[width] after:duration-500 after:ease-in after:hover:w-full after:dark:bg-white">
                {article.titleArticle}
              </Link>
              <div className='text-center flex gap-x-2'>
                <dfn className='text-gray-400' title={article.publishedDateVerbose}>
                  {article.publishedDate}
                </dfn>
                {/* <div>
                  <BsEye className='mx-auto'/>
                  09312
                </div> */}
                <div>
                  <BiLike className='mx-auto'/>
                  {article.numberOfLikes}
                </div>
              </div>
            </div>
            <div>
              {
                article.keywords.map((keyword: string,idx: number) => {
                  return (
                    <span key={idx} className="px-2">
                      <span>#</span>{keyword}
                    </span>
                  )
                })
              }
            </div>
            <p className='p-3'>
              {article.shortDescription}
            </p>
          </div>
        </div>
      )
    )
  }





  if(articlesState.isSuccess){
    return (
      <div className='flex justify-center'>
        <div className='my-3 rounded-xl w-1/2 flex flex-col gap-y-3 [&>*]:border [&>*]:rounded-xl [&>*]:bg-white dark:[&>div]:bg-zinc-900 max-[576px]:w-3/4 max-[768px]:w-2/3'>
          <div>
            <div className='w-fit relative'>
              <div className='relative'>
                <button ref={sortByTitleRef} onClick={handleSortMenuClick} className='p-3 text-3xl font-black flex [&+svg]:hover:visible'>
                  Latest Post 
                </button>
                {
                  showArrow ? <HiOutlineArrowUp className='self-center invisible absolute top-2/4 right-0 -translate-y-2/4'/> : <HiOutlineArrowDown className='self-center invisible absolute top-2/4 right-0 -translate-y-2/4'/>
                }
              </div>
              <ul ref={ulRef} className='bg-white invisible absolute left-2/4 -translate-x-2/4 [&>li]:px-1 [&>li]:border [&>li>button]:w-full'>
                <span className='px-2'>Sort by:</span>
                <li className='hover:bg-slate-100'><button onClick={sortByLatestDate}>latest</button></li>
                <li className='hover:bg-slate-100'><button onClick={sortByEarliestDate}>earliest</button></li>
              </ul>
            </div>
          </div>
          {
            showArticles()
          }
        </div>
      </div>
    )
  }
  // else if(articlesState.isError){
  //   return (
  //     <>
  //       err
      
  //     </>
  //   )
  // }
}

export default Home