import React from "react";
import "./assets/app.css"
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route
} from "react-router-dom";

import Layout from './components/Layout';
import Article1 from './pages/article1/Article1';
import Home from "./pages/Home";
import DetailProfile from "./pages/DetailProfile";
import { Article } from "../types/Article";
import { GoogleIdentityRes } from "../types/Account";
import { getArticles } from "./features/articleService";
import ErrorPage from "./components/ErrorPage";

declare global {
  interface Window { google: any; }
}


const actions = {
  isLoading:"isLoading",
  isSuccess: "isSuccess",
  isError: "isError",
  message:"message"
}

const App = ({rootElement}: {rootElement: HTMLDivElement}) => {
  const setArticles = (_:unknown, action: any) => {
    switch(action.type){
      case actions.isSuccess:
        return {
          isError: false, 
          isLoading: false, 
          isSuccess: true,
          message: action.payload.message
        }
      ;
      case actions.isError:
        return {
          isError: true, 
          isLoading: false, 
          isSuccess: false,
          message: action.payload.message
        }
      ;
      default:
        throw new Error("error at setArticles")
      ;
    }
  }
  const initArticlesState = {isLoading:true,isSuccess:false,isError:false,message:""}
  const [articlesState,dispatch] = React.useReducer(setArticles,initArticlesState)

  React.useEffect(() => {
    (async function(){
      const data = await getArticles()
      // if fetch is success
      if(data)
        dispatch({type: actions.isSuccess, payload:{message: data}})
      else
        dispatch({type: actions.isError, payload:{message: data}})
    })();
    
  }, [])





  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<ErrorPage/>} element={<Layout rootElement={rootElement} />}>
        <Route index path="/" element={<Home rootElement={rootElement}/>}/>
        <Route path="/article1" element={<Article1 />}/>
        {/* <Route path="/sign-in" element={<SignIn SetAccountInfo={SetAccountInfo}/>}/> */}
        <Route path="/detail-profile" element={<DetailProfile />}/>
      </Route>
    )
  )

  return (
    <>
    <AppContext.Provider value={{articlesState}}>
      <RouterProvider 
        router={router} 
        fallbackElement={<>wait</>}
      />
    </AppContext.Provider>
    </>
  )
}






export default App

export const AppContext = React.createContext(null)

export const authenticateContext = React.createContext(null)



export interface AccountInfo{
  isLoggedIn:boolean,
  googleIdentityRes: GoogleIdentityRes | null
}
