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
import { Account, GoogleIdentityRes } from "../types/Account";
import { getArticles } from "./features/articleService";
import ErrorPage from "./components/ErrorPage";
import { rootElement } from ".";

declare global {
  interface Window { google: any; }
}


const actions = {
  isLoading:"isLoading",
  isSuccess: "isSuccess",
  isError: "isError",
  message:"message"
}

const App = () => {
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
  
  const [accountInfo,setAccountInfo] = React.useState<Account>({
    id: "",
    name: "",
    email: "",
    picture: "",
    isLoggedIn: false,
  })


  React.useEffect(() => {
    // window.document.title = 'new title';

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
      <Route errorElement={<ErrorPage/>} element={<Layout />}>
        <Route index path="/" element={<Home />}/>
        <Route path="/article1" element={<Article1 />}/>
        {/* <Route path="/sign-in" element={<SignIn SetAccountInfo={SetAccountInfo}/>}/> */}
        <Route path="/detail-profile" element={<DetailProfile />}/>
      </Route>
    )
  )

  return (
    <>
    <AppContext.Provider 
      value={{
        articlesState,
        accountInfoStates:[accountInfo,setAccountInfo]
      }}>
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
