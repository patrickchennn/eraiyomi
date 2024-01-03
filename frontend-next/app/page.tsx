import "@/assets/globals.css"
import { GoogleIdentityRes } from "../../types/User";
import { getArticles } from "@/services/articleService";
import HomeTemplate from "@/components/HomeTemplate";
import { getArticlesAnalytic } from "@/services/articleAnalyticService";
import chalk from "chalk";

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
  console.log(chalk.blue("@App()"))

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
      <HomeTemplate initArticles={articles.data} articlesAnalytic={articlesAnalyticData}/>
    </>
  )
}
