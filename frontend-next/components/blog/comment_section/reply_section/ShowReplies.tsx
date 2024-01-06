"use client"

import { ArticleComment } from "@patorikkuuu/eraiyomi-types";
import { getReplies } from "@/services/replyService";
import ReplyTemplate from "./ReplyTemplate";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useUserInfo } from "@/hooks/appContext";
import { ArticleCommentReply } from "@patorikkuuu/eraiyomi-types";

interface ShowRepliesProps{
  articleId:string
  comment: ArticleComment
}
export default function ShowReplies({
  articleId,
  comment,
}: ShowRepliesProps){

  // hooks
  const [userInfo] = useUserInfo()
  const [repliesContainer,setRepliesContainer] = useState<HTMLElement>()
  const [RepliesElem,setRepliesElem] = useState(<></>)
  const [replies,setReplies] = useState<ArticleCommentReply[]>([])


  useEffect(()=>{
    // console.log("accountInfo=",accountInfo)
    setRepliesElem(<></>)
  },[userInfo])


  // methods
  /**
   * @desc basically toogle the reply button.
   */
  const handleShowReplies = async () => {
    const repliesContainerFetch = document.getElementById(`${comment._id}-replies-container`)

    if(!repliesContainerFetch) return
    setRepliesContainer(repliesContainerFetch)


    // console.log("onClick: repliesContainer=",repliesContainer)
    // console.log("repliesContainer?.childElementCount=",repliesContainer?.childElementCount)
    // console.log("comment.totalRepliesCount=",comment.totalRepliesCount)

    // IF the replies content already fetched 
    if(
      repliesContainerFetch?.childElementCount && 
      comment.totalRepliesCount===repliesContainerFetch?.childElementCount
    ){
      repliesContainerFetch.classList.toggle("hidden")
      return
    }

    const repliesRes = await getReplies(articleId,comment._id)
    console.log("repliesRes=",repliesRes)

    if(!repliesRes){
      alert("500: Internal Server Error.")
      return console.error("500: Internal Server Error")
    }
    // console.log("accountInfo=",accountInfo)

    const RepliesTemp = <ReplyTemplate 
      articleId={articleId}
      commentId={comment._id}
      initReplies={repliesRes.replies}
      user={userInfo}
    />
  
    setRepliesElem(RepliesTemp)

    repliesContainerFetch.classList.toggle("hidden")
  };


  const btnStyle = `${!comment.totalRepliesCount?"text-gray-500	select-none pointer-events-none":""}`





  // render
  return (
    <>
      <button onClick={handleShowReplies} className={btnStyle} data-cy="render-replies-btn">
        {comment.totalRepliesCount} replies
      </button>
      {RepliesElem && repliesContainer && createPortal(RepliesElem, repliesContainer)}
    </>
  )
}