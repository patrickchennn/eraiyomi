import { ArticlesAnalytic } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"
import { baseURL } from "../config"

export const getArticlesAnalytic = async () => {
  let res!: Response
  let data
  const httpMethod = "GET"

  try{
    res = await fetch(`${baseURL}/articles/analytic`)
    data = await res.json()
    if(!res.ok){
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }
  }
  // @ts-ignore
  catch(err: Error){
    console.error(chalk.red.bgBlack(err.message))
    return undefined
  }


  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${res.status}`) )
  return data as ArticlesAnalytic
}