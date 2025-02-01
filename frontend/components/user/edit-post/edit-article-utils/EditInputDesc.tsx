import { ArticleDataState, ArticleData } from "../EditArticle"

interface EditInputDescProps{
  articleDataState: ArticleDataState
  articleDefaultDataRef: React.MutableRefObject<ArticleData>
}
export default function EditInputDesc({
  articleDataState,
  articleDefaultDataRef
}: EditInputDescProps) {
  const [articleData,setArticleData] = articleDataState


  return (
    <div>
      <label htmlFor="edit-desc" className='block'>short description{articleData.shortDescription!==articleDefaultDataRef.current.shortDescription?<span className='text-gray-600'>*</span>:null}</label>
      <input 
        required
        id="edit-desc"
        className="dark:dark-single-component dark:valid:dark-single-component px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white"
        type="text" 
        data-cy="edit-desc"
        placeholder='Describe shortly about your works...'
        value={articleData.shortDescription}
        onChange={e=>{
          setArticleData(prev=>({...prev,shortDescription:e.target.value}))
        }}
      />
    </div>
  )
}
