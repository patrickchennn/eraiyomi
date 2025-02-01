import { AiOutlineFileAdd, AiFillFileAdd } from 'react-icons/ai'
import { BsTrash3, BsTrash3Fill } from 'react-icons/bs'
import Image from 'next/image'
import { ArticleAssetData, ArticleAssetState } from '../EditArticle'

interface EditInputThumbnailProps{
  articleAssetState: ArticleAssetState
  articleAssetOriginalDataRef: React.MutableRefObject<ArticleAssetData>
  thumbnailState:[File | null, React.Dispatch<React.SetStateAction<File | null>>]
}
export default function EditInputThumbnail({
  articleAssetState,
  articleAssetOriginalDataRef,
  thumbnailState
}: EditInputThumbnailProps) {
  const [_,setArticleAssetData] = articleAssetState
  const [thumbnail,setThumbnail] = thumbnailState


  const handleThumbnail = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement
    // console.log("target=",target)

    const thumbnailImgFile = target.files![0]
    console.log("thumbnailImgFile=",thumbnailImgFile)

    if (thumbnailImgFile) {

      setThumbnail(thumbnailImgFile)

      // setArticleAssetData(prev=>({
      //   ...prev,
      //   thumbnail:{
      //     fileName: thumbnailImgFile.name,
      //     relativePath:string,
      //     mimeType: string,
      //   }
      // }))
    }
  }

  const handleRemoveImg = () => {
    // setArticleAssetData(prev=>({
    //   ...prev,
    //   thumbnail:null
    // }))
    // setThumbnail(null)
  }

  // const handleResetDefault = () => {
  //   setArticleAssetData(prev=>({
  //     ...prev,
  //     thumbnail:"default"
  //   }))
  //   setCurrImg((defaultThumbnail as ArticleAsset["thumbnail"]).dataURL)
  // }


  // render
  return (
    <div className='w-fit'>
      <label htmlFor="thumbnail">
        Thumbnail
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
        />

        <span className='text-3xl absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2'> 
          <AiOutlineFileAdd className="group-hover:hidden"/>
          <AiFillFileAdd className="hidden group-hover:block"/>
        </span>
        {
          thumbnail ? 
          <Image 
            unoptimized
            width={0}
            height={0}
            src={URL.createObjectURL(thumbnail)} 
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
        {/* <button onClick={handleResetDefault} className='' type='button'>
          <LiaUndoAltSolid className="hover:text-red-500"/>
        </button> */}
      </div>
    </div>
  )
}
