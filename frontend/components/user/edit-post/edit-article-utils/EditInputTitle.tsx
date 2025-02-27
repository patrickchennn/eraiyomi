import { ArticlePostRequestBody } from '@shared/Article'
import { ArticleState } from '../EditArticle'
import IsChangedStar from './IsChangedStar'

interface EditInputTitleProps{
  articleState: ArticleState
  articleDefaultDataRef: React.MutableRefObject<ArticlePostRequestBody>
}
export default function EditInputTitle({
  articleState,
  articleDefaultDataRef
}: EditInputTitleProps) {
  const [articleData,setArticleData] = articleState
  
  return (
    <div>
      <label htmlFor="edit-title" className='block'>
        Title<IsChangedStar src={articleData.title} dst={articleDefaultDataRef.current.title}/>
      </label>
      <input 
        required
        id="edit-title"
        data-cy="edit-title"
        className="dark:dark-single-component dark:valid:dark-single-component px-2 border w-full bg-slate-50 valid:bg-slate-100 focus:bg-white" 
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