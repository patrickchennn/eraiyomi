"use client"

import { useRef, useState } from 'react';
import { putComment } from '../../../services/commentService';
import { useRouter } from 'next/navigation';

interface EditCommentInputProps{
  articleId: string
  commentId: string
  originalMsg: string
}
/**
 * @description This <form> element is for user who wants to edit their comment.
 */
export default function EditCommentInput({
  articleId,
  commentId,
  originalMsg,
}: EditCommentInputProps){
  // hooks
  const [msg,setMsg] = useState(originalMsg)
  const router = useRouter()
  const saveCancelContainerRef = useRef<HTMLDivElement>(null)



  // methods
  const handleEditCommentSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // console.log(msg)
    const updatedComment = await putComment(
      articleId, 
      commentId, 
      msg
    )
    console.log("updatedComment=",updatedComment)

    router.refresh()
  };



  const handleCancel = () => {
    saveCancelContainerRef.current?.classList.toggle("hidden")
    setMsg(originalMsg)
  }




  // render
  return (
    <form method="put" onSubmit={handleEditCommentSubmit}>
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
        className="rounded-md w-full resize-none dark:bg-inherit"
        id={commentId}
        value={msg}
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

