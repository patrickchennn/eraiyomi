import {BiCalendar,BiTimeFive} from "react-icons/bi"

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
      <h1 className='font-roboto text-center'>
        {titlePage}
      </h1>
      <span className='text-gray-400 text-sm flex items-center tracking-[-0.9px]'>
        <PublishedDate/> {miscInfo.date} • {miscInfo.wordCount} words written by {miscInfo.author} • <EstimatedReadTime/> {miscInfo.readingTime}
      </span>
      <hr />
    </div>
  )
}

const PublishedDate = () => {
  return (
    <dfn title="published on">
      <BiCalendar className="inline-block"/>
    </dfn>
  )
}

const EstimatedReadTime = () => {
  return (
    <dfn title="estimated read time">
      <BiTimeFive className="inline-block"/>
    </dfn>
  )
}

export default Title