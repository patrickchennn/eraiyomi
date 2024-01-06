"use client"

import { useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'

import defaultProfile from "@/assets/default-profile.jpg"
import { postCommentReply } from '../../../../services/replyService'
import GenerateProfilePict from '../GenerateProfilePict'
import { User } from '@patorikkuuu/eraiyomi-types'
import { useRouter } from 'next/navigation'
import getCookie from '@/utils/getCookie'
import chalk from 'chalk'

interface ReplyInputProps{
  articleId: string
  commentId:string,
  user: User|undefined
}
export default function ReplyInput({
  articleId,
  commentId,
  user
}: ReplyInputProps){
  const [msg,setMsg] = useState("")
  const router = useRouter()


  const handleReplySubmit = async (e: React.FormEvent) => {
    console.log(chalk.blue("@handleReplySubmit"))
    e.preventDefault()

    const userCredToken: string | null = getCookie("userCredToken");
    if(!user||!userCredToken) return alert("login in order to reply")

    await postCommentReply(
      articleId,
      commentId,
      msg,
      userCredToken
    )
    router.refresh()
  }

  
  return (
    // By default this element is display: hidden. It will appear when the user clicked the reply button in which it will trigger this element to showed up.
    <form 
      className='mt-2.5 hidden gap-x-3' 
      onSubmit={handleReplySubmit}
      method="post"
    >
      <GenerateProfilePict src={user ? user.profilePictureUrl : defaultProfile} />
      <div className='border border-stone-200 rounded-md w-full flex focus-within:outline focus-within:outline-2 focus-within:outline-[hotpink] dark:border-stone-700'>
        <textarea 
          onChange={e => {
            const target=e.target as HTMLTextAreaElement
            target.style.height=""
            target.style.height = target.scrollHeight.toString() + "px"
            setMsg(target.value)
          }}
          value={msg}
          className='outline-0 px-3 rounded-md w-full bg-[#f9f9f9] resize-none placeholder-shown:italic max-[576px]:px-1 dark:bg-black ' 
          placeholder='message...'
          id={`${commentId}-reply-input`}
          data-cy="reply-input"
        />
        <button className='px-2' type='submit'><AiOutlineSend/></button>
      </div>
    </form>
  )
}