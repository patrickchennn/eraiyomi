import { baseURL } from "../config";

export const deleteArticle = async (articleId: string,someKey: string) => {
  try {
    // expect 204
    const response = await fetch(`${baseURL}/article/${articleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${someKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("response=",response)
    if (!response.ok) {
      throw new Error(`Failed to delete article: ${response.statusText}`);
    }
    
  } catch (error:any) {
    console.log(error.response);
    return error.response;
  }
}
