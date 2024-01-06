"use client"

import { AiOutlineSend } from 'react-icons/ai'
import ProfilePict from './GenerateProfilePict'
import { experimental_useFormState } from 'react-dom'
import { User } from '@patorikkuuu/eraiyomi-types'
import handleCommentSubmit from './handle-comment-submit/handleCommentSubmitAction'
import isEmpty from 'lodash.isempty'



interface NewCommentInputProps{
  articleId: string
  user:User|undefined
  userCredToken: string|undefined
}
export default function NewCommentInput({
  articleId,user,userCredToken
}: NewCommentInputProps){

  const [state, formAction] = experimental_useFormState(
    (prev:any,fd:FormData)=>handleCommentSubmit(prev,fd,articleId,user,userCredToken), 
    {message:""}
  )
  // console.log("state=",state)


  return (
    <form 
      action={formAction}
      className='mb-2 mt-2.5 flex gap-x-3' 
      method="post"
    >
      {/* photo profile */}
      {!isEmpty(user) ?
      <ProfilePict src={user.profilePictureUrl}/>
      :
      <></>
      }

      {/* the textarea */}
      <div className='border border-stone-200 rounded-md w-full flex focus-within:outline focus-within:outline-2 focus-within:outline-[hotpink] dark:border-stone-700'>
        <textarea 
          name='message'
          onChange={e => {
            const target=e.target
            target.style.height=""
            target.style.height = target.scrollHeight.toString() + "px"
          }}
          data-cy="new-comment-input"
          className='px-3 outline-0 rounded-md w-full bg-[#f9f9f9] resize-none placeholder-shown:italic max-[576px]:px-1 dark:bg-black' 
          placeholder='message...'
        />
        {/* <SubmitButton/> */}
        <button className='px-3.5' data-cy='new-comment-input-submit-btn'>
          <AiOutlineSend/>
        </button>
      </div>
    </form>
  )
}