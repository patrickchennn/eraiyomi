"use client"

import React from 'react'
import { BiReply } from 'react-icons/bi'


interface ReplyInputBtnProps{
  displayName: string
  commentId: string
}
const ReplyInputBtn = ({displayName, commentId}: ReplyInputBtnProps) => {


  const handleShowInputReply = () => {
    const replyInput = document.getElementById(`${commentId}-reply-input`) as HTMLInputElement
    if(!replyInput) return console.error("replyInput is ",replyInput)
    // console.log("replyInput=",replyInput)
    

    // @ts-ignore
    replyInput.parentElement.parentElement.classList.toggle("!flex");

    replyInput.focus();
    replyInput.value = `@${displayName} `;
  };



  // render
  return (
    <button onClick={handleShowInputReply} data-cy="show-reply-input-btn">
      <BiReply className="inline"/>reply
    </button>
  )
}

export default ReplyInputBtn