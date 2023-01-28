import { useContext } from "react"
import { Article } from "../../../types/Article"
import { AppContext } from "../../App"
import { putArticleLike } from "../../features/articleService"
import {AiOutlineLike,AiFillLike} from "react-icons/ai"
import { Account } from "../../../types/Account"

interface LikeArticleProps{
  articleId: string,
  articleDataState: [Article, React.Dispatch<React.SetStateAction<Article>>]
}
const LikeArticle = ({articleId,articleDataState}: LikeArticleProps) => {
  const {accountInfoStates} = useContext(AppContext)
  const [accountInfo]: [accountInfo: Account] = accountInfoStates
  const [articleData,setArticleData] = articleDataState

  const handleArticleLike = async (articleId: string) => {
    if(!accountInfo.email.length){
      return alert("Please login in order to rate this article.")
    }
    setArticleData(await putArticleLike(articleId,accountInfo.email))
  }
  const generateLikeSVG = () => {
    const cond: boolean = articleData.likes[accountInfo.email]
    if(cond){
      return <AiFillLike/>
    }
    return <AiOutlineLike />
  }
  return (
    <button onClick={()=>handleArticleLike(articleData._id)}>
      {
        generateLikeSVG()
      }
      {articleData.numberOfLikes}
    </button>
  )
}

export default LikeArticle