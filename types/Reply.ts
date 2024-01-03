export interface ArticleCommentReplyState{
  parentCommentId: string,
  replies:ArticleCommentReply[]
}


export interface ArticleCommentReply{
  userId: string,
  displayName: string,
  profilePictureUrl: string,
  like: {
    likeCount: number,
    users: {
      [accoundId: string]:boolean
    }
  },
  message: string,
  publishedAt: string,
  updatedAt: string,
  totalRepliesCount: number,
  replyId: string
}

export interface ArticleCommentReplyRes{
  _id: string,
  articleIdRef: string,
  commentsIdRef: string,
  items:{
    parentCommentId:string,
    replies:ArticleCommentReply[]
  }[]
}