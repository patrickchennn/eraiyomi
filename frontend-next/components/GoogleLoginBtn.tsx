"use client"

import { POST_verify } from '@/services/userService';
import { CredentialResponse } from 'google-one-tap';
import {useCallback} from 'react'
import { useRouter } from 'next/navigation'
import { useUserInfo } from '@/hooks/appContext';

interface GoogleLoginBtnProps{
}
export default function GoogleLoginBtn({}: GoogleLoginBtnProps){
  // hooks
  const [_,setUserInfo] = useUserInfo()
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const googleLoginBtnRef = useCallback((elem: HTMLDivElement)=>{
    // const test = document.querySelector(".g_id_signin")
    // console.log(test)
    
    // Initialize and render the Google login button on the client side
    // console.log("googleLoginBtnRef.current=",googleLoginBtnRef.current)
    google.accounts.id.initialize({
      client_id:"230251855708-ag2ddqf9luk40cdkgakgfljdl3s8bmp2.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      context: "signin",
    });
    // window.google.accounts.id.prompt()
  
    google.accounts.id.renderButton(elem, {
      type: "standard",
      shape: "rectangular",
      theme: "outline",
      text: "continue_with",
      size: "large",
      logo_alignment: "left",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  const router = useRouter()





  // methods
  /**
   * @desc Handling the response from google. Send some of the account information to the server because on the back we need to generate a cookie for "keep me signed in" purposes. The cookie has
   * @param googleCredRes A response from google when one is already logged in.
   */
  const handleCredentialResponse = async (
    googleCredRes: CredentialResponse,
  ) => {

    // console.log(googleCredRes)
    // console.log(rememberMeRef.current.checked)

    // send some of the google account info to the server
    const data = await POST_verify(googleCredRes.credential);
    console.log("google login data:",data)
    if(!data){
      setUserInfo(prev=>({...prev,statusReq:"fail"}))
      return console.error("POST_GVerify() response is",data)
    }

    setUserInfo({
      _id: data._id,
      userId: data.userId,
      username: data.username,
      name: data.name,
      profilePictureUrl: data.profilePictureUrl,
      email:data.email,
      statusReq:"success"
    });
    router.refresh()
  };



  // if()

  // render
  return (
    <div>
      <div ref={googleLoginBtnRef}></div>
    </div>
  )
}