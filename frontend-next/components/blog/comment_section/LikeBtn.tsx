"use client"

import {
  AiFillLike,AiOutlineLike
} from "react-icons/ai"
import { putComment } from '../../../services/commentService'
import { ArticleComment } from '@eraiyomi/types/Comment'
import { useState } from "react"
import { useUserInfo } from "@/hooks/appContext"

interface LikeBtnProps{
  articleId: string
  comment: ArticleComment
  // accountInfo: Account|undefined
}
export default function LikeBtn({articleId,comment}: LikeBtnProps){
  // const router = useRouter();
  const [userInfo] = useUserInfo()
  const [likeCount,setLikeCount] = useState(comment.like.likeCount)
  const [localComment,setLocalComment] = useState(comment)

  const handleLikeComment = async () => {
    if(!userInfo._id){
      return alert("Please login in order to rate")
    }

    const updatedComment = await putComment(
      articleId,
      comment._id,
      undefined,
      "like"
    )
    // console.log("updatedComment=",updatedComment)

    setLikeCount(updatedComment.comment.like.likeCount)
    setLocalComment(updatedComment.comment)
  }





  // render
  return (
      <button onClick={handleLikeComment} data-cy="like-comment">
      {likeCount} 
        {
          userInfo && Object.hasOwn(
            localComment.like.users,
            userInfo.email
          ) ?
          <AiFillLike className="inline-block align-text-top"/>
          :
          <AiOutlineLike className="inline-block align-text-top"/>
        }
      </button>
  )
}