"use client";

import { postVerifyUser } from "@/services/user/userService";
import getCookie from "@/utils/getCookie";
import { Article } from "@shared/Article";
import { User } from "@shared/User";
import chalk from "chalk";

import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";

interface AppContextType{
  articlesState:[ 
    articles: Article[],
    setArticles:Dispatch<SetStateAction<Article[]>>
  ],
  userInfoStates:[
    userInfo: User|null,
    setUserInfo: Dispatch<SetStateAction<User|null>>
  ],
  themeState:[
    theme:"dark"|"light",
    setTheme:Dispatch<SetStateAction<"dark"|"light">>
  ]
}
// Provide initial values that match the shape of AppContextType
const initialContextValue: AppContextType = {
  articlesState: [[], () => {}],
  userInfoStates: [
    {
      _id:"",
      name: "",
      username:"",
      email:"",
      profilePictureUrl: "",
      articleIdRef:[]
    },
    () => {}
  ],
  themeState:["light",()=>{}]
};

export const AppContext = createContext<AppContextType>(initialContextValue)



interface AppContextProviderProps{
  children:JSX.Element,
}
export const AppContextProvider = ({children}: AppContextProviderProps) => {
  
  const [articles,setArticles] = useState<Article[]>([])
  
  const [userInfo,setUserInfo] = useState<User|null>(null)

  const [theme,setTheme] = useState<"light"|"dark">("light")
  
  useEffect(()=>{
    
    let userCredToken: string | null = getCookie("userCredToken");

    // console.log("userCredToken",userCredToken)
    if(userCredToken==null) {
      setUserInfo(null)
      console.log(chalk.blueBright.bgBlack(`[INF]: userCredToken is ${userCredToken}`))
      return 
    }

    
    // remove the first and last character, in this case, removing the the tick ("")
    userCredToken = userCredToken.slice(1,-1);
    (async function(){
      const data = await postVerifyUser(userCredToken)

      if(data.data){
        // console.log(data)
        setUserInfo({
          ...data.data,
        })
      }else{
        setUserInfo(null)
      }
    })()

  },[])

  return (
    <AppContext.Provider value={{
      articlesState:[articles,setArticles],
      userInfoStates:[userInfo,setUserInfo],
      themeState:[theme,setTheme]
    }}>
      {children}
    </AppContext.Provider>
  )
}


export const useArticlesState = () => {
  const appContext = useContext(AppContext)
  return appContext.articlesState
}

export const useUserInfo = () => {
  const appContext = useContext(AppContext)
  return appContext.userInfoStates
}

export const useThemeState = () => {
  const appContext = useContext(AppContext)
  return appContext.themeState
}