"use client"

import { useState, useRef, Dispatch, SetStateAction } from 'react';
import { putReply } from '@/services/replyService';
import { useRouter } from 'next/navigation';
import { ArticleCommentReply } from '@eraiyomi/types/Reply';

interface EditReplyInputProps{
  articleId: string
  commentId: string
  replyId: string
  originalMsg: string
  setReplies:Dispatch<SetStateAction<ArticleCommentReply[]>>
}
/**
 * @description This <form> element is for user who wants to edit their comment.
 */
const EditReplyInput = ({
  articleId,
  commentId,
  replyId,
  originalMsg,
  setReplies
}: EditReplyInputProps) => {
  // hooks
  const [msg,setMsg] = useState(originalMsg)
  const router = useRouter()
  const saveCancelContainerRef = useRef<HTMLDivElement>(null)

  // methods
  const handleEditReplySubmit = async (e: React.FormEvent) => {
    // console.log("@handleEditReplySubmit")
    e.preventDefault();

    const data = await putReply(
      articleId, 
      commentId, 
      replyId, 
      undefined, 
      msg
    )
    console.log("updatedReply=",data)
    setReplies(prev=>{
      const newReplies = [...prev]
      const idx = newReplies.findIndex(reply=>reply.replyId===replyId)
      newReplies[idx].message = data.reply.message
      return newReplies
    })
    router.refresh()
  };

  const handleCancel = () => {
    saveCancelContainerRef.current?.classList.toggle("hidden")
    setMsg(originalMsg)

  }




  // render
  return (
    <form method="put" onSubmit={handleEditReplySubmit}>
      <textarea
        onClick={()=>{
          // const target = e.target as HTMLTextAreaElement;
          // if(saveCancelContainerRef.current?.classList.contains("hidden"))
            saveCancelContainerRef.current?.classList.toggle("hidden")
        }}
        onInput={e => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height="";
          target.style.height=target.scrollHeight.toString() + "px";
          setMsg(e.currentTarget.value)
        }}
        id={replyId}
        className="rounded-md w-full resize-none dark:bg-inherit"
        value={msg}
        data-cy="edit-reply-input"
      ></textarea>
      <div className='text-sm hidden' ref={saveCancelContainerRef}>
        <button
          type="button" // Specify the type as "button" to prevent form submission
          onClick={handleCancel}
          className="rounded-lg px-2 py-1 mr-2 bg-red-300 hover:bg-red-400 focus:ring-4 focus:ring-red-100 dark:text-black"
        >
          cancel
        </button>

        <button
          type="submit"
          className="rounded-lg px-2 py-1 mr-2 bg-emerald-300 hover:bg-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:text-black"
        >
          save
        </button>
      </div>
    </form>
  )
}

export default EditReplyInput