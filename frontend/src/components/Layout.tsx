import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import TopNav from './TopNav'

interface LayoutProps{
  rootElement: HTMLDivElement,
}
const Layout = () => {
  const mainContainerRef = React.useRef<MainContainerRef>({
    searchContainer: null,
    bgSearch: null,
  })

  const handleClick = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLElement
    console.log("bg for searching is clicked")
    target.style.display = "none"
    mainContainerRef.current.searchContainer.style.display = "none"
  }





  return (
    <div 
      className='relative dark:[background:black_!important] dark:text-white max-[640px]:font-sm' 
      style={{
        background:"linear-gradient(90deg, rgba(243,255,255,1) 0%, rgba(162,140,196,0.15) 15%, rgba(103,35,142,0.15) 30%, rgba(211,104,212,0.15) 45%, rgba(255,73,199,0.15) 63%, rgba(255,166,195,0.15) 82%, rgba(255,225,225,0.05) 93%, rgba(255,255,235,1) 100%)"
      }}
    >
      <TopNav 
        mainContainerRef={mainContainerRef} 
      />
      <div className='relative'>
        <div ref={currEle => mainContainerRef.current.bgSearch = currEle} className='bg-black opacity-70 w-full h-full hidden absolute z-[1] top-0 right-0 bottom-0 left-0' onClick={handleClick}></div>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout

export interface MainContainerRef{
  searchContainer: HTMLUListElement,
  bgSearch:HTMLDivElement,
}