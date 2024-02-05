import chalk from "chalk"

const url = process.env.URL_API

export const putArticle = async (
  some_key: string,
  articleId: string, 
  content?: any,
  action?: "like"|"dislike",
) => {
  let data
  let res!: Response
  const httpMethod = "PUT"

  try {
    res = await fetch(
      `${url}/article/${articleId}?action=${action}`,
      {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${some_key}`
        },
        body:content?JSON.stringify(content):null
      }
    )

    data = await res.json()
    
    if(!res.ok){
      // console.error(data)
      const errMsg = data?.message || 'An error occurred';
      throw new Error(errMsg);
    }

  } catch (error: unknown) {
    console.error(chalk.red.bgBlack(error))
    return undefined
  }


  console.log(chalk.green.bgBlack(`${httpMethod} ${res.url} ${res.status}`) )

  return data
}