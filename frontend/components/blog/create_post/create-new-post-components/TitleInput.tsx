import { useContext } from 'react'
import { CreateNewPostStateCtx } from '../CreateNewPost'

interface TitleInputProps{
}
export default function TitleInput({}: TitleInputProps) {
  const c = useContext(CreateNewPostStateCtx)!
  const [articleData,setArticleData] = c.articleDataState

  return (
    <div>
      <label htmlFor="title" className='block'>title<span className='text-red-600'>*</span></label>
      <input 
        required
        id="title"
        className="px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white font-bold" 
        type="text" 
        placeholder='Insert a title...'
        value={articleData.title}
        data-cy="title-input"
        onChange={e=>{
          setArticleData(prev=>({...prev,title:e.target.value}))
        }}
      />
    </div>
  )
}
