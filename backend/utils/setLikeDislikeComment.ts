export const setLikeComment = (
  article: any,
  accountId: string,
  uniqueCommentId: string,
  uniqueReplyId: string,
) => {
  // if the uniqueCommentId founded in comments object
  if(!uniqueReplyId){
    // if the user has already liked this comment, it means the user want to unlike it, therefore this condition has that kind of purpose in order to achieve it.
    if(article.comments[uniqueCommentId].likeDislikes.hasOwnProperty(accountId)){
      // this condition basically, a toggle. Toggling between like and unlike. The "unknown" represents the unlike state
      if(article.comments[uniqueCommentId].likeDislikes[accountId]==="unknown"){
        article.comments[uniqueCommentId].numberOfLikes += 1
        article.comments[uniqueCommentId].likeDislikes[accountId] = "like"
      }
      else if(article.comments[uniqueCommentId].likeDislikes[accountId]==="dislike"){
        article.comments[uniqueCommentId].numberOfDislikes -= 1
        article.comments[uniqueCommentId].numberOfLikes += 1
        article.comments[uniqueCommentId].likeDislikes[accountId] = "like"
      }else{
        // if the user who already liked this comment and has been unliked the comment before
        article.comments[uniqueCommentId].likeDislikes[accountId] = "unknown"
        article.comments[uniqueCommentId].numberOfLikes -= 1
      }
    }
    // else, the user has never liked this paricular comment, also it is always executed exactly once
    else{
      article.comments[uniqueCommentId].numberOfLikes += 1
      article.comments[uniqueCommentId].likeDislikes[accountId] = "like"
    }

  }







  // if the uniqueCommentId founded in replies object
  else{
    if(
      article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes.hasOwnProperty(accountId)
    ){
      if(
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId]==="unknown"
      ){
        article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfLikes += 1
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId] = "like"
      }else if(
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId]==="dislike"
      ){
        article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfDislikes -= 1
        article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfLikes += 1
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId] = "like"
      }
      else{
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId] = "unknown"
        article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfLikes -= 1
      }
    }
    else{
      article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfLikes += 1
      article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId] = "like"
    }
  }
  // this fucking function (markModified) is needed in order to make the DB truly changed. it is indeed not enough if this function is not provided, do not ask me why.

  article.markModified(`comments.${uniqueCommentId}`)
}













export const setDislikeComment = (
  article: any,
  accountId: string,
  uniqueCommentId: string,
  uniqueReplyId: string,
) => {
  // if the uniqueCommentId founded in comments object
  if(!uniqueReplyId){
    // if the user has already disliked this comment, it means the user want to undislike it, therefore this condition has that kind of purpose in order to achieve it.
    if(article.comments[uniqueCommentId].likeDislikes.hasOwnProperty(accountId)){
      // this else if condition basically, a toggle. Toggling between dislike and undislike. The "unknown" represents the undislike state
      if(article.comments[uniqueCommentId].likeDislikes[accountId]==="unknown"){
        article.comments[uniqueCommentId].numberOfDislikes += 1
        article.comments[uniqueCommentId].likeDislikes[accountId] = "dislike"
      }else if(article.comments[uniqueCommentId].likeDislikes[accountId]==="like"){
        article.comments[uniqueCommentId].numberOfLikes -= 1
        article.comments[uniqueCommentId].numberOfDislikes += 1
        article.comments[uniqueCommentId].likeDislikes[accountId] = "dislike"
      }
      else{
        // if the user who already liked this comment and has been unliked the comment before
        article.comments[uniqueCommentId].likeDislikes[accountId] = "unknown"
        article.comments[uniqueCommentId].numberOfDislikes -= 1
      }
  
    }
    // else, the user has never liked this paricular comment, also it is always executed exactly once
    else{
      article.comments[uniqueCommentId].numberOfDislikes += 1
      article.comments[uniqueCommentId].likeDislikes[accountId] = "dislike"
    }
  }
  
  
  
  
  
  
  
  
  else{
    if(
      article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes.hasOwnProperty(accountId)
    ){
      if(
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId]==="unknown"
      ){
        article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfDislikes += 1
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId] = "dislike"
      }else if(
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId]==="like"
      ){
        article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfLikes -= 1
        article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfDislikes += 1
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId] = "dislike"
      }
      else{
        article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId] = "unknown"
        article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfDislikes -= 1
      }

    }
    else{
      article.comments[uniqueCommentId].replies[uniqueReplyId].numberOfDislikes += 1
      article.comments[uniqueCommentId].replies[uniqueReplyId].likeDislikes[accountId] = "dislike"
    }
  }
  article.markModified(`comments.${uniqueCommentId}`)
}