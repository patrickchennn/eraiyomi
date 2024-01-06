"use client"

import { putReply } from "@/services/replyService"
import {AiFillLike,AiOutlineLike} from "react-icons/ai"
import {ArticleCommentReply} from "@patorikkuuu/eraiyomi-types"
import { useUserInfo } from "@/hooks/appContext"
import { Dispatch, SetStateAction } from "react"

interface LikeReplyProps{
  articleId: string
  commentId: string
  reply: ArticleCommentReply
  setReplies:Dispatch<SetStateAction<ArticleCommentReply[]>>
}
const LikeReply = ({articleId,commentId,reply,setReplies}: LikeReplyProps) => {

  // hooks
  const [userInfo] = useUserInfo()

  // methods
  const handleLikeReply = async () => {
    if(!userInfo){
      return alert("Please login in order to rate")
    }

    const updatedReply = await putReply(
      articleId,
      commentId,
      reply.replyId,
      "like",
      undefined,
    )

    console.log("updatedReply=",updatedReply)
    
    setReplies(prev=>{
      const newReplies = [...prev]
      const idx = newReplies.findIndex(replyL => replyL.replyId===reply.replyId)
      newReplies[idx].like = updatedReply.reply.like
      return newReplies
    })
  }




  // render
  return (
    <div className='flex'>
      {reply.like.likeCount} 
      <button onClick={handleLikeReply} data-cy="like-reply">
        {
          userInfo && Object.hasOwn(
            reply.like.users,
            userInfo.email
          ) ?
          <AiFillLike />
          :
          <AiOutlineLike/>
        }
        </button>
    </div>
  )
}

export default LikeReply