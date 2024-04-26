import chalk from "chalk"
import { Request,Response } from "express"
import {isValidObjectId} from "mongoose"
import { articleModel } from "../../schema/articleSchema.js"

/**
 * @desc Get individual article with name as search param
 * @route GET /api/article/?id=${articleId}&title=${title}
 * @access public
 */
export const GET_article = async (req: Request, res:Response) => {
  
  let {id,title} = req.query
  

  console.log(chalk.yellow(`[API] ${req.method} ${req.originalUrl}`))

  const isValid = isValidObjectId(id)
  // // console.log("isValid=",isValid)

  if(!isValid){
    const msg = `400 Bad Request. Article with id "${id}" is an invalid id.\n`
    console.log(chalk.red.bgBlack(msg))
    return res.status(400).json({message:msg})
  }

  
  const articleData = await articleModel.findOne({ 
    $and: [{ "titleArticle.URLpath":title }, { _id:id }] 
  });
  
  if(articleData===null){
    const msg = `404 Not Found. Article with id "${id}" or title "${title}" is not found`
    console.log(chalk.red.bgBlack(msg))
    return res.status(404).json({"message":msg})
  }

  console.log(chalk.green(`[API] ${req.method} ${req.originalUrl}`))
  return res.status(200).json(articleData)
}