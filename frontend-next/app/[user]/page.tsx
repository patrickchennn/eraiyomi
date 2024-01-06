import { cookies } from "next/headers"
import UserClient from "@/components/user/VerifiedUser"
import { User } from "@patorikkuuu/eraiyomi-types"
import { GET_user, POST_verify } from "@/services/userService"
import DisplayUser from "@/components/user/DisplayUser"


interface UserProps{
  params: { 
    user: string
  }
}
export default async function User({params}:UserProps) {
  console.log("params=",params)

  const user = await GET_user(params.user)
  console.log("user=",user)

  // IF user does not exist --> display 404
  if(!user){
    return (
      <>
        <h1>404 Not Found</h1>
        <p>{params.user} is not found.</p>        
      </>
    )
  }

  const cookieStore = cookies()

  const userCredToken = cookieStore.get('userCredToken')
  // console.log("userCredToken=",userCredToken)

  // IF: the user has never logged in before
  if(!userCredToken){
    return (
      <>
        <DisplayUser user={user}/>
      </>
    )
  }

  let verifiedUser: undefined|User
  // IF the user has logged in before
  if(userCredToken){
    // verify the user credential
    verifiedUser = await POST_verify(userCredToken.value)
    // console.log("verifiedUser=",user)
  }

  // IF the credential is not valid --> display non-privileged(non edit user feature) 
  if(!verifiedUser){
    return (
      <>
        <DisplayUser user={user}/>
      </>
    )
  }


  // IF valid --> display privileged user
  return (
    <>
      <UserClient user={user}/>
    </>
  )
}
