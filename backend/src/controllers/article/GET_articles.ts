import { Request,Response } from "express"
import { articleModel } from "../../schema/articleSchema.js"
import retResErrJson from "../../utils/retResErrJson.js"

/**
 * @desc Get all article
 * @endpoint GET `/api/articles?sort=${sort}&status=${status}`
 * @access public
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

  let articleDatas = await articleDatasOnQuery.exec()
  // console.log("articleDatas=",articleDatas)

  // eventhough `articleDatas` is empty `[]` (which is valid), it shouldn't be null.
  // articleDatas = null; // uncomment this to test below condition
  if(articleDatas===null){

    return retResErrJson(res,500,"fail on fetching data article from database")

  }

  return res.status(200).json({
    message:"Successfully get all articles",
    data:articleDatas
  })
}
