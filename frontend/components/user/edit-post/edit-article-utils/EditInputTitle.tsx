import { Dispatch, SetStateAction } from 'react'
import { ArticleData } from '../EditArticle'

interface EditInputTitleProps{
  title: string
  defaultTitle: string
  setArticleData:Dispatch<SetStateAction<ArticleData>>
}
export default function EditInputTitle({
  title,defaultTitle,setArticleData
}: EditInputTitleProps) {

  return (
    <div>
      <label htmlFor="edit-title" className='block'>
        title{title!==defaultTitle?<span className='text-gray-600'>*</span>:null}
      </label>
      <input 
        required
        id="edit-title"
        data-cy="edit-title"
        className="px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white font-bold" 
        type="text" 
        placeholder='Insert a title...'
        value={title}
        onChange={e=>{
          setArticleData(prev=>({...prev,title:e.target.value}))
        }}
      />
    </div>
  )
}
