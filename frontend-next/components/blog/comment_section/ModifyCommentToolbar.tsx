"use client"

import { BsThreeDots } from "react-icons/bs";
import { deleteComment } from "../../../services/commentService";
import { useRouter } from 'next/navigation';

interface ModifyCommentToolbarProps{
  commentId: string
  articleId: string
}
/**
 * @desc Delete and edit a comment. This requires the user to login first in order to gain the feature. 
 */
export default function ModifyCommentToolbar({
  articleId,
  commentId,
}: ModifyCommentToolbarProps){
  // hooks
  const router = useRouter();


  // methods
  const handleDeleteCommentBtn = async () => {
    await deleteComment(articleId, commentId)
    router.refresh();
  };




  // render
  return (
    <div className="relative">

      <input className="peer hidden" type="checkbox" id={`commet-toolbar-toggler-${commentId}`}/>
      <label htmlFor={`commet-toolbar-toggler-${commentId}`} className="cursor-pointer">
        <BsThreeDots />
      </label>

      <ul className="peer-checked:block hidden absolute [&>li>button]:border [&>li>button]:bg-zinc-50 [&>li>button]:px-3 [&>li>button]:py-1 [&>li>button]:w-full">
        <button
          onClick={handleDeleteCommentBtn}
          className="hover:bg-fuchsia-200"
        >
          Delete
        </button>
      </ul>
    </div>
  )
}