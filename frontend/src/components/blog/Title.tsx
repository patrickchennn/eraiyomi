import {BiCalendar} from "react-icons/bi"
import {CiClock1} from "react-icons/ci"

interface TitleProps{
  titlePage: string,
  miscInfo: {
    date: string,
    wordCount: number,
    author: string,
    readingTime: string
  },
}
const Title = ({titlePage, miscInfo}: TitleProps) => {
  return (
    <div>
      <h1 className='font-black font-cinzel text-center'>
        {titlePage}
      </h1>
      <span className='text-gray-400 text-sm flex items-center	tracking-[-0.9px]'>
        <BiCalendar className="inline"/> {miscInfo.date} • {miscInfo.wordCount} words written by {miscInfo.author} • <CiClock1 className="inline-block"/> {miscInfo.readingTime}
      </span>
      <hr />
      <br />
    </div>
  )
}

export default Title