import { Dispatch, SetStateAction } from 'react'
import { ArticleMetadataType } from '../CreateNewPost'
import { Article } from '@eraiyomi/types/Article'

interface TitleInputProps{
  title: string
  setArticleData:Dispatch<SetStateAction<ArticleMetadataType>>
}
export default function TitleInput({title,setArticleData}: TitleInputProps) {

  return (
    <div>
      <label htmlFor="title" className='block'>title<span className='text-red-600'>*</span></label>
      <input 
        required
        id="title"
        className="px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white font-bold" 
        type="text" 
        placeholder='Insert a title...'
        value={title}
        data-cy="title-input"
        onChange={e=>{
          setArticleData(prev=>({...prev,title:e.target.value}))
        }}
      />
    </div>
  )
}
