import { Dispatch, SetStateAction } from "react"
import { ArticleMetadataType } from "../CreateNewPost"

interface MdFileInputInputProps{
  contentStuctureType: ArticleMetadataType["contentStuctureType"]
  setArticleData:Dispatch<SetStateAction<ArticleMetadataType>>
}
function MdFileInput({contentStuctureType,setArticleData}: MdFileInputInputProps) {

  // methods
  const handleThumbnail = () => {

  }


  // render
  return (
    <form
      encType="multipart/form-data" 
      method='post'
      className='w-fit'
    >
      <label htmlFor="doc_file_upload">upload a file:</label>
      <input type="file" id="doc_file_upload" name="doc_file_upload" accept="text/markdown,text/plain" onChange={handleThumbnail}/>
    </form>
  )
}

export default MdFileInput