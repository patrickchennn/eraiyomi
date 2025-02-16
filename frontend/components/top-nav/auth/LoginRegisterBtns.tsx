import { RefObject } from "react"

interface LoginRegisterBtnsProps {
  signInFormRef: RefObject<HTMLFormElement>
  signUpFormRef: RefObject<HTMLFormElement>
}
const LoginRegisterBtns = ({signInFormRef, signUpFormRef}: LoginRegisterBtnsProps) => {

  return (
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

  )
}

export default LoginRegisterBtns