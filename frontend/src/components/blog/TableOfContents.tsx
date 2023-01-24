import React from 'react'
import {BsThreeDots} from "react-icons/bs"
import removeAddClass from '../../utils/removeAddClass'

interface TableOfContentsProps{
  TOCRef:any,
  TOCData: JSX.Element,
  // rootElement: HTMLDivElement
}

export const TableOfContents = ({TOCRef, TOCData}: TableOfContentsProps) => {
  const [showTOC, setShowTOC] = React.useState(true)
  const prevTableOfContent = React.useRef<HTMLLIElement | null>(null)


  function recurse(ele: any, toDefault: boolean){
    // console.log(ele,ele.nodeName)
    if(ele.nodeName!=="LI"){
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

    recurse(ele.parentElement,toDefault)
  }

  const handleTOCClick = (e: React.SyntheticEvent) => {
    // console.log(e.target.nodeName)
    if((e.target as HTMLElement).nodeName==="DIV"){
      const target = e.target as HTMLLIElement
      if(prevTableOfContent.current!==null){
        const prevEle = prevTableOfContent.current
        // console.log(prevEle);
        const borderColorOnHover: string = prevEle.dataset.borderColorOnHover
        const borderColor: string = prevEle.dataset.borderColorDefault
        removeAddClass(prevEle, borderColorOnHover, borderColor)
        removeAddClass(prevEle,"bg-slate-300", "bg-slate-200")
        prevEle.classList.toggle("!font-semibold")

        recurse(prevEle,true)
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
      TOCRef.current[target.firstChild.nodeValue].scrollIntoView({block: 'start',behavior: "smooth"});
      // rootElement.classList.contains("dark") ? 
      //   TOCRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "#262626"
      //   :
      //   TOCRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "white"
      // ;

      setTimeout(() => {
        TOCRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "inherit"
      },3000)
      console.log(TOCRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor)
      removeAddClass(target, borderColor, borderColorOnHover)
      removeAddClass(target,"bg-slate-200", "bg-slate-300")
      target.classList.toggle("!font-semibold")


      recurse(target.parentElement,false)
    }
  }





  return (
    <>
      {/* consider this div as the grandparent */}
      <div className='max-[1024px]:hidden'>
        {/* consider this div as the parent */}
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
export const TableOfContents2 = ({TOCRef, TOCData}: TableOfContentsProps) => {
  const [showTOC, setShowTOC] = React.useState(true)
  const [isSticky, setIsSticky] = React.useState(false)

  const prevTableOfContent = React.useRef<HTMLLIElement | null>(null)
  const TOCParentBoxRef = React.useRef()
  const stickyEleRef = React.useRef()
  
  React.useEffect(()=>{
    console.log("useEffect!")
    const stickyEle = stickyEleRef.current as HTMLElement
    console.log(stickyEle.getBoundingClientRect())
    const observer = new IntersectionObserver(
      ([e]) => {
        if(e.isIntersecting){
          console.log("intersecting")
          setIsSticky(e.isIntersecting);
          (TOCParentBoxRef.current as HTMLElement).style.display = "none"
        }
      },
      {
        // threshold: [1],
        rootMargin: '0px 0px -100% 0px',  // alternativly, use this and set `top:0` in the CSS
      }
    )
    console.log(observer)
    observer.observe(stickyEle)
    
    // unmount
    return ()=>{
      console.log("cleanup useEffect!")

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
      TOCRef.current[target.firstChild.nodeValue].scrollIntoView({block: 'start',behavior: "smooth"});
      // rootElement.classList.contains("dark") ? 
      //   TOCRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "#262626"
      //   :
      //   TOCRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "white"
      // ;

      setTimeout(() => {
        TOCRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "inherit"
      },3000)
      console.log(TOCRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor)
      removeAddClass(target, borderColor, borderColorOnHover)
      removeAddClass(target,"bg-slate-200", "bg-slate-300")
      target.classList.toggle("!font-semibold")
    }
  }




  
  return (
    <>
      {/* consider this div as the grandparent */}
      <div 
        className={"relative md:hidden" + (isSticky ? " sticky top-0": "")} 
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
          className='border border-zinc-300 rounded-xl p-5 h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800'
          style={{display:showTOC?"block":"none"}}
          ref={TOCParentBoxRef}
        >
          <h3 className='mb-3 font-bold text-center'>
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
