import { cookies } from "next/headers"
import UserClient from "@/components/user/VerifiedUser"
import DisplayUser from "@/components/user/DisplayUser"
import { GET_user } from "@/services/user/GET_user"
import { POST_verify } from "@/services/user/POST_verify"
import chalk from "chalk"


interface UserProps{
  params: { 
    user: string
  }
}
export default async function User({params}:UserProps) {
  console.log(chalk.blueBright.bgBlack(`[INF] Rendering /${params.user} page`))
  console.log("params=",params)

  const userRes = await GET_user(params.user)
  console.log("userRes=",userRes)

  // IF user does not exist --> display 404
  if(!userRes.data){
    return (
      <pre>{JSON.stringify(userRes, null, 4)}</pre>
    )
  }

  const cookieStore = cookies()

  const userCredToken = cookieStore.get('userCredToken')
  console.log("userCredToken=",userCredToken)

  // IF: the user has never logged in before
  if(!userCredToken){
    return (
      <>
        <DisplayUser user={userRes.data}/>
      </>
    )
  }

  let verifiedUser: {
    status: string;
    message: any;
    data: any;
  } = {
    status: "",
    message: "",
    data: null
  }
  // IF the user has logged in before
  if(userCredToken){
    // verify the user credential
    verifiedUser = await POST_verify(userCredToken.value)
    // console.log("verifiedUser=",user)
  }

  // IF the credential is not valid --> display non-privileged(non edit user feature) 
  if(!verifiedUser.status){
    return (
      <>
        <DisplayUser user={userRes.data}/>
      </>
    )
  }


  // IF valid --> display privileged user
  return (
    <>
      <UserClient user={userRes.data}/>
    </>
  )
}
