"use client"

import { BsThreeDots } from "react-icons/bs";
import { deleteReply } from "../../../../services/replyService";
import { useRouter } from "next/navigation";
import { ArticleCommentReply } from "@eraiyomi/types/Reply";
import { Dispatch, SetStateAction } from "react";

interface ModifyReplyProps{
  articleId: string
  commentId: string
  replyId: string
  setReplies:Dispatch<SetStateAction<ArticleCommentReply[]>>
}
/**
 * @desc Delete and edit a comment. This requires the user to login first in order to gain the feature. 
 */
const ModifyReply = ({
  articleId,
  commentId,
  replyId,
  setReplies
}: ModifyReplyProps
) => {
  const router = useRouter();



  const handleDeleteReplyBtn = async () => {
    await deleteReply(articleId, commentId,replyId)
    setReplies(prev=>{
      const updatedReplies = prev.filter(reply=>reply.replyId!==replyId)
      return updatedReplies
    })
    router.refresh(); 
  };



  // render
  return (
    <div className="relative">

      <input className="peer hidden" type="checkbox" id={`reply-toolbar-toggler-${replyId}`}/>
      <label 
        htmlFor={`reply-toolbar-toggler-${replyId}`} 
        className="cursor-pointer"
        data-cy="delete-reply-toggler"
      >
        <BsThreeDots />
      </label>

      <ul className="peer-checked:block hidden absolute [&>li>button]:border [&>li>button]:bg-zinc-50 [&>li>button]:px-3 [&>li>button]:py-1 [&>li>button]:w-full">
        <button
          onClick={handleDeleteReplyBtn}
          className="hover:bg-fuchsia-200"
        >
          Delete
        </button>
      </ul>
    </div>
  )
}

export default ModifyReply