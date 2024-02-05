import { User } from "@patorikkuuu/eraiyomi-types"


import { getArticlesAnalytic } from "@/services/articleAnalyticService"
import chalk from "chalk"
import UserBtns from "./verified-user/UserBtns"
import { GET_articlesAsset } from "@/services/article-asset/GET_articlesAsset"
import getArticles from "@/services/article/getArticles"

interface VerifiedUserProps{
  user: User
}
export default async function VerifiedUser({user}:VerifiedUserProps){
  console.log(chalk.blue("@VerifiedUser()"))

  const articles = await getArticles({sort:"newest" })
  // console.log("articles=",articles)

  if(!articles.data){
    return (
      <>
        <h1>{articles.status}</h1>
        <p>{articles.errMsg}</p>
      </>
    )
  }

  const articlesAnalytic = await getArticlesAnalytic()
  // console.log("articlesAnalytic=",articlesAnalytic)

  const articlesAsset = await GET_articlesAsset()
  // console.log("articlesAsset=",articlesAsset)


   

  return (
    <div className="my-0 mx-auto rounded w-1/2 bg-white flex gap-x-1">
      <div>
        <ul>
          <UserBtns 
            user={user} 
            articles={articles.data}
            articlesAnalytic={articlesAnalytic}
            articlesAsset={articlesAsset}
          />
        </ul>
      </div>

      <div className="w-full" id="show-selected-component">
      </div>
    </div>
  )
}