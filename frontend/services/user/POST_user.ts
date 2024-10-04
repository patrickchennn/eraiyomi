import { baseURL } from "../config"

export const POST_user = async (
  bodyInit:{username:string,email:string,password:string},
  API_key: string,
) => {
  let res!: Response
  let dataRes

  try {
    res = await fetch(
      `${baseURL}/user`,
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