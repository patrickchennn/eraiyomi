import React from 'react'
import {ArticleMetadataType} from "../CreateNewPost"
import { postArticle } from '@/services/articleService'
import { useUserInfo } from '@/hooks/appContext'
import { POST_ReqBodyArticle } from '@patorikkuuu/eraiyomi-types'

interface SaveDraftBtnProps{
  articleMetadata: ArticleMetadataType
  API_key: string
}
export default function SaveDraftBtn({
  articleMetadata,API_key
}: SaveDraftBtnProps) {
  const [userInfo] = useUserInfo()

  // method
  const handleSaveDraft = async () => {
    // in order to able "save to draft", one is required to input the title,shortDescription, and its categories. Also login for information like 'author'
    const {title,shortDescription,category} = articleMetadata
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
      className='border rounded py-1 px-2 bg-zinc-50 shadow-inner text-sm hover:shadow'
    >
      Save Draft
    </button>
  )
}
