import {useContext} from 'react'
import { AiOutlineFileAdd, AiFillFileAdd } from 'react-icons/ai'
import Image from 'next/image'
import { CreateNewPostStateCtx } from '../CreateNewPost'

interface ThumbnailInputProps{
}
export default function ThumbnailInput({
}: ThumbnailInputProps) {

  const c = useContext(CreateNewPostStateCtx)!
  const [articleMetadata,setArticleMetadata] = c.articleDataState



  const handleThumbnail = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement
    console.log("target=",target)
    const file = target.files
    if (file) {
      const thumbnailImgFile = file[0]
      console.log("thumbnailImgFile=",thumbnailImgFile)

      const thumbnailImgSrc = URL.createObjectURL(thumbnailImgFile)
      console.log("thumbnailImgSrc=",thumbnailImgSrc)

      setArticleMetadata(prev=>({
        ...prev,
        thumbnail:thumbnailImgFile
      }))
    }
  }

  // render
  return (
    <form 
      encType="multipart/form-data" 
      method='post'
      className='w-fit'
    >
      <label htmlFor="thumbnail">add thumbnail</label>
      <label 
        className="border-2 border-dotted rounded-md border-gray-400 hover:border-black w-[150px] h-[150px] bg-[aliceblue] block cursor-pointer relative group" 
        tabIndex={0} 
        htmlFor="thumbnail"
        data-cy="add-thumbnail-input-btn"
      >
        <input 
          id="thumbnail"
          className="w-[0.1px] h-[0.1px] opacity-0 absolute z-[-1]" 
          type="file" 
          name="thumbnail" 
          accept="image/png, image/gif, image/jpeg" 
          tabIndex={-1}
          onChange={handleThumbnail}
        />

        <span className='text-3xl absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2'> 
          <AiOutlineFileAdd className="group-hover:hidden"/>
          <AiFillFileAdd className="hidden group-hover:block"/>
        </span>
        {articleMetadata.thumbnail?
          <Image
            unoptimized 
            width={0}
            height={0}
            src={URL.createObjectURL(articleMetadata.thumbnail as File)}
            alt="thumbnail" 
            className='rounded-md w-full h-full'
          />
          :
          <></>
        }
      </label>
    </form>
  )
}
