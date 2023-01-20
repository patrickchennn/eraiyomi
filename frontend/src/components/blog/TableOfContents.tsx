import React from 'react'
import {BsThreeDots} from "react-icons/bs"
interface TableOfContentsProps{
  TOCRef:any,
  TOCData: JSX.Element,
  // rootElement: HTMLDivElement
}

const TableOfContents = ({TOCRef, TOCData}: TableOfContentsProps) => {
  const prevTableOfContent = React.useRef<HTMLLIElement | null>(null)
  const [iSTOCHide, setISTOCHide] = React.useState(false)


  const removeAddClass = (ele: HTMLElement, toRemove: string, toAdd: string) => {
    ele.classList.remove(toRemove)
    ele.classList.add(toAdd)
  }

  function x(ele: any, toDefault: boolean){
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

    x(ele.parentElement,toDefault)
  }

  function handleClick(e: React.SyntheticEvent){
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

        x(prevEle,true)
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


      x(target.parentElement,false)
    }
  }





  return (
    <div className=''>
      <div className='border border-zinc-300 rounded-xl p-5 h-fit bg-[#F7F9FA] shadow-inner sticky top-5 dark:bg-zinc-900 dark:border-[#363636]'>
        <h3 className='mb-3 font-bold text-center'>
          <span className='cursor-pointer' onClick={() => setISTOCHide(prev=>!prev)}>☰</span>
          <span className='sketch-highlight dark:before:border-sky-200 dark:after:border-sky-200'>
            Table Of Contents
          </span>
        </h3>
        {
          iSTOCHide ?
            <BsThreeDots /> :
            <ul onClick={handleClick}>
              {TOCData}
            </ul>
        }
      </div>
    </div>
  )
}

export default TableOfContents