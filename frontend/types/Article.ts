export interface Replies{
  [uniqueAccountId: string]:{
    name: string,
    numberOfLikes: number,
    numberOfDislikes: number,
    replyDate: string
    editDate: string,
    replyMsg: string
    profilePict: string,
    likeDislikes:{},
    id: string
  }
}

export interface Comments{
  [uniqueAccountId: string]:{
    name: string,
    numberOfLikes: number,
    numberOfDislikes: number,
    commentMsg: string,
    commentDate: string,
    editDate: string,
    replies: Replies | {},
    profilePict: string,
    likeDislikes:{},
    id: string
  }
}

export interface Article{
  _id: string,
  path: string,
  titleArticle: string,
  shortDescription: string,
  publishedDate: string,
  publishedDateVerbose: string,
  numberOfLikes: number,
  likes:{
    [email: string]:boolean
  },
  author: string,
  keywords: string[],
  comments: Comments | {},
}

export interface ArticlesState{
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
  message: any,
}

export interface GetArticlesRes{
  articleDatas:Article[],
  dataAnalytics:{
    [pagePath: string]:{
      activeUsers: string
      screenPageViews: string
    },
  }
}