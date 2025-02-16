import { Article, ArticleState } from '../EditArticle'
import IsChangedStar from './IsChangedStar'


interface EditInputDescProps{
  articleState: ArticleState
  articleDefaultDataRef: React.MutableRefObject<Article>
}
export default function EditInputDesc({
  articleState,
  articleDefaultDataRef
}: EditInputDescProps) {
  const [articleData,setArticleData] = articleState


  return (
    <div>
      <label htmlFor="edit-desc" className='block'>
        Description<IsChangedStar src={articleData.shortDescription} dst={articleDefaultDataRef.current.shortDescription} />
      </label>
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
