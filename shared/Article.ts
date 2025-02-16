export interface Article{
  // User input required
  title: string,
  shortDescription: string,
  status:"published"|"unpublished"
  category: string[]
  totalWordCounts: number
  contentStructureType: "markdown"
  // User input not-required
  thumbnail: {
    fileName:string
    relativePath: string
    mimeType: string
  } | null
  content: {
    fileName:string
    relativePath: string
    mimeType: string
  } | null
  imageContent: {
    fileName:string
    relativePath: string
    mimeType: string
  }[]
  // Server generated data
  _id: string,
  userIdRef: string
  publishedDate: string
  editHistory:{
    date:string[]
  },
  likeDislike:{
    totalLike: number,
    totalDislike:number,
  },
}

export interface ArticlesAnalytic{
  [articleId: string]:{
    hostName: string
    pageTitle: string
    pagePath: string
    pagePathPlusQueryString: string
    country: string
    region: string
    city: string
    screenPageViews: string
  }
}

export interface ArticlePostRequestBody {
  title: string,
  shortDescription: string,
  status:"published"|"unpublished"
  category: string[]
  totalWordCounts: number
  contentStructureType: "markdown"
}