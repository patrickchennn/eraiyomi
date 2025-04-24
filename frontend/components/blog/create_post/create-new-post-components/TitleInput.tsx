import { ArticlePostRequestBody } from '@shared/Article'
import { Dispatch, SetStateAction } from 'react'


interface TitleInputProps {
  articleDataState: [ArticlePostRequestBody, Dispatch<SetStateAction<ArticlePostRequestBody>>]
} 
export default function TitleInput({articleDataState}: TitleInputProps) {
  const [articleData,setArticleData] = articleDataState

  return (
    <div>
      <label htmlFor="title" className='block'>Title<span className='text-red-600'>*</span></label>
      <input 
        required
        id="title"
        className="rounded px-2 w-full bg-slate-50 dark:bg-zinc-800 valid:bg-slate-100 focus:bg-white" 
        type="text" 
        value={articleData.title}
        data-cy="title-input"
        onChange={e=>{
          setArticleData(prev=>({...prev,title:e.target.value}))
        }}
      />
    </div>
  )
}