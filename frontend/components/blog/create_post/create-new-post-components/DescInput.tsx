import React, { Dispatch, SetStateAction } from 'react'
import { ArticleMetadataType } from '../CreateNewPost'

interface DescInputProps{
  desc: string
  setArticleData:Dispatch<SetStateAction<ArticleMetadataType>>
}
export default function DescInput({desc,setArticleData}: DescInputProps) {

  return (
    <div>
      <label htmlFor="description" className='block'>short description<span className='text-red-600'>*</span></label>
      <input 
        required
        id="description"
        className="px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white"
        type="text" 
        placeholder='Describe shortly about your works...'
        value={desc}
        data-cy="desc-input"
        onChange={e=>{
          setArticleData(prev=>({...prev,shortDescription:e.target.value}))
        }}
      />
    </div>
  )
}
