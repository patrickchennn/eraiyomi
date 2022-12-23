import React from 'react'
import "./assets/app.css"
import { Link } from "react-router-dom"
import {BsEye} from "react-icons/bs"
import {BiLike} from "react-icons/bi"
import {HiOutlineArrowDown,HiOutlineArrowUp} from  "react-icons/hi"
import data from "../data.json"
import { v4 as uuidv4 } from 'uuid';

const App = ({rootElement}: {rootElement: HTMLDivElement}) => {
  const [articles,setArticles] = React.useState(data.articles)
  const [showArrow,setShowArrow] = React.useState(true) 
  const ulRef = React.useRef(null)
  // first idx is for sort by latest date, second idx is sort for earliest date
  const [isSorted,setIsSorted] = React.useState([false,false])
  const sortedArticles = React.useRef({
    "latest":[],
    "earliest":[],
  })
  const sortByTitleRef = React.useRef(null)
  React.useEffect(() => {
    // rootElement.classList.add("dark")
    // rootElement.classList.add("overflow-y-hidden")
    let sortedArticlesByLatestDate = articles.sort(function(a,b){
      // console.log(a,b)
      const aa = a.publishedDate.split('/').reverse().join(),
      bb = b.publishedDate.split('/').reverse().join()
      
      return aa > bb ? -1 : (aa < bb ? 1 : 0)
    })
    sortedArticles.current.latest = [...sortedArticlesByLatestDate]
    let sortedArticlesByEarliestDate = articles.sort(function(a,b){
      // console.log(a,b)
      const aa = a.publishedDate.split('/').reverse().join(),
      bb = b.publishedDate.split('/').reverse().join()

      return aa < bb ? -1 : (aa > bb ? 1 : 0)
    })
    sortedArticles.current.earliest = [...sortedArticlesByEarliestDate]

    setIsSorted([true,false])

  }, [])





  function handleSortMenuClick(e: React.SyntheticEvent){
    console.log(ulRef.current)
    ulRef.current.classList.toggle("!visible")
    setShowArrow(prev=>!prev)
  }

  const sortByLatestDate = () => {
    // this condition is always true when the same button (this button) clicked again and again 
    if(isSorted[0]){
      return
    }
    sortByTitleRef.current.textContent = "Latest Post"
    setIsSorted([true,false])
  }

  const sortByEarliestDate = () => {
    // this condition is always true when the same button (this button) clicked again and again 
    if(isSorted[1]){
      return
    }
    sortByTitleRef.current.textContent = "Earliest Post"
    setIsSorted([false,true])
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const showArticles = () => {
    let whichOne
    if(isSorted[0]){
      whichOne = sortedArticles.current.latest
    }else if(isSorted[1]){
      whichOne = sortedArticles.current.earliest
    }else{
      whichOne = articles
    }

    return whichOne.map(article => {
      return (
        <div key={uuidv4()}>
          <div className='p-3 '>
            <div className='flex justify-between'>
              <Link to={article.path} target="_blank" className="text-2xl font-bold after:content-[''] after:block after:w-0 after:h-0.5 after:bg-black after:transition-[width] after:duration-500 after:ease-in after:hover:w-full after:dark:bg-white">
                {article.titleArticle}
              </Link>
              <div className='flex gap-x-3'>
                <dfn className='text-gray-400' title={article.publishedDateVerbose}>
                  {article.publishedDate}
                </dfn>
                <div>
                  <BsEye />
                  123
                </div>
                <div>
                  <BiLike />
                  123
                </div>
              </div>
            </div>
            <div>
              {
                article.keywords.map((keyword: string,idx: number) => {
                  const randCol: string = getRandomColor()
                  return (
                    <span key={idx} className="px-2 hover:rounded-full hover:font-black">
                      <span style={{color:randCol}}>■</span>{keyword}
                    </span>
                  )
                })
              }
            </div>
            <p className='p-3'>
              {article.description}
            </p>
          </div>
        </div>
      )
    })
  }
  




  return (
    <>
      <div className='flex justify-center'>
        <div className='my-3 rounded-xl w-1/2 flex flex-col gap-y-3 [&>*]:border [&>*]:rounded-xl [&>*]:bg-white dark:[&>div]:bg-zinc-900 '>

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
          <>
            {
              showArticles()
            }
          
          </>
        </div>
      </div>
    </>
  )
}

export default App

//dsgdsfg