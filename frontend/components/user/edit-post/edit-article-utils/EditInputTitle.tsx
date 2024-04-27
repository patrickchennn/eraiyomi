import {  useContext } from 'react'
import { EditArticleDataCxt } from '../EditArticle'

interface EditInputTitleProps{
}
export default function EditInputTitle({
}: EditInputTitleProps) {
  const c = useContext(EditArticleDataCxt)!
  const [articleData,setArticleData] = c.articleDataState
  const {articleDefaultDataRef} = c
  
  return (
    <div>
      <label htmlFor="edit-title" className='block'>
        title{articleData.title!==articleDefaultDataRef.current.title?<span className='text-gray-600'>*</span>:null}
      </label>
      <input 
        required
        id="edit-title"
        data-cy="edit-title"
        className="px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white font-bold" 
        type="text" 
        placeholder='Insert a title...'
        value={articleData.title}
        onChange={e=>{
          setArticleData(prev=>({...prev,title:e.target.value}))
        }}
      />
    </div>
  )
}
