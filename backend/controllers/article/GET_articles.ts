import chalk from "chalk"
import { Request,Response } from "express"
import { articleModel } from "../../schema/articleSchema.js"

/**
 * @htttp_verb GET
 * @route `/api/articles?sort=${sort}&status=${status}`
 * @desc Get all article datas
 * @access Private
 */
export const GET_articles = async (
  req:Request<
    {},
    {},
    {},
    {
      sort: string,
      status:string|undefined,
      search:string|undefined
    }
  >, 
  res:Response
) => {
  const {sort,status,search} = req.query
  console.log(chalk.yellow(`[API] ${req.method} ${req.originalUrl}`))
  
  
  const articleDatasOnQuery = articleModel.find({})
  // console.log(articleDatasOnQuery,articleDatasOnQuery instanceof Query)
  switch(sort){
    case "newest":
      articleDatasOnQuery.sort('-publishedDate')
      break;
    case "oldest":
      articleDatasOnQuery.sort('publishedDate')
      break;
    case "popular":
    case "unpopular":
    default:
      break
  }

  switch(status){
    case "published":
      articleDatasOnQuery.where("status").equals("published");
      break;
    case "unpublished":
      articleDatasOnQuery.where("status").equals("unpublished");
      break;
    // default value is get "all" articles
    default:
      break;
  }

  if(search){
    let regex = new RegExp(search, "i");
    // console.log("regex=",regex)
    articleDatasOnQuery.regex('titleArticle.title', regex);
  }

  const articleDatas = await articleDatasOnQuery.exec()
  // console.log("articleDatas=",articleDatas)

  // eventhough `articleDatas` is empty `[]` it shouldn't be null.
  if(articleDatas===null){
    console.log(chalk.red(`[API] GET ${req.method} ${req.originalUrl} 500\n`))
    return res.status(500).json({message:"fail on fetching data article from database"})
  }

  console.log(chalk.green(`[API] ${req.method} ${req.originalUrl}`))
  return res.status(200).json(articleDatas)
}
