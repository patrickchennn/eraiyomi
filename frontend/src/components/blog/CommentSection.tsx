import React from 'react'
import {BiReply} from "react-icons/bi"
import {AiOutlineSend} from "react-icons/ai"
import {BiDotsHorizontalRounded} from "react-icons/bi"
import {RxEyeOpen,RxEyeClosed,RxCross2} from "react-icons/rx"
import {BsThreeDots} from "react-icons/bs"
import defaultProfile from "../../assets/default-profile.jpg"
import GoogleLoginBtn from '../GoogleLoginBtn'
import jwt_decode from 'jwt-decode'
import getCookie from '../../utils/getCookie'
import LikeDislikeSvg from './LikeDislikeSvg'
import CommentReplyInput from './CommentReplyInput'

// types/
import { Comments,Replies } from '../../../types/Article'
import { Account, GoogleIdentityRes } from '../../../types/Account'
import { postAccountLogin, postAccountLoginVerify } from '../../features/accountService'

// API
import { 
  deleteCommentDelete, 
  postArticleComment, 
  postCommentReply, 
  putCommentEdit, 
  putCommentLikeDislike 
} from '../../features/articleService'




interface CommentSectionProps {
  articleId: string,
  initComments: Comments,
  style:string,
}
const CommentSection = ({articleId,initComments,style}: CommentSectionProps) => {
  const [comments, setComments] = React.useState<Comments>(initComments)

  const [msg,setMsg] = React.useState("")

  const [accountInfo,setAccountInfo] = React.useState<Account>({
    id: "",
    name: "",
    email: "",
    picture: "",
    isLoggedIn: false,
  })

  interface MsgTextarea{
    [uniqueCommentId: string]:{
      replyTextarea:HTMLTextAreaElement[],
      commentTextarea: HTMLTextAreaElement
    }
  }
  const msgTextarea = React.useRef<MsgTextarea>({})

  const msgTextareaRef = React.useCallback((
    currEle: HTMLTextAreaElement, 
    uniqueCommentId: string,
    idx: number=-1
  ) => {
    if(currEle!==null) {

      if(idx===-1){
        currEle.style.height = currEle.scrollHeight.toString() + "px"
        // for textarea element that is lies on comments object
        msgTextarea.current[uniqueCommentId] = {commentTextarea: currEle, replyTextarea:[]}
      }else{
        // for textarea element that is lies on replies object
        msgTextarea.current[uniqueCommentId].replyTextarea.push(currEle)
      }
    }
  },[])


  const googleLoginBtnRef = React.useRef(null)

  React.useEffect(() => {
    // console.log(googleLoginBtnRef.current)
    window.google.accounts.id.initialize({
      client_id: "230251855708-ag2ddqf9luk40cdkgakgfljdl3s8bmp2.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      context: "signin"
    })
    // window.google.accounts.id.prompt()

    window.google.accounts.id.renderButton(googleLoginBtnRef.current, {
      type:"standard",
      shape:"rectangular",
      theme:"outline",
      text:"continue_with",
      size:"large",
      logo_alignment:"left"
    });
    const user: string|null = getCookie("user")
    // if the searched cookie is available
    if(user!==null){
      // console.log(user);
      (async function (){
        let data = await postAccountLoginVerify(user)
        if(data) setAccountInfo(data)
      }())

    }
  },[])



  interface GoogleSuccessSigninRes{
    clientId: string,
    client_id: string,
    credential: string,
    select_by: string,
  }
  /**
   * @desc Handling the response from google. Send some of the account information to the server because on the back we need to generate a cookie for "keep me signed in" purposes. The cookie has 
   * @param googleSuccessSigninRes A response from google when one is already logged in.
   */
  const handleCredentialResponse = async (googleSuccessSigninRes: GoogleSuccessSigninRes, error: any) => {
    if(error){
      return console.error(error)
    }
    
    // console.log(googleSignInResponse)
    
    // decode the googleSuccessSigninRes.credential (it is a jwt token).
    const responsePayload: GoogleIdentityRes = jwt_decode(googleSuccessSigninRes.credential);
    // send some of the account info to the server
    await postAccountLogin(responsePayload)

    setAccountInfo({
      id: responsePayload.sub,
      name: responsePayload.name,
      email: responsePayload.email,
      picture: responsePayload.picture,
      isLoggedIn:true,
    })
  }

  /**
   * 
   * @param name This property is needed because when one want to reply to other people, it should be evident to whom one want to communicate with thereby the mentioned name is needed. It will be displayed when user toggle the reply input DOM.
   */
  const handleInputReply = (e: React.SyntheticEvent, namae: string) => {
    const target = e.currentTarget as HTMLButtonElement

    // This is the form reply element
    const formReply = target.parentElement.nextElementSibling as HTMLFormElement

    // This is the input reply element. 
    const inputReply = formReply.lastElementChild.firstElementChild as HTMLInputElement

    formReply.classList.toggle("!flex")

    inputReply.focus()
    inputReply.value = `@${namae} `
    console.log(
      "name:",namae ,
      "formReply:",formReply,
      "inputReply", inputReply
    )
  }
  
  /**
   * @desc basically toogle the reply button.
   */
  const handleShowReplies = (e: React.SyntheticEvent, uniqueCommentId: string) => {
    const target = e.currentTarget as HTMLButtonElement
    const repliesLayout = target.parentElement.nextElementSibling.nextElementSibling as HTMLDivElement
    repliesLayout.classList.toggle("!block")
    console.log(msgTextarea.current[uniqueCommentId].replyTextarea)
    msgTextarea.current[uniqueCommentId].replyTextarea.forEach(replyEle => 
      replyEle.style.height = replyEle.scrollHeight.toString() +  "px"
    )
  }

  /**
   * @desc Handling the user who want to comment something on a particular article. Send the comment to the server along with some account information. A little validation is provided such as is the message is given or not?
   */
  const handleCommentSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if(!msg.length){
      return alert("Enter some text")
    }
    if(!accountInfo.isLoggedIn){
      return alert("Please login in order to comment")
    }
    setComments(await postArticleComment(articleId,accountInfo,msg))
  }

  /**
   * 
   * @param uniqueCommentId A co
   * @param type Two options for rate a message which are like or dislike it.
   */
  const handleLikeDislikeBtn = async (uniqueCommentId: string, type: string) => {
    if(!accountInfo.isLoggedIn){
      return alert("Please login in order to rate a comment")
    }
    setComments(await putCommentLikeDislike(articleId,uniqueCommentId,type,accountInfo))
  }

  const handleEditCommentBtn = async(uniqueCommentId:string,idx: number=-1)=>{
    let thisMsgTextarea: HTMLTextAreaElement;
    if(idx===-1){
      thisMsgTextarea = msgTextarea.current[uniqueCommentId].commentTextarea
    }else{
      thisMsgTextarea = msgTextarea.current[uniqueCommentId].replyTextarea[idx]
    }
    const msgLen: number = thisMsgTextarea.value.length
    const saveBtn = thisMsgTextarea.nextElementSibling as HTMLButtonElement

    // if the 
    // if(saveBtn.classList.contains())
    
    thisMsgTextarea.toggleAttribute("readOnly")
    thisMsgTextarea.classList.toggle("!outline-2")
    thisMsgTextarea.focus()
    thisMsgTextarea.setSelectionRange(msgLen,msgLen)
    saveBtn.classList.toggle("hidden")
  }

  const handleEditCommentSubmit = async (
    e:React.SyntheticEvent, 
    uniqueCommentId: string,
    idx: number=-1,
  ) => {
    e.preventDefault()
    let thisMsgTextarea: HTMLTextAreaElement;
    if(idx===-1){
      thisMsgTextarea = msgTextarea.current[uniqueCommentId].commentTextarea
    }else{
      thisMsgTextarea = msgTextarea.current[uniqueCommentId].replyTextarea[idx]
    }
    setComments(await putCommentEdit(articleId,uniqueCommentId,thisMsgTextarea.value))
    alert("the message is successfully edited")
  }

  const handleDeleteCommentBtn = async(uniqueCommentId: string)=>{
    if(!accountInfo.isLoggedIn){
      return alert("Please login in order to delete this comment")
    }

    setComments(await deleteCommentDelete(articleId,uniqueCommentId))
    alert("the message is successfully deleted")
  }




  return (
    <div className={style}>
      <h1 className='font-black text-2xl'>Comments</h1>
      <hr />

      <GoogleLoginBtn ref={googleLoginBtnRef}/>

      {/* start: comment input */}
      <form onSubmit={handleCommentSubmit} className='my-2.5 flex gap-x-3' method="post">
        <label htmlFor="comment-input">
          <img 
            className='w-[50px] max-[576px]:w-[40px]' 
            src={accountInfo.isLoggedIn ? accountInfo.picture : defaultProfile} alt="no profile" 
          />
        </label>
        <div className='border border-stone-200 rounded-md w-full flex focus-within:outline focus-within:outline-2 focus-within:outline-[hotpink] dark:border-stone-700'>
          <input 
            onChange={e => setMsg(e.target.value)}
            value={msg}
            type="text" 
            id="comment-input"
            className='outline-0 px-3 rounded-md w-full bg-[#f9f9f9] dark:bg-black' 
            placeholder='message...'
          />
          <button className='px-2' type='submit'><AiOutlineSend/></button>
        </div>
      </form>
      {/* end: comment input */}
      
      {
        // for each comment
        Object.keys(comments).map((uniqueCommentId: string,idx:number) => {
          const comment = comments[uniqueCommentId];
          return (
            <div className='mb-6 flex gap-x-4' key={uniqueCommentId}>
              <div>

              <img className='w-[50px] h-[50px] max-[576px]:w-[40px] max-[576px]:h-[40px]' src={comment.profilePict} alt="profile picture" />
              </div>
              <div className='w-full'>
                {/* start: name, reply date, edit & delete a comment */}
                <div className='flex justify-between'>
                  <NameDate name={comment.name} date={comment.commentDate}/>

                  <div className='relative' style={{display: comment.id===accountInfo.id ? "block":"none"}}>
                    <button onClick={e=>{
                      const ul = e.currentTarget.nextElementSibling as HTMLUListElement
                      // if the ul already display, we need to automatically cancel the edit msg textarea
                      if(ul.classList.contains("!block")){
                        let thisMsgTextarea: HTMLTextAreaElement = msgTextarea.current[uniqueCommentId].commentTextarea;
                        thisMsgTextarea.toggleAttribute("readOnly")
                        thisMsgTextarea.classList.toggle("!outline-2")
                        thisMsgTextarea.nextElementSibling.classList.toggle("hidden")
                      }
                      ul.classList.toggle("!block")
                    }}>
                      <BsThreeDots />
                    </button>
                    {/* TODO: there is a possibility to simplify this ul */}
                    <ul className='hidden absolute [&>li>button]:border [&>li>button]:bg-zinc-50 [&>li>button]:px-3 [&>li>button]:py-1 [&>li>button]:w-full'>
                      <li>
                        <button onClick={()=>handleEditCommentBtn(uniqueCommentId)} className='hover:bg-fuchsia-200'>Edit</button>
                      </li>
                      <li>
                        <button onClick={()=>handleDeleteCommentBtn(uniqueCommentId)} className='hover:bg-fuchsia-200'>Delete</button>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* end: name, reply date, edit & delete a comment */}

                {/* message */}
                <form 
                  method='put'
                  onSubmit={e=>handleEditCommentSubmit(e,uniqueCommentId)}
                >
                  <textarea 
                    onInput={e=> {
                      const target=e.target as HTMLTextAreaElement
                      target.style.height=""
                      target.style.height = target.scrollHeight.toString() + "px"
                    }}
                    ref={currEle=>msgTextareaRef(currEle,uniqueCommentId)}
                    className="outline outline-0 rounded-md w-full resize-none dark:bg-inherit" 
                    readOnly
                    defaultValue={comment.commentMsg}
                  >
                  </textarea>
                  <button type='submit' className='hidden rounded-lg px-2 py-1 bg-emerald-200 hover:bg-emerald-300 focus:ring-4 focus:ring-emerald-100 dark:text-black'>Save</button>
                </form>

                {/* show input reply & like & dislike & show all replies btn */}
                <div className='text-sm flex gap-x-3 [&>button>svg]:inline'>
                  <button onClick={e=>handleInputReply(e,comment.name)}>
                    <BiReply/> reply
                  </button>
                  <button onClick={()=>handleLikeDislikeBtn(uniqueCommentId,"like")}>
                    <LikeDislikeSvg accountId={accountInfo.id} type="like" likeDislikes={comment.likeDislikes}/>
                    {comment.numberOfLikes}
                  </button>
                  <button onClick={()=>handleLikeDislikeBtn(uniqueCommentId,"dislike")}>
                    <LikeDislikeSvg accountId={accountInfo.id} type="dislike" likeDislikes={comment.likeDislikes}/>
                    {comment.numberOfDislikes}
                  </button>
                  <button onClick={e=>handleShowReplies(e,uniqueCommentId)}>
                    <RxEyeOpen/>
                    {Object.keys(comment.replies).length} reply
                  </button>
                </div>
        
                {/* start: reply input */}
                <CommentReplyInput 
                  setComments={setComments}
                  uniqueCommentId={uniqueCommentId}
                  accountInfo={accountInfo}
                  articleId={articleId}
                />
                {/* end: reply input */}

                {/* show all replies for currently selected comment by the user */}
                <div className='hidden'>
                {
                  // for each reply
                  Object.keys(comment.replies).map((uniqueReplyId:string, idx:number) => {
                    const reply = (comment.replies as Replies)[uniqueReplyId]
                    return (
                      <div className='mt-6 flex gap-x-4' key={uniqueReplyId}>
                        <div>

                        <img className='w-[50px] h-[50px] max-[576px]:w-[40px] max-[576px]:h-[40px]' src={reply.profilePict} alt="" />
                        </div>
                        <div className='w-full'>
                          {/* start: name, reply date, edit & delete a reply */}
                          <div className='flex justify-between'>
                          <NameDate name={reply.name} date={reply.replyDate}/>


                            <div className='relative' style={{display: reply.id===accountInfo.id ? "block":"none"}}>
                              <button onClick={e=>{
                                const ul = e.currentTarget.nextElementSibling as HTMLUListElement
                                // if the ul already display, we need to automatically cancel the edit msg textarea
                                if(ul.classList.contains("block")){
                                  let thisMsgTextarea: HTMLTextAreaElement = msgTextarea.current[uniqueCommentId].replyTextarea[idx];
                                  thisMsgTextarea.toggleAttribute("readOnly")
                                  thisMsgTextarea.classList.toggle("!outline-2")
                                  thisMsgTextarea.nextElementSibling.classList.toggle("hidden")
                                }
                                ul.classList.toggle("!block")
                              }}>
                                <BsThreeDots />
                              </button>
                              <ul className='hidden absolute [&>li>button]:border [&>li>button]:bg-zinc-50 [&>li>button]:px-3 [&>li>button]:py-1 [&>li>button]:w-full'>
                                <li>
                                  <button onClick={()=>handleEditCommentBtn(uniqueCommentId,idx)} className='hover:bg-fuchsia-200'>Edit</button>
                                </li>
                                <li>
                                  <button onClick={()=>handleDeleteCommentBtn(uniqueReplyId)} className='hover:bg-fuchsia-200'>Delete</button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {/* end: name, reply date, edit & delete a reply */}


                          {/* message */}
                          <form 
                            method='put'
                            onSubmit={e=>handleEditCommentSubmit(e,uniqueCommentId,idx)}
                          >
                            <textarea 
                              onInput={e=> {
                                const target=e.target as HTMLTextAreaElement
                                target.style.height=""
                                target.style.height = target.scrollHeight.toString() + "px"
                              }}
                              ref={currEle=>msgTextareaRef(currEle,uniqueCommentId,idx)}
                              className="outline outline-0 rounded-md w-full resize-none dark:bg-inherit" 
                              readOnly
                              defaultValue={reply.replyMsg}
                            >
                            </textarea>
                            <button type='submit' className='hidden rounded-lg px-2 py-1 bg-emerald-200 hover:bg-emerald-300 focus:ring-4 focus:ring-emerald-100 dark:text-black'>Save</button>
                          </form>

                          {/* show input reply & like & dislike btn */}
                          <div className='text-sm flex gap-x-3 [&>button>svg]:inline '>
                            <button onClick={e=>handleInputReply(e,reply.name)}>
                              <BiReply/> reply
                            </button>
                            <button onClick={()=>handleLikeDislikeBtn(uniqueReplyId,"like")}>
                              <LikeDislikeSvg accountId={accountInfo.id} type="like" likeDislikes={reply.likeDislikes}/>
                              {reply.numberOfLikes}
                            </button>
                            <button onClick={()=>handleLikeDislikeBtn(uniqueReplyId,"dislike")}>
                              <LikeDislikeSvg accountId={accountInfo.id} type="dislike" likeDislikes={reply.likeDislikes}/>
                              {reply.numberOfDislikes}
                            </button>
                          </div>
                    
                          {/* start: reply input */}
                          <CommentReplyInput 
                            setComments={setComments}
                            uniqueCommentId={uniqueCommentId}
                            accountInfo={accountInfo}
                            articleId={articleId}
                          />
                          {/* end: reply input */}

                        </div>
                      </div>
                    )
                  })
                }
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

interface NameDateProps{
  name: string,
  date: string
}
const NameDate = ({name,date}: NameDateProps) => {
  return (
    <div>
      <span className='text-xl font-semibold mr-3'>{name}</span>
      <dfn title='dd/mm/yyyy'>
        <span className='text-gray-400'>{date}</span>
      </dfn>
    </div>
  )
}

export default CommentSection
//asdasddfg