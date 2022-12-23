import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import TopNav from './TopNav'

interface LayoutProps{
  rootElement: HTMLDivElement,
}
export interface MainContainerRef{
  searchContainer: HTMLUListElement,
  bgSearch:HTMLDivElement,
}
const Layout = ({rootElement}: LayoutProps) => {
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
    <div className='dark:[background:black_!important] dark:text-white relative' style={{background:"linear-gradient(90deg, rgba(242,242,242,1) 0%, rgba(245,241,245,1) 11%, rgba(244,248,241,1) 20%, rgba(255,240,253,1) 44%, rgba(252,242,243,1) 60%, rgba(245,244,251,1) 73%, rgba(245,242,253,1) 78%, rgba(243,239,254,1) 83%, rgba(242,252,242,1) 87%, rgba(246,245,249,1) 91%, rgba(247,247,247,1) 100%)"}}>
      <TopNav mainContainerRef={mainContainerRef} rootElement={rootElement}/>
      <div className='relative'>
        <div ref={currEle => mainContainerRef.current.bgSearch = currEle} className='bg-black opacity-70 w-full h-full hidden absolute z-[1] top-0 right-0 bottom-0 left-0' onClick={handleClick}></div>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout