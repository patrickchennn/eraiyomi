"use client"

import { useRef, useState } from 'react'
import {Noto_Serif} from "next/font/google"
import { postLoginTraditional, POST_user } from '@/services/userService'
import { ReqBodyLoginTraditional, ReqBodyRegisterUser } from '@patorikkuuu/eraiyomi-types'
import isEmail from 'validator/lib/isEmail';
import { useUserInfo } from '@/hooks/appContext'
import Link from 'next/link'
import useComponentVisible from '@/hooks/useComponentVisible'
import GoogleLoginBtn from '../GoogleLoginBtn'

const noto_serif = Noto_Serif({weight:"400",subsets:["latin"]})



interface SignInModalProps{
}
export default function SignInModal({}: SignInModalProps) {
  // hooks
  const {ref,isComponentVisible,setIsComponentVisible} = useComponentVisible(false);

  const [userInfo,setUserInfo] = useUserInfo()
  
  const signUpFormRef = useRef<HTMLFormElement>(null)
  const signInFormRef = useRef<HTMLFormElement>(null)
  const signInModalRef = useRef<HTMLDivElement>(null)

  const [unameEmail,setUnameEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")

  // methods
  const handleSignIn = async (e:React.FormEvent) => {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    // console.log("target=",target)

    if(!unameEmail||!password) return alert("all the blank field must be filled.")
    const bodyInit: ReqBodyLoginTraditional = {
      username:"",
      email:"",
      password:password,
    }

    // IF: it is an email
    if(isEmail(unameEmail)) bodyInit.email = unameEmail
    else bodyInit.username = unameEmail

    // console.log(bodyInit)

    const data = await postLoginTraditional(bodyInit)
    alert(data.message)
    setUserInfo({
      _id: data._id,
      username:data.username,
      name:data.name,
      userId:data.userId,
      email:data.email,
      profilePictureUrl:data.profilePictureUrl
    })
  }

  const handleSignUp = async (e:React.FormEvent) => {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    // console.log("target=",target)

    const formData = new FormData(target)
    // console.log("formData=",...formData)

    let API_key! :string

    const bodyInit: ReqBodyRegisterUser = {
      username:"",
      email:"",
      password:"",
    }

    for (const [key, value] of formData.entries()) { 
      if(!value.length){
        return alert("all the blank input must be filled")
      }
      if(key==="API_key"){
        API_key = value as string
      }else{
        bodyInit[key as keyof ReqBodyRegisterUser] = value as string
      }
      console.log(key, value);
    }
    const data = await POST_user(bodyInit,API_key)
    alert(data.message)
  }



  // render
  if(userInfo.userId){
    return (
      <>
        <Link href={'/'+userInfo.username} target="_blank">
          profile
        </Link>
      </>
    )
  }


  // render
  return (
    <>
      <div ref={ref} className='relative'>
        <button onClick={() => setIsComponentVisible(prev=>!prev)}>
          Sign In
        </button>
        {
          isComponentVisible &&
          <div className={`border rounded-lg py-5 px-10 bg-white peer-checked:block cursor-default shadow-[0px_0px_16px_6px_#f2f2f2_inset,-3px_-4px_7px_0px_#a8a8a8_inset]  ${noto_serif.className} absolute z-[99] right-0 top-[50px]`} ref={signInModalRef} data-cy="authentication-modal">
            {/* buttons */}
            <div className='text-lg'>
              <button 
                onClick={()=>{
                  signInFormRef.current?.classList.replace("hidden","block")
                  signUpFormRef.current?.classList.replace("block","hidden")
                }}
                className='hover:font-semibold hover:drop-shadow-[0px_0px_3px_#a300ff]'
              >
                Sign In
              </button>
              <span className='font-medium'>｜</span>
              <button 
                className='hover:font-semibold hover:drop-shadow-[0px_0px_3px_#a300ff]'
                onClick={()=>{
                  signInFormRef.current?.classList.replace("block","hidden")
                  signUpFormRef.current?.classList.replace("hidden","block")
                }}
              >
                Sign Up
              </button>
            </div>

            {/* forms */}
            <div>
              {/* sign in */}
              <form 
                className='block [&>input]:border [&>input]:rounded-md [&>input]:px-2 [&>input]:py-1 [&>input]:mb-3 [&>input]:bg-fuchsia-50'
                action="/api/account/login" 
                method="post" 
                onSubmit={handleSignIn}
                ref={signInFormRef}
              >
                <label htmlFor="login-uName-or-email">username/email</label>
                <input 
                  autoComplete='on'
                  type="text" 
                  id="login-uName-or-email" 
                  value={unameEmail} 
                  onChange={e=>setUnameEmail(e.target.value)}
                />

                
                <label htmlFor="login-pass">Password</label>
                <input type="password" id="login-pass" name="login-password" value={password} onChange={e=>setPassword(e.target.value)}/>

                <div className='flex flex-row-reverse'>
                  <button type="submit">Sign In</button>
                </div>
              </form>


              {/* sign up */}
              <div>
                <form 
                  className='hidden [&>input]:border [&>input]:rounded-md [&>input]:px-2 [&>input]:py-1 [&>input]:mb-3 [&>input]:bg-fuchsia-50'
                  // action="/api/account/register" 
                  method="post" 
                  onSubmit={handleSignUp}
                  ref={signUpFormRef}
                >
                  <label htmlFor="register-uName">User Name</label>
                  <input type="text" name="username" id="register-uName"/>

                  <label htmlFor="register-email">Email</label>
                  <input type="email" name="email" id="register-email"/>

                  <label htmlFor="register-pass">Password</label>
                  <input type="password" name="password" id="register-pass" />

                  <label htmlFor="register-key" className='text-gray-500'>Key</label>
                  <input type="password" name="API_key" id="register-key" />

                  <div className='flex flex-row-reverse'>
                    <button type="submit">Sign Up</button>
                  </div>
                </form>
                <GoogleLoginBtn />
              </div>
            </div>
          </div >
        }
      </div>
    </>
  )
}