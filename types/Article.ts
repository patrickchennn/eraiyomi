export interface Article{
  _id: string,
  titleArticle:{
    title: string,
    URLpath: string,
  },
  shortDescription: string,
  publishedDate: string,
  status:"published"|"unpublished"
  likeDislike:{
    totalLike: number,
    totalDislike:number,
    users:Array<{
      email:string,
      statusRate:boolean
    }>
  },
  editHistory:{
    date:string[]
  },
  author: string,
  email: string,
  category: string[],
  commentsIdRef: string,
  articleAssetIdRef: string
}

export interface ArticlesAnalytic{
  [titlePage:string]: {
    screenPageViews:number
    pagePath:string
  }
}

export interface ArticleReducer{
  isLoading?: boolean,
  isSuccess?: boolean,
  isError?: boolean,
  message: Article[],
}

export interface POST_ReqBodyArticle{
  title: string,
  shortDescription: string;
  status:"published"|"unpublished"
  author: string;
  email: string
  category: string[];
}