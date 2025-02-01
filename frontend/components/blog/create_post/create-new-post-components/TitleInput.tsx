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
        className="rounded px-2 w-full bg-slate-50 dark:bg-zinc-800 valid:bg-slate-100 focus:bg-white" 
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
