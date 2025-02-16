"use client"

import { useRef } from 'react'
import {Noto_Serif} from "next/font/google"
import Link from 'next/link'

import { useUserInfo } from '@/hooks/appContext'
import useComponentVisible from '@/hooks/useComponentVisible'

// import GoogleLoginBtn from '../GoogleLoginBtn'

import LoginForm from './LoginForm';
import LoginRegisterBtns from './LoginRegisterBtns';
import RegisterForm from './RegisterForm';

const noto_serif = Noto_Serif({weight:"400",subsets:["latin"]})

export default function Auth() {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const {ref,isComponentVisible,setIsComponentVisible} = useComponentVisible(false);

  const [userInfo,setUserInfo] = useUserInfo()
  // console.log("userInfo=",userInfo)
  
  const signUpFormRef = useRef<HTMLFormElement>(null)
  const signInFormRef = useRef<HTMLFormElement>(null)
  const signInModalRef = useRef<HTMLDivElement>(null)


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if(userInfo!==null){
    return (
      <Link href={'/'+userInfo.username} target="_blank">Profile</Link>
    )
  }


  return (
    <div ref={ref} className='relative'>
      <button onClick={() => setIsComponentVisible(prev=>!prev)}>
        Sign In
      </button>
      {
        isComponentVisible &&
        <div className={`border rounded-lg py-5 px-10 bg-white dark:bg-zinc-950 peer-checked:block cursor-default shadow-[0px_0px_16px_6px_#f2f2f2_inset,-3px_-4px_7px_0px_#a8a8a8_inset] ${noto_serif.className} absolute z-[99] right-0 top-[50px] dark:dark-single-component dark:shadow-[0px_0px_16px_6px_#151515_inset,-3px_-4px_7px_0px_#1e1e1e_inset]`} ref={signInModalRef} data-cy="authentication-modal">
          {/* buttons */}
          <LoginRegisterBtns signInFormRef={signInFormRef} signUpFormRef={signUpFormRef}/>

          {/* forms */}
          <div>
            {/* sign in form*/}
            <LoginForm 
              signInFormRef={signInFormRef} 
              setUserInfo={setUserInfo}
              // unameEmailState={unameEmailState}
              // passwordState={passwordState}
            />

            {/* sign up form */}
            <RegisterForm signUpFormRef={signUpFormRef}/>
          </div>
        </div >
      }
    </div>
  )
}