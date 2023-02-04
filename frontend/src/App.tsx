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
import _217ContainsDuplicate from './pages/217-contains-duplicate/_217ContainsDuplicate';
import Home from "./pages/Home";
import DetailProfile from "./pages/DetailProfile";
import { Account, GoogleIdentityRes } from "../types/Account";
import { getArticles } from "./features/articleService";
import ErrorPage from "./components/ErrorPage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { GetArticlesRes } from "../types/Article";

declare global {
  interface Window { google: any,urlAPI:string; }
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
  const [articlesState,setArticlesState] = React.useReducer(setArticles,initArticlesState)
  
  const [accountInfo,setAccountInfo] = React.useState<Account>({
    id: "",
    name: "",
    email: "",
    picture: "",
    isLoggedIn: false,
  })


  React.useEffect(() => {

    (async function(){
      const data = await getArticles()
      // if fetch is success
      if(data)
        setArticlesState({type: actions.isSuccess, payload:{message: data}})
      else
        setArticlesState({type: actions.isError, payload:{message: data}})
    })();
    
    // If in development mode, then there is no need to get the g.analytics
    if(
      process.env.MODE==="development" || 
      window.location.hostname==="localhost" || 
      window.location.hostname.startsWith("192.168")
    ){

    }else if(process.env.MODE==="production"){
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
        apiKey: "AIzaSyCwnm8ju92PdiQ1XOS9Np95G5bEVd0aTUo",
        authDomain: "eraiyomi.firebaseapp.com",
        projectId: "eraiyomi",
        storageBucket: "eraiyomi.appspot.com",
        messagingSenderId: "604605488847",
        appId: "1:604605488847:web:223ddc0fc68ffa2d9a21ba",
        measurementId: "G-Q879BR7270"
      };
      
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      // console.log(app)
      // console.log(analytics)
    }
  }, [])





  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<ErrorPage/>} element={<Layout />}>
        <Route index path="/" element={<Home />}/>
        <Route path="/217-contains-duplicate" element={<_217ContainsDuplicate />}/>
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
        accountInfoStates:[accountInfo,setAccountInfo],
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
