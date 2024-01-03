export interface ArticleComment{
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
  _id: string
}

export interface ArticleCommentResponse{
  _id: string,
  articleIdRef: string,
  totalCommentsCount: number
  items:ArticleComment[]
}
