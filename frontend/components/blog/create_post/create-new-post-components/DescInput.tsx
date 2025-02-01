import { useContext } from 'react'
import { CreateNewPostStateCtx } from '../CreateNewPost'

interface DescInputProps{
}
export default function DescInput({}: DescInputProps) {
  const c = useContext(CreateNewPostStateCtx)!
  const [articleData,setArticleData] = c.articleDataState

  return (
    <div>
      <label htmlFor="description" className='block'>short description<span className='text-red-600'>*</span></label>
      <input 
        required
        id="description"
        className="rounded px-2 w-full bg-slate-50 dark:bg-zinc-800 valid:bg-slate-100 focus:bg-white"
        type="text" 
        placeholder='Describe shortly about your works...'
        value={articleData.shortDescription}
        data-cy="desc-input"
        onChange={e=>{
          setArticleData(prev=>({...prev,shortDescription:e.target.value}))
        }}
      />
    </div>
  )
}
