import { useContext, useState } from 'react'
import { BsPlus } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { CreateNewPostStateCtx } from '../CreateNewPost';

interface CategoryInputProps{
}
export default function CategoryInput({}: CategoryInputProps) {
  // hooks
  const c = useContext(CreateNewPostStateCtx)!
  const [articleData,setArticleData] = c.articleDataState
  const [categoryTxt,setCategoryTxt] = useState<string>("")


  // useEffect(()=>{
  //   const { content, ...rest } = articleMetadata;
  //   window.localStorage.setItem("article-metadata",JSON.stringify(rest))
  // },[categoryTxt])

  const handleSetCategoryBtn = () => {
    setArticleData(prev=> ({
      ...prev,
      category:[...prev.category,categoryTxt]
    }));
  }

  const handleRemoveCategory = (indexToRemove: number) => {
    // Use filter to create a new array without the category to be removed
    const newcategory = articleData.category.filter((_, index: number) => index !== indexToRemove);
    
    setArticleData(prev=>({
      ...prev,
      category:newcategory
    }))
  };


  // render
  return (
    <div>
      <label htmlFor="category" className='block'>category<span className='text-red-600'>*</span></label>
      <div className='flex'>
        <input 
          required
          type="text" 
          id="category" 
          className='px-2 border bg-slate-50 valid:bg-slate-100 focus:bg-white' 
          value={categoryTxt}
          onChange={(e)=>setCategoryTxt(e.target.value)}
          data-cy="category-input"
        />
        <button className='bg-neutral-100' onClick={handleSetCategoryBtn}><BsPlus/></button>
      </div>
      <div className='text-sm	flex flex-wrap'>
      {articleData.category.map((category,i: number) => {
        return (
          <div key={i} className='px-2 rounded-full flex'>
            {category}
            <button className='' onClick={()=>handleRemoveCategory(i)}><IoIosClose/></button>
          </div>
        )
      })}

      </div>
    </div>
  )
}
