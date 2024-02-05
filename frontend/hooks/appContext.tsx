"use client";

import { POST_verify } from "@/services/user/POST_verify";
import getCookie from "@/utils/getCookie";
import { Article } from "@patorikkuuu/eraiyomi-types";
import { User, UserRes } from "@patorikkuuu/eraiyomi-types";
import chalk from "chalk";

import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";

interface AppContextType{
  articlesState:[ 
    articles: Article[],
    setArticles:Dispatch<SetStateAction<Article[]>>
  ],
  userInfoStates:[
    userInfo: User,
    setUserInfo: Dispatch<SetStateAction<User>>
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
      userId: "",
      name: "",
      username:"",
      email:"",
      profilePictureUrl: "",
      statusReq:"fail"
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
  
  const [userInfo,setUserInfo] = useState<User>({
    _id:"",
    userId: "",
    username: "",
    name:"",
    email:"",
    profilePictureUrl: "",
    statusReq:"loading"
  })

  const [theme,setTheme] = useState<"light"|"dark">("light")
  
  useEffect(()=>{
    
    let userCredToken: string | null = getCookie("userCredToken");

    // console.log("userCredToken",userCredToken)
    if(userCredToken==null) {
      setUserInfo(prev => ({
        ...prev,
        statusReq:"fail"
      }))
      console.log(chalk.blue(`[info]: userCredToken is ${userCredToken}`))
      return 
    }

    
    // remove the first and last character, in this case, removing the the tick ("")
    userCredToken = userCredToken.slice(1,-1);
    let data: UserRes|undefined
    (async function(){
      data = await POST_verify(userCredToken)
      if(data){
        // console.log(data)
        setUserInfo({
          ...data,
          statusReq:"success"
        })
      }else{
        setUserInfo(prev => ({
          ...prev,
          statusReq:"fail"
        }))
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