import { Account, GoogleIdentityRes } from "../../types/Account"
import handleErrRes from "./handleErrRes"

let url: string 
if(process.env.BUILD_MODE==="development"){
  url = "http://localhost:8080/"
}else{
  url = "https://eraiyomi-api.up.railway.app/"
}

/**
 * @desc This function is pretty similar like "keep me login" function. This function is implemented as simple as possible. On top of that, on the server side there is going to be a JWT and email verification.
 * 
 * This is needed because the account information is stored on the cookies storage meaning the user can change the data to whatever they want. Therefore, verfication is necessary.
 * 
 * @param accountInfo The account data fetched from cookies storage.
 */
export const postAccountLoginVerify = async (accountInfo: string) => {
  let data: Account
  try{
    const res: Response = await fetch(
      `${url}/account/login?verify=true`,
      {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body:accountInfo,
      }
    )
    handleErrRes(res,"POST")
    data = await res.json()
    console.log(`POST ${res.url}\n`, data)
  }catch(err: any){
    console.error(err)
  }
  return data
}


export const postAccountLogin = async (googleIdentityRes: GoogleIdentityRes) => {
  let data
  try{
    const res: Response = await fetch(
      `${url}/account/login`,
      {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          name:googleIdentityRes.name,
          id: googleIdentityRes.sub,
          email:googleIdentityRes.email,
          picture:googleIdentityRes.picture,
        }),
        credentials:"include"
      }
    )
  
    handleErrRes(res,"POST")

  
    data = await res.json()

    console.log(`POST ${res.url}\n`,data)
  }catch(err: any){
    console.error(err)
  }

}