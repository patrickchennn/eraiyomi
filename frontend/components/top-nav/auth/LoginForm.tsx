"use client"

import { postLogin } from "@/services/user/userService"
import { User, UserLoginRequestBody } from "@shared/User"
import { Dispatch, RefObject, SetStateAction, useState } from "react"
import isEmail from "validator/lib/isEmail"

interface LoginFormProps {
  signInFormRef: RefObject<HTMLFormElement>
  setUserInfo: Dispatch<SetStateAction<User | null>>
}
const LoginForm = ({signInFormRef, setUserInfo,}: LoginFormProps) => {

  const [unameEmail,setUnameEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")

  const handleSignIn = async (e:React.FormEvent) => {
    e.preventDefault()

    // const target = e.target as HTMLFormElement
    // console.log("target=",target)

    // Client-side check
    if(!unameEmail||!password) return alert("All the blank field must be filled.")

    const bodyInit: UserLoginRequestBody = {
      username:"",
      email:"",
      password:password,
    }

    // IF: it is an email
    if(isEmail(unameEmail)) bodyInit.email = unameEmail
    else bodyInit.username = unameEmail

    // console.log(bodyInit)

    const resLogin = await postLogin(bodyInit)
    console.log("resLogin=",resLogin)
    alert(resLogin.message)
    if(resLogin.data!==null){
      setUserInfo({
        _id: resLogin.data._id,
        username:resLogin.data.username,
        name:resLogin.data.name,
        email:resLogin.data.email,
        profilePictureUrl:resLogin.data.profilePictureUrl,
        articleIdRef: resLogin.data.articleIdRef
      })
    }
  }

  return (
    <form 
      className='block [&>input]:border [&>input]:rounded-md [&>input]:px-2 [&>input]:py-1 [&>input]:mb-3 [&>input]:bg-fuchsia-50 dark:[&>input]:dark-single-component'
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
      <input 
        type="password" 
        id="login-pass" 
        name="login-password" 
        value={password} 
        onChange={e=>setPassword(e.target.value)}
      />

      <div className='flex flex-row-reverse'>
        <button type="submit">Sign In</button>
      </div>
    </form>
  )
}

export default LoginForm