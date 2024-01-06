import { UserRes, ReqBodyLoginTraditional } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"

const url = process.env.URL_API
// console.log('url=',url)

export const GET_user = async (username: string) => {
  let res!: Response
  let data: UserRes

  try{
    res = await fetch(
      `${process.env.URL_API}/user/?username=${username}`
    )

    data = await res.json()

    if(!res.ok){
      throw new Error(JSON.stringify(data));
    }

  }
  // @ts-ignore
  catch(err: Error){

    console.error(chalk.red.bgBlack(err.message))

    return undefined
  }


  console.log(chalk.green.bgBlack(`GET ${res.url} ${res.status}`) )

  return data as UserRes
}





export const POST_verify = async (userCredToken: string) => {
  let res!: Response


  interface ErrorServerRes{
    google:{}
    traditional:{}
  }
  let data: UserRes | ErrorServerRes;

  try{
    res = await fetch(
      `${process.env.URL_API}/user/verify`,
      {
        headers: {
          'Authorization': `Bearer ${userCredToken}`
        },
        method: 'POST',
        credentials:"include"
      }
    )
    data = await res.json()

    if(!res.ok){
      throw new Error(JSON.stringify(data));
    }

  }
  // @ts-ignore
  catch(err: Error){

    console.error(err.message)

    return undefined
  }


  console.log(chalk.green.bgBlack(`POST ${res.url} ${res.status}`) )

  return data as UserRes
}





export const postLoginTraditional = async (loginData: ReqBodyLoginTraditional) => {
  let res!: Response
  let data
  try{
    res = await fetch(
      `${url}/user/login-traditional`,
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






export const POST_user = async (
  bodyInit:{username:string,email:string,password:string},
  API_key: string,
) => {
  let res!: Response
  let dataRes

  try {
    res = await fetch(
      `${url}/user`,
      {
        headers:{
          "Content-Type":"application/json",
          'Authorization': `Bearer ${API_key}`
        },
        method: "POST",
        body: JSON.stringify(bodyInit)
      }
    )
    dataRes = await res.json()

    if(!res.ok){
      console.error(dataRes)
      const errorMessage = dataRes?.message || 'An error occurred';
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error(err)
  }

  console.log(`%c POST ${res.url} ${res.status}\n`,'color: green',dataRes)
  
  return dataRes as {message: string}
}
