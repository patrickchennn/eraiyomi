"use client"

import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineFileAdd, AiFillFileAdd } from 'react-icons/ai'
import { BsTrash3, BsTrash3Fill } from 'react-icons/bs'
import Image from 'next/image'
import chalk from 'chalk'
import IsChangedStar from './IsChangedStar'
import { getArticleThumbnail } from '@/services/article/articleThumbnailService'


interface EditInputThumbnailProps{
  articleId: string
  thumbnailRef: React.MutableRefObject<HTMLInputElement|null>
  thumbnailActionRef: React.MutableRefObject<string>
}
export default function EditInputThumbnail({
  articleId,
  thumbnailRef,
  thumbnailActionRef
}: EditInputThumbnailProps){
  // ~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~
  const [currentThumbnail,setCurrentThumbnail] = useState<string|null>(null)
  const defaultThumbnailRef = useRef<string|null>(null)
  
  // ~~~~~~~~~~~~~~~~~~~~~~Methods~~~~~~~~~~~~~~~~~~~~~~
  const handleThumbnail = (e: React.ChangeEvent) => {
    console.log(chalk.blueBright.bgBlack("Function: @handleThumbnail"))

    const target = e.target as HTMLInputElement
    // console.log("target=",target)

    if(target.files===null){
      return alert("target.files===null")
    }

    const thumbnailImgFile = target.files[0]
    console.log("thumbnailImgFile=",thumbnailImgFile)

    const thumbnailImgSrc = URL.createObjectURL(thumbnailImgFile)
    console.log("thumbnailImgSrc=",thumbnailImgSrc)

    if (thumbnailImgFile) {
      setCurrentThumbnail(thumbnailImgSrc)
      thumbnailActionRef.current = "change"
    }
  }

  const handleRemoveImg = () => {
    console.log(chalk.blueBright.bgBlack("Function: @handleRemoveImg"))

    setCurrentThumbnail(null)
    thumbnailRef.current!.files = null
    thumbnailActionRef.current = "delete"
  }

  const handleResetDefault = () => {
    console.log(chalk.blueBright.bgBlack("Function: @handleResetDefault"))

    thumbnailActionRef.current = "default"
    setCurrentThumbnail(defaultThumbnailRef.current)
  }

  const handleFetchThumbnail = async () => {
    console.log(chalk.blueBright.bgBlack("Function: @handleFetchThumbnail"))

    const resData = await getArticleThumbnail(articleId,"no-store")

    if(resData.data!==null) {
      defaultThumbnailRef.current = resData.data
      setCurrentThumbnail(resData.data)
    }else{
      console.error(resData.message)
    }
  }

  // ~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~
  return (
    <div className='w-fit'>
      <label htmlFor="thumbnail">
        Thumbnail<IsChangedStar src={defaultThumbnailRef.current} dst={currentThumbnail} />
      </label>
      <label 
        className="border-2 border-dotted rounded-md border-gray-400 hover:border-black w-[150px] h-[150px] bg-[aliceblue] block cursor-pointer relative group dark:dark-single-component" 
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
          ref={thumbnailRef}
        />

        <span className='text-3xl absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2'> 
          <AiOutlineFileAdd className="group-hover:hidden"/>
          <AiFillFileAdd className="hidden group-hover:block"/>
        </span>
        <PreviewThumbnail currentThumbnail={currentThumbnail}/>
      </label>

      <div>
        <button onClick={handleFetchThumbnail} type='button'>
          Fetch Thumbnail
        </button>
        <button onClick={handleRemoveImg} className='group' type='button'>
          <BsTrash3Fill className="group-hover:block hidden hover:text-red-500"/>
          <BsTrash3 className="group-hover:hidden"/>
        </button>
        <button onClick={handleResetDefault} type='button'>Reset</button>
      </div>
    </div>
  )
}

interface PreviewThumbnailProps{
  currentThumbnail:string|null
}
const PreviewThumbnail = ({currentThumbnail}: PreviewThumbnailProps) => {

  if(currentThumbnail !== null){
    return (
      <Image 
        src={currentThumbnail} 
        width={0}
        height={0}
        alt="thumbnail" 
        unoptimized
        className='rounded-md w-full h-full' 
      />
    )
  }

  return null
}