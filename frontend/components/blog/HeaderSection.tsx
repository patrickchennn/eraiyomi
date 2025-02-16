"use server"

import Image from "next/image"

interface HeaderSectionProps{
  thumbnailSrc: string | null,
}
const HeaderSection = ({thumbnailSrc}: HeaderSectionProps) => {

    
  // console.log("pict=",pict)
  if(thumbnailSrc===null){
    return null
  }
  return (
    <>
      <div>
        {/* https://github.com/vercel/next.js/issues/18372 */}
        <Image 
          src={thumbnailSrc} 
          alt="Thumbnail image" 
          width={0}
          height={0}
          className="rounded-t-xl w-full shadow-md" 
          unoptimized
          priority={true}
        />
      </div>
      {/* <p className={eb_garamond.className+" text-gray-400 text-center text-xs italic"}>
        {caption}
      </p> */}
    </>
  )
}

export default HeaderSection