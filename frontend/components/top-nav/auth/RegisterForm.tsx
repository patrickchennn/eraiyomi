import { postRegisterUser } from "@/services/user/userService"
import { UserRegisterRequestBody } from "@shared/User"
import { RefObject } from "react"

interface RegisterForm {
  signUpFormRef: RefObject<HTMLFormElement>
}
const RegisterForm = ({signUpFormRef}: RegisterForm) => {

  const handleSignUp = async (e:React.FormEvent) => {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    // console.log("target=",target)

    const formData = new FormData(target)
    // console.log("formData=",...formData)

    let API_key! :string

    const bodyInit: UserRegisterRequestBody = {
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
        bodyInit[key as keyof UserRegisterRequestBody] = value as string
      }
      console.log(key, value);
    }
    const data = await postRegisterUser(API_key, bodyInit)
    alert(data.message)
  }

  return (
    <form 
      className='hidden [&>input]:border [&>input]:rounded-md [&>input]:px-2 [&>input]:py-1 [&>input]:mb-3 [&>input]:bg-fuchsia-50 dark:[&>input]:dark-single-component'
      // action="/api/account/register" 
      method="post" 
      onSubmit={handleSignUp}
      ref={signUpFormRef}
      >
      <label htmlFor="register-uName">Username</label>
      <input type="text" name="username" id="register-uName"/>

      <label htmlFor="register-name">Name</label>
      <input type="text" name="name" id="register-name"/>

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
  )
}

export default RegisterForm