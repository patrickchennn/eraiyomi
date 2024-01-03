import React, { Dispatch, SetStateAction } from 'react'
import { ArticleData } from '../EditArticle'

interface EditInputDescProps{
  desc: string
  defaultDesc: string
  setArticleData:Dispatch<SetStateAction<ArticleData>>
}
export default function EditInputDesc({desc,defaultDesc,setArticleData}: EditInputDescProps) {

  return (
    <div>
      <label htmlFor="edit-desc" className='block'>short description{desc!==defaultDesc?<span className='text-gray-600'>*</span>:null}</label>
      <input 
        required
        id="edit-desc"
        className="px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white"
        type="text" 
        data-cy="edit-desc"
        placeholder='Describe shortly about your works...'
        value={desc}
        onChange={e=>{
          setArticleData(prev=>({...prev,shortDescription:e.target.value}))
        }}
      />
    </div>
  )
}
