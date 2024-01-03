import { AiOutlineFileAdd, AiFillFileAdd } from 'react-icons/ai'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { ArticleAssetData } from '../EditArticle'
import { BsTrash3, BsTrash3Fill } from 'react-icons/bs'
import {LiaUndoAltSolid} from "react-icons/lia"
import Image from 'next/image'

interface EditInputThumbnailProps{
  defaultThumbnail: string
  setArticleAssetData:Dispatch<SetStateAction<ArticleAssetData>>
}
export default function EditInputThumbnail({
  defaultThumbnail,setArticleAssetData,
}: EditInputThumbnailProps) {

  const [currImg,setCurrImg] = useState(defaultThumbnail)


  const handleThumbnail = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement
    // console.log("target=",target)

    const thumbnailImgFile = target.files![0]
    // console.log("thumbnailImgFile=",thumbnailImgFile)

    if (thumbnailImgFile) {

      const thumbnailImgSrc = URL.createObjectURL(thumbnailImgFile)
      // console.log("thumbnailImgSrc=",thumbnailImgSrc)

      setArticleAssetData(prev=>({
        ...prev,
        thumbnail:thumbnailImgFile
      }))
      setCurrImg(thumbnailImgSrc)
    }
  }

  const handleRemoveImg = () => {
    setArticleAssetData(prev=>({
      ...prev,
      thumbnail:null
    }))
    setCurrImg("")
  }

  const handleResetDefault = () => {
    setArticleAssetData(prev=>({
      ...prev,
      thumbnail:"default"
    }))
    setCurrImg(defaultThumbnail)
  }



  // render
  return (
    <div 
      className='w-fit'
    >
      <label htmlFor="thumbnail">
        thumbnail
        {
        currImg!==defaultThumbnail?
          <span className='text-gray-600'>*</span>
          :
          null
        }
      </label>
      <label 
        className="border-2 border-dotted rounded-md border-gray-400 hover:border-black w-[150px] h-[150px] bg-[aliceblue] block cursor-pointer relative group" 
        tabIndex={0} 
        htmlFor="thumbnail"
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
        {
          currImg ? 
          <Image 
            unoptimized
            width={0}
            height={0}
            src={currImg} 
            alt="thumbnail" 
            className='rounded-md w-full h-full' 
          />
          :
          <></>
        }

      </label>

      <div>
        <button onClick={handleRemoveImg} className='group' type='button'>
          <BsTrash3Fill className="group-hover:block hidden hover:text-red-500"/>
          <BsTrash3 className="group-hover:hidden"/>
        </button>
        <button onClick={handleResetDefault} className='' type='button'>
          <LiaUndoAltSolid className="hover:text-red-500"/>
        </button>
      </div>
    </div>
  )
}
