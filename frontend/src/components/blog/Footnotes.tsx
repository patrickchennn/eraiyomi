import React from "react"
import CitesRef from "../../../types/CitesRef"
import isDarkMode from "../../utils/isDarkMode"

interface FootnotesLayoutProps{
  child: JSX.Element,
  footnotesRef: React.MutableRefObject<HTMLElement>
}
export const FootnotesLayout = ({child,footnotesRef}: FootnotesLayoutProps) => {
  return (
    <div ref={currEle=>footnotesRef.current=currEle} className="pb-5">
      <h2 className='font-bold'>Footnotes</h2>
      <hr />
        {child}
    </div>
  )
}
interface MyCiteProps{
  footnotesRef: React.MutableRefObject<HTMLElement>,
  citesRef: React.MutableRefObject<CitesRef>,
  no: number
}
export const MyCite = ({footnotesRef,citesRef,no}: MyCiteProps) => {

  const cite_n: string = "cite"+no
  return (
    <a 
      href={window.location.pathname+`#cite${no}`} 
      ref={currEle => {
        // if the property of cite_n does even exist on the citesRef.current object, then add it
        if(!Object.hasOwn(citesRef.current,cite_n)){
          citesRef.current[cite_n] = [currEle,null]
        }
        // if it already there, then just do the thing that this function wanted to do which is store the anchor tag
        else{
          citesRef.current[cite_n][0] = currEle
        }
      }}
      className='text-sky-400 hover:underline' 
      onClick={() => {
        // jump into footnotes element
        footnotesRef.current.scrollIntoView({behavior: "smooth"})
        // and color(highlight) the element 
        console.log(isDarkMode())
        if(isDarkMode()){
          // #0c4a6e is the same as sky-50 
          citesRef.current[cite_n][1].style.backgroundColor = "#0c4a6e"
        }else{
          // #f0f9ff is the same as sky-50 
          citesRef.current[cite_n][1].style.backgroundColor = "#f0f9ff"
        }
        // wait 5s to return back to the original color
        setTimeout(() => {
          citesRef.current[cite_n][1].style.backgroundColor = "transparent"
        }, 5000);
      }}
    >
      <sup>
        [{no}]
      </sup>
    </a>
  )
}




interface MyCitesDescProps{
  citesRef:React.MutableRefObject<CitesRef>,
  desc: JSX.Element,
  no:number
}
export const MyCitesDesc = ({citesRef,desc,no}: MyCitesDescProps) => {
  const cite_n: string = "cite"+no
  // console.log(cite_n)
  return (
    <p 
      ref={currEle => {
        // if the property of cite_n does even exist on the citesRef.current object, then add it
        if(!Object.hasOwn(citesRef.current,cite_n)){
          citesRef.current[cite_n] = [null,currEle]
        }else{
          citesRef.current[cite_n][1] = currEle
        }
      }} 
      className='text-sm'
    >
      <a 
        className='text-sky-400 hover:cursor-pointer hover:underline' 
        onClick={() => {
          citesRef.current[cite_n][0].scrollIntoView({behavior: "smooth"})
        }}
      > 
        {no}<sup>^ </sup>
      </a>
      {desc}
    </p>
  )
}
//asdasd