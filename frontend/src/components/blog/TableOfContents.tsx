import React from 'react'
import {BsThreeDots} from "react-icons/bs"
import removeAddClass from '../../utils/removeAddClass'
import isDarkMode from '../../utils/isDarkMode'

interface TableOfContentsProps{
  headingRef:React.MutableRefObject<{[key: string]: HTMLHeadingElement}>,
  TOCData: JSX.Element,
}

export const TableOfContents = ({headingRef, TOCData}: TableOfContentsProps) => {
  const [showTOC, setShowTOC] = React.useState(true)
  const prevTableOfContent = React.useRef<HTMLDivElement | null>(null)


  /**
   * A recursive function that will help us to traverse back the previous DIV element So, if the current state is on level 3, then this function will traverse up until it hit the parent (level 1)
   * 
   * Here I said parent, it means nothing but the container that encompasses all of the div elements which is the UL element
   * 
   * @param ele The current element
   * @param toDefault This arg tells us whether we want to reset the color to the default or not
   */
  function recurse(ele: HTMLElement, toDefault: boolean){
    // console.log(ele,ele.nodeName)
    // The basecase states: if the ele is not an DIV element, or you can say, if the ele is equals to the container of the DIV elements which is the UL element
    if(ele.nodeName!=="DIV"){
      // console.log("RETURN?")
      return
    }
    const borderColorOnHover: string = ele.dataset.borderColorOnHover
    const borderColor: string = ele.dataset.borderColorDefault

    if(toDefault){
      removeAddClass(ele,borderColorOnHover,borderColor)
    }else{
      removeAddClass(ele,borderColor,borderColorOnHover)
    }

    // parentElement for the first arg because that is what we want, to traverse back
    recurse(ele.parentElement,toDefault)
  }

  const handleTOCClick = (e: React.SyntheticEvent) => {
    // console.log(e.target.nodeName)
    if((e.target as HTMLElement).nodeName==="DIV"){
      const target = e.target as HTMLDivElement

      // If there is a clicked on TOC before, meaning the user has already clicked before. Notice that, I save the value in below code. This is needed because I want the previous clicked element to be back with the default color, mostly the code inside this condition is simply returning the color element into the default one.
      if(prevTableOfContent.current!==null){
        const prevEle = prevTableOfContent.current
        console.log("prevEle: ",prevEle);
        const borderColorOnHover: string = prevEle.dataset.borderColorOnHover
        const borderColor: string = prevEle.dataset.borderColorDefault

        // removing (reset to default)
        removeAddClass(prevEle, borderColorOnHover, borderColor)
        if(isDarkMode()){
          removeAddClass(prevEle,"dark:bg-slate-800", "dark:bg-slate-700")
        }else{
          console.log("not dark shittttt")
          removeAddClass(prevEle,"bg-slate-300", "bg-slate-200")
        }
        prevEle.classList.toggle("!font-semibold")
        recurse(prevEle,true)
      }

      // This is the "on clicked" color. Although the name is "on hover", to be frank it is the same.
      const borderColorOnHover: string = target.dataset.borderColorOnHover
      // boderColor no more than the default color
      const borderColor: string = target.dataset.borderColorDefault;
      // console.log(`
      //   borderColorOnHover: ${borderColorOnHover},
      //   borderColor: ${borderColor}
      // `)
      
      const textContent: string = target.firstChild.nodeValue
      console.log(target, textContent);
      prevTableOfContent.current = target

      // Scroll (jump) into the desired heading
      headingRef.current[textContent].scrollIntoView({block: 'start',behavior: "smooth"});
      //   headingRef.current[textContent].parentElement.style.backgroundColor = "#262626"
      //   :
      //   headingRef.current[textContent].parentElement.style.backgroundColor = "white"
      // ;

      // setTimeout(() => {
      //   headingRef.current[textContent].parentElement.style.backgroundColor = "inherit"
      // },3000)
      // console.log(headingRef.current[textContent].parentElement.style.backgroundColor)
      
      // adding
      if(isDarkMode()){
        removeAddClass(target,"dark:bg-slate-700", "dark:bg-slate-800")
      }else{
        removeAddClass(target,"bg-slate-200", "bg-slate-300")
      }
      removeAddClass(target, borderColor, borderColorOnHover)
      target.classList.toggle("!font-semibold")
      recurse(target.parentElement,false)
    }
  }





  return (
    <>
      <div className='max-[1024px]:hidden'>
        <div 
          className='border border-zinc-300 rounded-xl p-5 h-fit bg-[#F7F9FA] shadow-inner sticky top-5 dark:bg-zinc-900 dark:border-stone-800'
        >
          <h3 className='mb-3 font-bold text-center block'>
            <button onClick={() => setShowTOC(prev=>!prev)}>☰</button>
            <span className='sketch-highlight dark:before:border-sky-200 dark:after:border-sky-200'>
              Table Of Contents
            </span>
          </h3>
          {
            showTOC ?
              <ul onClick={handleTOCClick}>
                {TOCData}
              </ul> :
              <BsThreeDots /> 
          }
        </div>
      </div>
    
    </>
  )
}


// This is version 2 of TableOfContents, created for layout such that <768px
export const TableOfContents2 = ({headingRef, TOCData}: TableOfContentsProps) => {
  const [showTOC, setShowTOC] = React.useState(true)
  const [isSticky, setIsSticky] = React.useState(false)

  const prevTableOfContent = React.useRef<HTMLLIElement | null>(null)
  const TOCParentBoxRef = React.useRef<HTMLDivElement>()
  const stickyEleRef = React.useRef()
  
  React.useEffect(()=>{
    const stickyEle = stickyEleRef.current as HTMLElement
    const observer = new IntersectionObserver(
      ([e]) => {
        if(e.isIntersecting){
          setIsSticky(e.isIntersecting);
          TOCParentBoxRef.current.style.display = "none"
        }
      },
      {
        // threshold: [1],
        rootMargin: '0px 0px -100% 0px',
      }
    )
    observer.observe(stickyEle)
    
    return ()=>{
      observer.unobserve(stickyEle)
    }
  }, [])

  const handleTOCClick = (e: React.SyntheticEvent) => {
    // console.log(e.target.nodeName)
    if((e.target as HTMLElement).nodeName==="DIV"){
      const target = e.target as HTMLLIElement
      const prevEle = prevTableOfContent.current
      if(prevEle!==null){
        // console.log(prevEle);
        const borderColorOnHover: string = prevEle.dataset.borderColorOnHover
        const borderColor: string = prevEle.dataset.borderColorDefault
        removeAddClass(prevEle, borderColorOnHover, borderColor)
        removeAddClass(prevEle,"bg-slate-300", "bg-slate-200")
        prevEle.classList.toggle("!font-semibold")

      }

      // console.log(target, target.parentElement)
      const borderColorOnHover: string = target.dataset.borderColorOnHover
      const borderColor: string = target.dataset.borderColorDefault;


      // console.log(`
      //   borderColorOnHover: ${borderColorOnHover},
      //   borderColor: ${borderColor}
      // `)
      console.log(target, target.firstChild.nodeValue);
      prevTableOfContent.current = target
      headingRef.current[target.firstChild.nodeValue].scrollIntoView({block: 'start',behavior: "smooth"});
      // rootElement.classList.contains("dark") ? 
      //   headingRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "#262626"
      //   :
      //   headingRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "white"
      // ;

      setTimeout(() => {
        headingRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "inherit"
      },3000)
      console.log(headingRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor)
      removeAddClass(target, borderColor, borderColorOnHover)
      removeAddClass(target,"bg-slate-200", "bg-slate-300")
      target.classList.toggle("!font-semibold")
    }
  }




  
  return (
    <>
      {/* consider this div as the grandparent */}
      <div 
        className={"relative min-[1025px]:hidden" + (isSticky ? " sticky top-1": "")} 
        ref={stickyEleRef}
      >
        <button 
          onClick={() => setShowTOC(prev=>!prev)} 
          className="absolute top-0 left-[-5%]"
        >
          ☰
        </button>
        {/* consider this div as the parent */}
        <div 
          className='border border-zinc-300 rounded-t-lg h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800'
          style={{display:showTOC?"block":"none"}}
          ref={TOCParentBoxRef}
        >
          <h3 className='py-1 font-bold text-center text-[darkblue]'>
            <span className='sketch-highlight dark:before:border-sky-200 dark:after:border-sky-200'>
              Table Of Contents
            </span>
          </h3>
            <ul onClick={handleTOCClick}>
              {TOCData}
            </ul>
        </div>
      </div>
    
    </>
  )
}
