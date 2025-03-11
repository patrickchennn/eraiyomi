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
  const articlesOnQuery = articleModel.find({})
  // console.log(articlesOnQuery,articlesOnQuery instanceof Query)

  switch(sort){
    case "newest":
      articlesOnQuery.sort('-publishedDate')
      break;
    case "oldest":
      articlesOnQuery.sort('publishedDate')
      break;
    case "popular":
    case "unpopular":
    default:
      break
  }

  switch(status){
    case "published":
      articlesOnQuery.where("status").equals("published");
      break;
    case "unpublished":
      articlesOnQuery.where("status").equals("unpublished");
      break;
    // default value is get "all" articles
    default:
      break;
  }

  if(search){
    let regex = new RegExp(search, "i");
    // console.log("regex=",regex)
    articlesOnQuery.regex('title', regex);
  }

  let articles = await articlesOnQuery.exec()
  // console.log("articles=",articles)

  // Eventhough `articles` is empty `[]` (which is valid), it shouldn't be `null`.
  // articles = null; // uncomment this to test below condition
  if(articles===null){

    return retResErrJson(res,500,"fail on fetching data article from database")

  }

  return res.status(200).json({
    data:articles
  })
}
