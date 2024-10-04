import { ReqBodyLoginTraditional, UserRes } from "@patorikkuuu/eraiyomi-types"
import { baseURL } from "../config"

export const postLoginTraditional = async (loginData: ReqBodyLoginTraditional) => {
  let res!: Response
  let data
  try{
    res = await fetch(
      `${baseURL}/user/login-traditional`,
      {
        headers:{
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body:JSON.stringify(loginData),
        credentials:"include"
      }
    )
    data = await res.json()
    if(!res.ok){
      console.error(data)
      const errorMessage = data?.message || 'An error occurred';
      throw new Error(errorMessage);
    }

  }catch(err: any){
    console.error(err)
  }

  interface ExtendedUser extends UserRes {
    message: string;
  }
  console.log(`%c POST ${res.url} ${res.status}\n`,'color: green',data)
  return data as ExtendedUser
}