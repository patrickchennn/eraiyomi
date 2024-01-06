// service
import { POST_verify } from "@/services/userService";
import { getArticleComments } from "@/services/commentService";

import { cookies } from "next/headers";

// ./reply_section
import ReplyInput from "./reply_section/ReplyInput";
import ShowReplies from "./reply_section/ShowReplies";
import ReplyInputBtn from "./reply_section/ReplyInputBtn";

import EditCommentInput from "./EditCommentInput";
import GenerateNameDate from "./GenerateNameDate";
import LikeBtn from "./LikeBtn";
import ModifyCommentToolbar from "./ModifyCommentToolbar";
import NewCommentInput from "./NewCommentInput";
import GenerateProfilePict from "./GenerateProfilePict";

import { User } from "@patorikkuuu/eraiyomi-types";

import AuthUIHandler from "@/components/AuthUIHandler";
import isEmpty from "lodash.isempty";


interface CommentMainSectionProps {
  articleId: string;
  style: string;
}
export default async function CommentMainSection({articleId,style}: CommentMainSectionProps){
  const commentsRes = await getArticleComments(articleId,["comments"])
  if(!commentsRes.data){
    return (
      <>
        <h1>{commentsRes.status}</h1>
        <p>{commentsRes.errMsg}</p>
      </>
    )
  }
  // console.log("comments=",comments)
  const cookieStore = cookies()

  const userCredToken = cookieStore.get('userCredToken')
  // console.log("userCredToken=",userCredToken)

  let userInfo: undefined | User
  if(!isEmpty(userCredToken)){
    userInfo = await POST_verify(userCredToken.value)
    // console.log("userInfo=",userInfo)
  }
  // logWithLocation(`userInfo=`,userInfo);

  const comments = commentsRes.data

  // render
  return (
    <div className={style}>
      <h1 className="font-black text-2xl">{comments.totalCommentsCount} Comments</h1>
      <hr />

      {/* server component */}
      <AuthUIHandler user={userInfo}/>
  
      {/* start: for user who want to comment for the first time */}
      <NewCommentInput articleId={articleId} user={userInfo} userCredToken={userCredToken?.value}/>
      <hr />
      {/* end.*/}

      <ul data-cy="render-comments">
        {
          comments&&comments.items.map(comment => {
            return (
              <div className="mt-3 mb-6 flex gap-x-2" key={comment._id}>
                {/* photo profile */}
                {/* server component */}
                <GenerateProfilePict src={comment.profilePictureUrl}/>
          
                <div className="w-full">
                  {/* start: 
                  - generating basic info such as name and comment on date
                  - edit & delete comment feature
                  */}
                  <div className="flex justify-between">
                    {/* server component */}
                    <GenerateNameDate 
                      name={comment.displayName} 
                      date={comment.publishedAt} 
                    />
                    
                    {
                      userInfo?.userId===comment.userId ? 
                        // client component
                        <ModifyCommentToolbar
                          articleId={articleId}
                          commentId={comment._id}
                        />
                        :
                        // server component
                        <></>
                    }
                  </div>
                  {/* end. */}
                  
                  {/* edit the comment input section */}
                  {
                    userInfo?.userId===comment.userId ? 
                      // client component
                      <EditCommentInput 
                        articleId={articleId}
                        commentId={comment._id}
                        originalMsg={comment.message}
                      />
                      :
                      // server component
                      <p>{comment.message}</p>
                    
                  }
                  


                  {/* end: reply input */}
                  {/* 
                  show input reply & 
                  like &
                  show all replies btn 
                  */}
                  <div className="flex gap-x-1.5">
                    <ReplyInputBtn commentId={comment._id} displayName={comment.displayName}/>
          
                    {/* CURRENTLY: client component */}
                    <LikeBtn 
                      articleId={articleId}
                      comment={comment}
                    />
          
                    {/* CURRENTLY: client component */}
                    <ShowReplies 
                      articleId={articleId} 
                      comment={comment}
                    />

                  </div>
                  
                  {/* start: reply input */}
                  {/* CURRENTLY: client component */}
                  <ReplyInput
                    articleId={articleId}
                    commentId={comment._id}
                    user={userInfo}
                  />

                  <div data-cy="render-replies" className="hidden" id={`${comment._id}-replies-container`}></div>
                  
                </div>
              </div>
            )
          })
        }
      </ul>
    </div>
  );
};
