import { User } from "@patorikkuuu/eraiyomi-types"
import GoogleLoginBtn from "./GoogleLoginBtn"

interface AuthUIHandlerProps{
  user: User|undefined
}
export default function AuthUIHandler({user}: AuthUIHandlerProps){

  // console.log("user=",user)

  // render
  return (
    !user ? 
    <GoogleLoginBtn />
    :
    <>
      {/* <div className="loader"></div> */}
      {/* <button onClick={()=>{}} className="rounded py-1 px-2 bg-red-300 text-sm">
        logout
      </button> */}
    </> 
  )
}