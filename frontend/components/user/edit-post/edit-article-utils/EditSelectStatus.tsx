import { Article, ArticleState } from '../EditArticle'
import IsChangedStar from './IsChangedStar'


interface EditSelectStatusProps{
  articleState: ArticleState
  articleDefaultDataRef: React.MutableRefObject<Article>
}
export default function EditSelectStatus({
  articleState,
  articleDefaultDataRef
}: EditSelectStatusProps) {

  const [articleData,setArticleData] = articleState
  
  const handleChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLSelectElement
    console.log("target=",target)
    console.log("target.value=",target.value)
    setArticleData(prev=>({
      ...prev,
      status:target.value as "published"|"unpublished"
    }))
  }


  // render
  return (
    <div >
      <label htmlFor="status">
        Status<IsChangedStar src={articleData.status} dst={articleDefaultDataRef.current.status} />
      </label>
      <select name="status" id="status" onChange={handleChange} value={articleData.status} data-cy="edit-status" className="dark:[&>*]:dark-single-component dark:dark-single-component">
        <option value="published">published</option>
        <option value="unpublished">unpublished</option>
      </select>
    </div>
  )
}