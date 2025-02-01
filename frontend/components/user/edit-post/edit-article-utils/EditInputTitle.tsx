import { ArticleData, ArticleDataState } from '../EditArticle'

interface EditInputTitleProps{
  articleDataState: ArticleDataState
  articleDefaultDataRef: React.MutableRefObject<ArticleData>
}
export default function EditInputTitle({
  articleDataState,
  articleDefaultDataRef
}: EditInputTitleProps) {
  const [articleData,setArticleData] = articleDataState
  
  return (
    <div>
      <label htmlFor="edit-title" className='block'>
        title{articleData.title!==articleDefaultDataRef.current.title?<span className='text-gray-600'>*</span>:null}
      </label>
      <input 
        required
        id="edit-title"
        data-cy="edit-title"
        className="dark:dark-single-component dark:valid:dark-single-component px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white " 
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
