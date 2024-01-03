import Image, { StaticImageData } from 'next/image'

export default function GenerateProfilePict(
  {src}: {src: string|StaticImageData}
){
  // console.log("src=",src)
  // if(typeof src==="string"){
    
  // }
  return (
    <div>
      <Image
        className="w-[50px] max-[576px]:w-[40px]"
        src={src}
        alt="profile picture"
        width={50}
        height={50}
      />
    </div>
  )
}