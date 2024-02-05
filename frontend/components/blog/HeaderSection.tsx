
import { EB_Garamond } from "next/font/google"
import Image from "next/image"

const eb_garamond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight:"400"
})

interface HeaderSectionProps{
  pict?: string,
  caption?: string,
}
const HeaderSection = ({pict,caption}: HeaderSectionProps) => {
  // console.log("pict=",pict)
  return (
    <>
      {

        pict?
        <>
          <div>
            {/* https://github.com/vercel/next.js/issues/18372 */}
            <Image 
              unoptimized 
              width={0}
              height={0}
              className="rounded-t-xl w-full shadow-md" 
              src={pict} 
              alt="Thumbnail" 
            />
          </div>
          <p className={eb_garamond.className+" text-gray-400 text-center text-xs italic"}>
            {caption}
          </p>
        </>
        :
        <></>
      }
    </>
  )
}

export default HeaderSection