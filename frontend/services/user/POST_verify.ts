import { UserRes } from "@patorikkuuu/eraiyomi-types";
import chalk from "chalk";
import { baseURL } from "../config";

export const POST_verify = async (userCredToken: string) => {
  let res!: Response


  interface ErrorServerRes{
    google:{}
    traditional:{}
  }
  let data: UserRes | ErrorServerRes;

  try{
    res = await fetch(
      `${baseURL}/user/verify`,
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
