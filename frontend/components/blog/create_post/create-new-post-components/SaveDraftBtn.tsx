import {useContext} from 'react'
import { useUserInfo } from '@/hooks/appContext'
import { POST_ReqBodyArticle } from '@patorikkuuu/eraiyomi-types'
import { postArticle } from '@/services/article/postArticle'
import { CreateNewPostStateCtx } from '../CreateNewPost'

interface SaveDraftBtnProps{
  API_key: string
  className: string
}
export default function SaveDraftBtn({
  API_key,
  className
}: SaveDraftBtnProps) {
  const [userInfo] = useUserInfo()
  const c = useContext(CreateNewPostStateCtx)!
  const [articleMetadata] = c.articleDataState
  const {title,shortDescription,category} = articleMetadata

  // method
  const handleSaveDraft = async () => {
    // in order to able "save to draft", one is required to input the title,shortDescription, and its categories. Also login for information like 'author'
    // console.log(title,shortDescription,categories)
    // console.log(!title.length, !shortDescription.length, categories.length===0)
    if(
      !title.length || 
      !shortDescription.length || 
      category.length===0 ||
      !API_key.length
    ){
      return alert("Fill all of the necessary data input that marked with '*' in order to save")
    }



    const articleMetadataMod = {
      ...articleMetadata,
      author: userInfo.username
    }
    const postReqBodyArticle: POST_ReqBodyArticle = {
      title: articleMetadata.title,
      shortDescription: articleMetadata.shortDescription,
      status:"unpublished",
      author:userInfo.username,
      email: userInfo.email,
      category: articleMetadata.category
    }
    await postArticle(postReqBodyArticle,API_key)
  }




  // render
  return (
    <button 
      onClick={handleSaveDraft}
      className={className}
    >
      Save Draft
    </button>
  )
}
