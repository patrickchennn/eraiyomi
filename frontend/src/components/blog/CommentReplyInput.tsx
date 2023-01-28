import { AiOutlineSend } from 'react-icons/ai'
import { Account } from '../../../types/Account'
import { Comments } from '../../../types/Article'
import defaultProfile from "../../assets/default-profile.jpg"
import { postCommentReply } from '../../features/articleService'

interface CommentReplyInputProps{
  setComments: React.Dispatch<React.SetStateAction<Comments>>,
  uniqueCommentId:string,
  accountInfo: Account,
  articleId: string,
}
const CommentReplyInput = ({
  setComments,
  uniqueCommentId,
  accountInfo,
  articleId
}: CommentReplyInputProps) => {
  const handleReplySubmit = async (e: React.SyntheticEvent,uniqueCommentId: string) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const replyInput = target.lastElementChild.firstElementChild as HTMLInputElement
    const msg: string = replyInput.value
    const replyTo: string = '@'+accountInfo.name
    // console.log(accountInfo.name,replyTo===msg.trim())

    // if the user did not give any messsage, then tell to user to do so
    // the name to who the user want to reply is not categorized (not included) as replyInput.value. @name <-- this is not included
    // msg.trim() to omit the whitespace. @name (whitespace) <-- this is not included also
    if(!msg.length || replyTo===msg.trim()){
      return alert("Enter some text")
    }
    if(!accountInfo.isLoggedIn){
      return alert("Please login in order to reply")
    }

    setComments(await postCommentReply(articleId,uniqueCommentId,accountInfo,msg))
    alert("reply added!")
  }

  
  return (
    <form 
      className='mt-2.5 hidden gap-x-3' 
      onSubmit={e=>handleReplySubmit(e,uniqueCommentId)}
      method="post"
    >
      <label htmlFor="reply-input">
      <img 
        className='w-[50px] h-auto max-[576px]:w-[40px]' 
        src={accountInfo.isLoggedIn ? accountInfo.picture : defaultProfile} 
        alt="profile picture" 
      />
      </label>
      <div className='border border-stone-200 rounded-md w-full flex focus-within:outline focus-within:outline-2 focus-within:outline-[hotpink] dark:border-stone-700'>
        <textarea 
          onChange={e => {
            const target=e.target as HTMLTextAreaElement
            target.style.height=""
            target.style.height = target.scrollHeight.toString() + "px"
          }}
          id="reply-input" 
          className='outline-0 px-3 rounded-md w-full bg-[#f9f9f9] resize-none placeholder-shown:italic max-[576px]:px-1 dark:bg-black ' 
          placeholder='message...'
        />
        <button className='px-2' type='submit'><AiOutlineSend/></button>
      </div>
    </form>
  )
}

export default CommentReplyInput