import { useContext } from 'react'
import { CreateNewPostStateCtx } from '../CreateNewPost'


export default function TitleInput() {
  const c = useContext(CreateNewPostStateCtx)!
  const [articleData,setArticleData] = c.articleDataState

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