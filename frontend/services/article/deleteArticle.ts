import axios from "axios";

const url = process.env.URL_API

export const deleteArticle = async (articleId: string,someKey: string) => {
  try {
    // expect 204
    await axios.delete(
      `${url}/article/${articleId}`,
      {
        headers:{
          Authorization:`Bearer ${someKey}`
        }
      }
    )

  } catch (error:any) {
    console.log(error.response);
    return error.response;
  }
}
