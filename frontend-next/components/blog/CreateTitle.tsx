import {BiCalendar,BiTimeFive} from "react-icons/bi"

interface CreateTitleProps{
  titlePage: string,
  miscInfo: {
    date: string,
    wordCount?: number,
    author: string,
    readingTime?: string,
    category: string[],
  },
}
const CreateTitle = ({titlePage, miscInfo}: CreateTitleProps) => {
  return (
    <div>
      <h1 className='font-roboto'>
        {titlePage}
      </h1>
      <span className='text-gray-400 text-sm flex flex-wrap	items-center tracking-[-0.9px]'>
        <PublishedDate/> {miscInfo.date} • {miscInfo.wordCount} kata ditulis oleh {miscInfo.author?miscInfo.author:'?'} • <EstimatedReadTime/> {miscInfo.readingTime}
      </span>
      <span className='text-gray-400 text-sm flex gap-x-1'>
        {miscInfo.category.map((keyword: string, idx: number) => (
          <span key={idx} >
            <span>#</span>{keyword}
          </span>
        ))}
      </span>
    </div>
  )
}

const PublishedDate = () => {
  return (
    <dfn title="published on yyyy-mm-dd" className="flex">
      <BiCalendar className="inline-block"/>
    </dfn>
  )
}

const EstimatedReadTime = () => {
  return (
    <dfn title="estimated read time" className="flex">
      <BiTimeFive className="inline-block"/>
    </dfn>
  )
}

export default CreateTitle