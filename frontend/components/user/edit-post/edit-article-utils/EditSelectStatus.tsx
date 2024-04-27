import { useContext } from "react"
import { EditArticleDataCxt } from "../EditArticle"

interface EditSelectStatusProps{
}
export default function EditSelectStatus({}: EditSelectStatusProps) {
  const c = useContext(EditArticleDataCxt)!
  const [articleData,setArticleData] = c.articleDataState
  const {articleDefaultDataRef} = c
  
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
      <label htmlFor="status">Article status{articleData.status!==articleDefaultDataRef.current.status?<span className='text-gray-600'>*</span>:null}</label>
      <select name="status" id="status" onChange={handleChange} value={articleData.status} data-cy="edit-status">
        <option value="published">published</option>
        <option value="unpublished">unpublished</option>
      </select>
    </div>
  )
}
