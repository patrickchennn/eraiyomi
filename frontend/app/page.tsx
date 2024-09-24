import "@/assets/globals.css"
import { GoogleIdentityRes } from "@patorikkuuu/eraiyomi-types";
import HomeTemplate from "@/components/HomeTemplate";
import { getArticlesAnalytic } from "@/services/articleAnalyticService";
import chalk from "chalk";
import getArticles from "@/services/article/getArticles";

declare global {
  const google: typeof import('google-one-tap');
}
declare global{
  interface Window { 
    urlAPI:string; 
  }
}


export interface AccountInfo{
  isLoggedIn:boolean,
  googleIdentityRes: GoogleIdentityRes | null
}




export default async function App(){
  console.log(chalk.yellow.bgBlack("@App()"))

  const articles = await getArticles({
    sort:"newest",status:"published"
  },"no-store")
  // console.log("articles=",articles)
  
  if(!articles.data){
    return (
      <>
        <h1>{articles.status}</h1>
        <p>{articles.errMsg}</p>
      </>
    )
  }

  const articlesAnalyticData = await getArticlesAnalytic()
  // console.log("articlesAnalyticData=",articlesAnalyticData)

  



  // IF fetch is succeed AND the (dynamically) imported blog page components is done
    // console.log(articlesState,components)
  return (
    <>
      <HomeTemplate 
        initArticles={articles.data} 
        articlesAnalytic={articlesAnalyticData}
      />
    </>
  )
}
