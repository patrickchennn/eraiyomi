"use client"

import {useState,useRef, useEffect} from 'react'
import {BsThreeDots} from "react-icons/bs"
import removeAddClass from '../../utils/removeAddClass'
import { useThemeState } from '@/hooks/appContext'
import TOCstyle from '@/assets/TOCstyle'
import { IoMenuOutline,IoMenu } from "react-icons/io5";

interface TableOfContentsProps{
  // TOCData: {[key: string]:HTMLHeadingElement},
}
export const TableOfContents = ({}: TableOfContentsProps) => {
  // hooks
  const [showTOC, setShowTOC] = useState(true)
  const [TOCData,setTOCData] = useState<{[key: string]:HTMLHeadingElement}>({})
  const prevTableOfContent = useRef<HTMLDivElement | null>(null)
  const [theme] = useThemeState()

  useEffect(() => {
    const headings = document.querySelectorAll<HTMLHeadingElement>("#main-content h2,#main-content h3")
    // console.log("headings=",headings)
    let initTOC: {[key: string]:HTMLHeadingElement} = {}
    
    for(let i=0; i<headings.length; i++){
      const heading = headings[i]
      const headingTxt = heading.textContent!
      // console.log("heading=",heading)
      initTOC[headingTxt] = heading 
    }
    setTOCData(initTOC)
  },[])

  // methods
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
    const borderColorOnHoverClick = ele.dataset.borderColorOnHoverclick!
    const borderDefaultColor = ele.dataset.borderDefaultColor!

    if(toDefault){
      // removeAddClass(borderColorOnHoverClick,borderDefaultColor,ele)
      ele.classList.replace(borderColorOnHoverClick, borderDefaultColor)

    }else{
      // removeAddClass(borderDefaultColor,borderColorOnHoverClick,ele)
      ele.classList.replace(borderDefaultColor, borderColorOnHoverClick)
    
    }

    // parentElement for the first arg because that is what we want, to traverse back
    recurse(ele.parentElement!,toDefault)
  }

  const handleTOCClick = (e: React.MouseEvent) => {
    // console.log(e.target.nodeName)
    // console.log("TOCData=",TOCData)
    if((e.target as HTMLElement).nodeName==="DIV"){
      const target = e.target as HTMLDivElement

      // IF there is a clicked on TOC before, meaning the user has already clicked before. 
      // Notice that, I save the value in below code. This is needed because I want the previous clicked element to be back with the default color, mostly the code inside this condition is simply returning the color element into the default one.
      if(prevTableOfContent.current){
        const prevEle = prevTableOfContent.current
        // console.log("prevEle: ",prevEle);
        const borderColorOnHoverClick = prevEle.dataset.borderColorOnHoverclick!
        const borderDefaultColor = prevEle.dataset.borderDefaultColor!
        console.log(`
        prevEle:
        borderColorOnHoverClick: ${borderColorOnHoverClick},
        borderDefaultColor: ${borderDefaultColor}
      `)

        // removing (reset to default)
        // removeAddClass( borderColorOnHoverClick, borderDefaultColor, prevEle)
        prevEle.classList.replace(borderColorOnHoverClick, borderDefaultColor)
        if(theme==="dark"){
          removeAddClass("dark:bg-slate-800", "dark:bg-slate-700", prevEle)
        }else{
          // console.log("not dark shittttt")
          removeAddClass("bg-slate-300", "bg-slate-200", prevEle)
        }
        prevEle.classList.toggle("!font-semibold")
        recurse(prevEle,true)
      }

      const borderColorOnHoverClick = target.dataset.borderColorOnHoverclick!
      const borderDefaultColor = target.dataset.borderDefaultColor!
      // console.log(`
      //   borderColorOnHoverClick: ${borderColorOnHoverClick},
      //   borderDefaultColor: ${borderDefaultColor}
      // `)
      
      const textContent = target.firstChild!.nodeValue!
      console.log(target, textContent);

      prevTableOfContent.current = target

      // Scroll (jump) into the desired heading
      TOCData[textContent].scrollIntoView({block: 'start',behavior: "smooth"});
      console.log(`TOCData[${textContent}]=`,TOCData[textContent])

      
      // IF the theme is currently on dark mode,
      if(theme==="dark"){
        removeAddClass("dark:bg-slate-700", "dark:bg-slate-800", target)
      }else{
        removeAddClass("bg-slate-200", "bg-slate-300", target)
      }
      // removeAddClass( borderDefaultColor, borderColorOnHoverClick, target)
      target.classList.replace(borderDefaultColor, borderColorOnHoverClick)

      target.classList.toggle("!font-semibold")
      recurse(target.parentElement!,false)
    }
  }



  if(!TOCData){
    return (
      <div className="loader">...</div>
    )
  }


  // render
  return (
    <>
      <div className='max-[1024px]:hidden'>
        <div className='border border-zinc-300 rounded-xl p-5 h-fit bg-[#F7F9FA] shadow-inner sticky top-5 dark:bg-zinc-900 dark:border-stone-800'>
          <h3 className='mb-3 font-bold flex justify-center'>
            <button className="group" onClick={() => setShowTOC(prev=>!prev)}>
              <IoMenuOutline className="group-hover:hidden"/>
              <IoMenu className="hidden group-hover:block"/>
            </button>
            {/* sketch-highlight */}
            <span className='dark:before:border-sky-200 dark:after:border-sky-200'>
              Daftar Isi
            </span>
          </h3>
          {
            showTOC ?
              <ul className='p-0' onClick={handleTOCClick}>
                {Object.entries(TOCData).map(([headingTxt,heading],idx: number) => {
                  const headingType = heading.tagName.toLowerCase() as "h2"|"h3"
                  return (
                    <div
                      key={idx} 
                      className={TOCstyle[headingType].fullStyle}
                      data-border-default-color={TOCstyle[headingType].borderDefault}
                      data-border-color-on-hoverclick={TOCstyle[headingType].borderOnHoverClick}
                    >
                      {headingTxt}
                    </div>
                  )
                })}
              </ul> :
              <BsThreeDots /> 
          }
        </div>
      </div>
    
    </>
  )
}


// This is version 2 of TableOfContents, created for layout such that <768px
// export const TableOfContents2 = ({headingRef, TOCData}: TableOfContentsProps) => {
//   const [theme] = useThemeState()

//   const [showTOC, setShowTOC] = useState(true)
//   const [isSticky, setIsSticky] = useState(false)

//   const prevTableOfContent = useRef<HTMLLIElement | null>(null)
//   const TOCParentBoxRef = useRef<HTMLDivElement>()
//   const stickyEleRef = useRef()
  
//   useEffect(()=>{
//     const stickyEle = stickyEleRef.current as HTMLElement
//     const observer = new IntersectionObserver(
//       ([e]) => {
//         if(e.isIntersecting){
//           setIsSticky(e.isIntersecting);
//           TOCParentBoxRef.current.style.display = "none"
//         }
//       },
//       {
//         // threshold: [1],
//         rootMargin: '0px 0px -100% 0px',
//       }
//     )
//     observer.observe(stickyEle)
    
//     return ()=>{
//       observer.unobserve(stickyEle)
//     }
//   }, [])

//   const handleTOCClick = (e: React.SyntheticEvent) => {
//     // console.log(e.target.nodeName)
//     if((e.target as HTMLElement).nodeName==="DIV"){
//       const target = e.target as HTMLLIElement
//       const prevEle = prevTableOfContent.current
//       if(prevEle!==null){
//         // console.log(prevEle);
//         const borderColorOnHover: string = prevEle.dataset.borderColorOnHover
//         const borderColor: string = prevEle.dataset.borderColorDefault
//         removeAddClass( borderColorOnHover, borderColor,prevEle)

//         if(theme==="dark"){
//           removeAddClass("dark:bg-slate-800", "dark:bg-slate-700",prevEle)
//         }else{
//           console.log("not dark shittttt")
//           removeAddClass("bg-slate-300", "bg-slate-200",prevEle)
//         }
//         prevEle.classList.toggle("!font-semibold")

//       }

//       // console.log(target, target.parentElement)
//       const borderColorOnHover: string = target.dataset.borderColorOnHover
//       const borderColor: string = target.dataset.borderColorDefault;


//       // console.log(`
//       //   borderColorOnHover: ${borderColorOnHover},
//       //   borderColor: ${borderColor}
//       // `)
//       console.log(target, target.firstChild.nodeValue);
//       prevTableOfContent.current = target
//       headingRef.current[target.firstChild.nodeValue].scrollIntoView({block: 'start',behavior: "smooth"});


//       setTimeout(() => {
//         headingRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor = "inherit"
//       },3000)
//       console.log(headingRef.current[target.firstChild.nodeValue].parentElement.style.backgroundColor)
//       removeAddClass(borderColor, borderColorOnHover,target)
//       removeAddClass("bg-slate-200", "bg-slate-300",target)
//       target.classList.toggle("!font-semibold")
//     }
//   }




  
//   return (
//     <>
//       {/* consider this div as the grandparent */}
//       <div 
//         className={"relative min-[1025px]:hidden" + (isSticky ? " sticky top-1": "")} 
//         ref={stickyEleRef}
//       >
//         <button 
//           onClick={() => setShowTOC(prev=>!prev)} 
//           className="absolute top-0 left-[-5%]"
//         >
//           ☰
//         </button>
//         {/* consider this div as the parent */}
//         <div 
//           className='border border-zinc-300 rounded-t-lg h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800'
//           style={{display:showTOC?"block":"none"}}
//           ref={TOCParentBoxRef}
//         >
//           <h3 className='py-1 font-bold text-center'>
//             <span className='sketch-highlight dark:before:border-sky-200 dark:after:border-sky-200'>
//               Daftar Isi
//             </span>
//           </h3>
//             <ul className='p-0' onClick={handleTOCClick}>
//               {/* {TOCData.map((Toc: React.FunctionComponent) => {
//                   return <Toc key={Math.ceil(Math.random()*100000)}/>
//               })} */}
//               {TOCData}
//             </ul>
//         </div>
//       </div>
    
//     </>
//   )
// }
