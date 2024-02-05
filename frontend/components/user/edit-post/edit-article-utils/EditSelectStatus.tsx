import { ArticleData } from "../EditArticle"

interface EditSelectStatusProps{
  articleStatus: "published"|"unpublished"
  defaultArticleStatus:"published"|"unpublished"
  setArticleData: React.Dispatch<React.SetStateAction<ArticleData>>
}
export default function EditSelectStatus({articleStatus,defaultArticleStatus,setArticleData}: EditSelectStatusProps) {

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
    <div>
      <label htmlFor="status">Article status{articleStatus!==defaultArticleStatus?<span className='text-gray-600'>*</span>:null}</label>
      <select name="status" id="status" onChange={handleChange} value={articleStatus} data-cy="edit-status">
        <option value="published">published</option>
        <option value="unpublished">unpublished</option>
      </select>
    </div>
  )
}
