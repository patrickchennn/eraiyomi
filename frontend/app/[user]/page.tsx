"use server"

import { cookies } from "next/headers"
import AuthenticatedUser from "@/components/user/AuthenticatedUser"
import DisplayUser from "@/components/user/DisplayUser"
import chalk from "chalk"
import { postVerifyUser } from "@/services/user/userService"
import { User as UserType } from "@shared/User"


interface UserProps{
  params: { 
    user: string
  }
}
export default async function User({params}: UserProps) {
  const userName = params.user
  
  console.log(chalk.blueBright.bgBlack(`[INF] Rendering /${userName}`))
  console.log("params=",params)

  const cookieStore = cookies()

  const userCredToken = cookieStore.get('userCredToken')
  console.log("userCredToken=",userCredToken)

  // IF: the user has never logged in before
  if(!userCredToken){
    return (
      <DisplayUser userName={userName}/>
    )
  }

  let verifiedUser: {
    status: string;
    message: any;
    data: UserType|null;
  } = {
    status: "",
    message: "",
    data: null
  }
  // IF: the user has logged in before
  if(userCredToken){
    // SECURITY server-side check: verify the user credential in order prevent JWT tampering
    verifiedUser = await postVerifyUser(userCredToken.value)
    console.log("verifiedUser=",verifiedUser)
  }

  // IF the credential is not valid --> display non-authentiated (non edit user feature) 
  if(verifiedUser.data===null){
    return (
      <DisplayUser userName={userName}/>
    )
  }

  // FINALLY: display authentiated user
  return (
    <AuthenticatedUser />
  )
}