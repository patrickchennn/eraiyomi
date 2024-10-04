import { UserRes } from "@patorikkuuu/eraiyomi-types"
import chalk from "chalk"
import { baseURL } from "../config"

export const GET_user = async (username: string) => {
  let res!: Response
  let data: UserRes

  try{
    res = await fetch(
      `${baseURL}/user/?username=${username}`
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
