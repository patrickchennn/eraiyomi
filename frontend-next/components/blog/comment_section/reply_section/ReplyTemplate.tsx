import GenerateNameDate from "../GenerateNameDate"
import GenerateProfilePict from "../GenerateProfilePict"
import EditReplyInput from "./EditReplyInput"
import LikeReply from "./LikeReply"
import ModifyReply from "./ModifyReply"
import ReplyInput from "./ReplyInput"
import ReplyInputBtn from "./ReplyInputBtn"
import { ArticleCommentReply } from "@patorikkuuu/eraiyomi-types"
import { User } from "@patorikkuuu/eraiyomi-types"
import { useEffect, useState } from "react"

interface ReplyTemplateProps{
  articleId: string
  commentId: string
  initReplies: ArticleCommentReply[]
  user: User|undefined
}
export default function ReplyTemplate({
  articleId,
  commentId,
  initReplies,
  user
}: ReplyTemplateProps) {

  const [replies,setReplies] = useState<ArticleCommentReply[]>(initReplies);

  useEffect(() => {
    // Update the state with the new initReplies value when it changes
    setReplies(initReplies);
  }, [initReplies]);


  return (
    <>
    {replies.map(reply => {
      return (
        <div className="mt-6 flex gap-x-2" key={reply.replyId}>
          <GenerateProfilePict src={reply.profilePictureUrl} />
          <div className="w-full">
            {/* start: name, reply date, edit & delete a reply */}
            <div className="flex justify-between">
              <GenerateNameDate name={reply.displayName} date={reply.publishedAt}/>
                {
                  user?.userId===reply.userId?
                  <ModifyReply 
                    articleId={articleId}
                    commentId={commentId}
                    replyId={reply.replyId}
                    setReplies={setReplies}
                  /> :
                  <></>
                }
            </div>
            {/* end: name, reply date, edit & delete a reply */}

            {/* edit the reply input section */}
            {
              user?.userId===reply.userId?
              
              <EditReplyInput 
                articleId={articleId}
                commentId={commentId}
                replyId={reply.replyId}
                originalMsg={reply.message}
                setReplies={setReplies}
              />
              :
              <p>{reply.message}</p>
            }

            {/* show input reply & like & show all replies btn */}
            <div className="flex flex gap-x-1.5">
              <ReplyInputBtn 
                displayName={reply.displayName}
                commentId={reply.replyId}
              />

              <LikeReply 
                articleId={articleId}
                commentId={commentId}
                reply={reply}
                setReplies={setReplies}
              />
            </div>

            {/* start: reply input */}
            <ReplyInput
              articleId={articleId}
              commentId={reply.replyId}
              user={user}
            />
            {/* end: reply input */}

          </div>
        </div>
      )
    })}
    </>
  )
}
