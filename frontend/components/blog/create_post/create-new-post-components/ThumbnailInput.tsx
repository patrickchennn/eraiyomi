import {useContext, useState} from 'react'
import { AiOutlineFileAdd, AiFillFileAdd } from 'react-icons/ai'
import Image from 'next/image'
import { CreateNewPostStateCtx } from '../CreateNewPost'
import { BsTrash3Fill, BsTrash3 } from 'react-icons/bs'
import chalk from 'chalk'


export default function ThumbnailInput() {

  // ~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~
  const c = useContext(CreateNewPostStateCtx)!
  const thumbnailRef = c.thumbnailRef

  const [currentThumbnailSrc,setCurrentThumbnailSrc] = useState<string|null>(null)
  



  // ~~~~~~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~~~~~~
  const handleThumbnail = (e: React.ChangeEvent) => {
    console.log(chalk.blueBright.bgBlack("@handleThumbnail"))

    const target = e.target as HTMLInputElement
    console.log("target=",target)

    const files = target.files
    if (files!==null && files[0]) {
      const thumbnailImgFile = files[0]
      console.log("thumbnailImgFile=",thumbnailImgFile)

      const thumbnailImgSrc = URL.createObjectURL(thumbnailImgFile)
      console.log("thumbnailImgSrc=",thumbnailImgSrc)

      setCurrentThumbnailSrc(thumbnailImgSrc)
    }
  }

  const handleRemoveImg = () => {
    console.log(chalk.blueBright.bgBlack("@handleRemoveImg"))

    setCurrentThumbnailSrc(null)

    // Reset file input value to allow re-uploading the same file
    if (thumbnailRef.current) {
      thumbnailRef.current.value = "";
    }
  }




  // ~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <form 
      encType="multipart/form-data" 
      method='post'
      className='w-fit'
    >
      <label htmlFor="thumbnail">Thumbnail</label>
      <label 
        className="border-2 border-dotted rounded-md border-gray-400 hover:border-black w-[150px] h-[150px] bg-[aliceblue] dark:bg-zinc-900 block cursor-pointer relative group" 
        tabIndex={0} 
        htmlFor="thumbnail"
        data-cy="add-thumbnail-input-btn"
      >
        <input 
          id="thumbnail"
          className="w-[0.1px] h-[0.1px] opacity-0 absolute z-[-1]" 
          type="file" 
          name="thumbnail" 
          accept="image/png, image/jpeg" 
          tabIndex={-1}
          onChange={handleThumbnail}
          ref={thumbnailRef}
        />

        <span className='text-3xl absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2'> 
          <AiOutlineFileAdd className="group-hover:hidden"/>
          <AiFillFileAdd className="hidden group-hover:block"/>
        </span>
        {
          currentThumbnailSrc ?
          <Image
            // Required
            src={currentThumbnailSrc}
            width={0}
            height={0}
            alt="thumbnail" 
            // Optional
            unoptimized 
            className='rounded-md w-full h-full'
          />
          :
          null
        }
      </label>

      <div>
        <button onClick={handleRemoveImg} className='group' type='button'>
          <BsTrash3Fill className="group-hover:block hidden hover:text-red-500"/>
          <BsTrash3 className="group-hover:hidden"/>
        </button>
      </div>
    </form>
  )
}

// https://chatgpt.com/share/67a5cb3c-99c0-800a-ade3-ac30de4fb73c