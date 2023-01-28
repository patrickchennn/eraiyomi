import { useCallback } from "react"
import {FiHash} from "react-icons/fi"
interface ParagraphHeadingProps {
  headingName: string,
  headingType: string,
  headingRef: React.MutableRefObject<{[key:string]: HTMLHeadingElement}>
}
const ParagraphHeading = ({headingName,headingType,headingRef}: ParagraphHeadingProps) => {
  const setHeadingRef = useCallback((e: HTMLHeadingElement) => {
    // console.log(e, e.textContent);
    headingRef.current[e.textContent] = e
  },[])

  const child: JSX.Element =
    <a 
      className="flex [&>svg]:hover:!visible" 
      href={window.location.pathname+"#"+headingName} 
      onClick={e => {
        const target = e.target as HTMLElement
        target.scrollIntoView({behavior: "smooth"})
      }}
    >
      {headingName}
      <FiHash className="text-sky-400 self-center invisible"/>
    </a>
  ;

  let final: JSX.Element
  switch(headingType){
    case "h2":
      final = 
        <h2 ref={setHeadingRef} className='font-black'>
          {child}
        </h2>
      break
    ;

    case "h3":
      final = 
        <h3 ref={setHeadingRef} className='font-black'>
          {child}
        </h3>
      break
    ;

    case "h4":
      final = 
        <h4 ref={setHeadingRef} className='font-black'>
          {child}
        </h4>
      break
    ;  
    default:
      break

  }
  return final
}

export default ParagraphHeading