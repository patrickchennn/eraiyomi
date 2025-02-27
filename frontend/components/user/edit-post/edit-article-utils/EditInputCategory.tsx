import { useState } from 'react'
import { BsPlus } from 'react-icons/bs'
import { IoIosClose } from 'react-icons/io'
import { ArticleState } from '../EditArticle'
import IsChangedStar from './IsChangedStar'
import { ArticlePostRequestBody } from '@shared/Article'


interface EditInputCategoryProps{
  articleState: ArticleState
  articleDefaultDataRef: React.MutableRefObject<ArticlePostRequestBody>
}
export default function EditInputCategory({
  articleState,
  articleDefaultDataRef

}: EditInputCategoryProps) {
  // hooks
  const [categoryTxt,setCategoryTxt] = useState<string>("")
  const [article,setArticle] = articleState



  const handleSetCategoryBtn = () => {
    setArticle(prev=> ({
      ...prev,
      category:[...prev.category,categoryTxt]
    }));
  }

  const handleRemoveCategory = (indexToRemove: number) => {
    // Use filter to create a new array without the category to be removed
    const newcategory = article.category.filter((_, index: number) => index !== indexToRemove);
    
    setArticle(prev=>({
      ...prev,
      category:newcategory
    }))
  };


  // render
  return (
    <div>
      <label htmlFor="edit-category" className='block'>
        Category<IsChangedStar src={article.category} dst={articleDefaultDataRef.current.category}/>
      </label>
      <div className='flex'>
        <input 
          required
          type="text" 
          id="edit-category" 
          data-cy="edit-category"
          className='px-2 border bg-slate-50 focus:bg-white dark:dark-single-component' 
          value={categoryTxt}
          onChange={(e)=>setCategoryTxt(e.target.value)}
        />
        <button className='bg-neutral-100' onClick={handleSetCategoryBtn}><BsPlus/></button>
      </div>
      <div className='text-sm	flex flex-wrap' data-cy="category-container">
        {article.category.map((category,i: number) => {
          return (
            <div key={i} className='px-2 rounded-full flex'>
              {category}
              <button onClick={()=>handleRemoveCategory(i)}><IoIosClose/></button>
            </div>
          )
        })}

      </div>
    </div>
  )
}