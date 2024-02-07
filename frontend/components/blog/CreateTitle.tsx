import chalk from "chalk"
import {BiCalendar,BiTimeFive} from "react-icons/bi"
import { LuDot } from "react-icons/lu";

interface CreateTitleProps{
  titlePage: string,
  miscInfo: {
    date: string,
    wordCount: number,
    author: string,
    readingTime: string,
    category: string[],
  },
}
const CreateTitle = ({titlePage, miscInfo}: CreateTitleProps) =>{
  console.log(chalk.yellow("@CreateTitle()"))
  console.log("miscInfo=",miscInfo)
  
  return (
    <div>
      <h1 className='font-roboto'>
        {titlePage}
      </h1>
      <span className='text-gray-400 text-sm flex flex-wrap	items-center tracking-[-0.9px]'>
        <PublishedDate/> {miscInfo.date} <LuDot /> {miscInfo.wordCount} kata ditulis oleh {miscInfo.author} <LuDot /> <EstimatedReadTime/> {miscInfo.readingTime}
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
    <dfn title="tanggal awal publikasi" className="flex">
      <BiCalendar className="inline-block"/>
    </dfn>
  )
}

const EstimatedReadTime = () => {
  return (
    <dfn title="estimasi waktu baca" className="flex">
      <BiTimeFive className="inline-block"/>
    </dfn>
  )
}

export default CreateTitle