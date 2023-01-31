import {BiCalendar,BiTimeFive} from "react-icons/bi"

interface TitleProps{
  titlePage: string,
  miscInfo: {
    date: string,
    wordCount: number,
    author: string,
    readingTime: string,
    keywords: string[],
  },
}
const Title = ({titlePage, miscInfo}: TitleProps) => {
  return (
    <div className="pb-3">
      <h1 className='font-roboto'>
        {titlePage}
      </h1>
      <span className='text-gray-400 text-sm flex flex-wrap	items-center tracking-[-0.9px]'>
        <PublishedDate/> {miscInfo.date} • {miscInfo.wordCount} words written by {miscInfo.author} • <EstimatedReadTime/> {miscInfo.readingTime}
      </span>
      <span className='text-gray-400 text-sm flex gap-x-1'>
        {miscInfo.keywords.map((keyword: string, idx: number) => (
          <span key={idx} >
            <span>#</span>{keyword}
          </span>
        ))}
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