import {FiHash} from "react-icons/fi"
interface ParagraphHeadingProps {
  headingName: string,
  headingType: string,
  setTOCRef: any
}
const ParagraphHeading = ({headingName,headingType,setTOCRef}: ParagraphHeadingProps) => {
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
        <h2 ref={setTOCRef} className='font-black'>
          {child}
        </h2>
      break
    ;

    case "h3":
      final = 
        <h3 ref={setTOCRef} className='font-black'>
          {child}
        </h3>
      break
    ;

    case "h4":
      final = 
        <h4 ref={setTOCRef} className='font-black'>
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