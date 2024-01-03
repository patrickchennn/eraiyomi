"use client"

import { putArticle } from "../../services/articleService"
import {AiOutlineLike,AiFillLike,AiFillDislike,AiOutlineDislike} from "react-icons/ai"
import { Article } from "@eraiyomi/types/Article"
import { useState } from "react"
import { useUserInfo } from "@/hooks/appContext"
import getCookie from "@/utils/getCookie"



interface LikeDislikeArticleProps{
  articleInit: Article,
}
const LikeDislikeArticle = ({articleInit}: LikeDislikeArticleProps) => {

  // hooks
  const [userInfo] = useUserInfo()
  const [article,setArticleState] = useState(articleInit)
  // console.log(article)

  // useEffect(() => {
  //   console.log(article)
  // },[article])

  // methods
  const handleArticleLike = async (type: "like"|"dislike") => {

    const userCredToken = getCookie("userCredToken")
    // console.log("userCredToken=",userCredToken)

    if(!userInfo.userId.length||!userCredToken){
      return alert("Please login in order to rate this article.")
    }
    

    const data = await putArticle(userCredToken,article._id,null, type)
    // console.log("data=",data)
    if(data){
      setArticleState(prev => ({
        ...prev,
        likeDislike: data.likeDislike
      }))
    }
  }


  const generateLikeDislikeSVG = (type: "like"|"dislike") => {
    const user = article.likeDislike.users.find(user=>user.email===userInfo.email)
    // article.likeDislike.users[getUserIdx]

    // IF: the user has already like or dislike the article before
    if(user){
      
      const currStatus = user.statusRate
      console.log("currStatus=",currStatus)
      if(type==="like"){
        // true means like, false means dislike
        if(currStatus){
          return <AiFillLike />
        }else if(!currStatus){
          return <AiOutlineLike />
        }
      }else{

        if(currStatus){
          return <AiOutlineDislike />
        }else if(!currStatus){
          return <AiFillDislike />
        }
      }
    }else{
      if(type==="like"){
        return <AiOutlineLike />
      }else{
        return <AiOutlineDislike />
      }
    }
  }



  

  // render
  return (
    <div className="flex gap-x-1">
      <button className="flex" onClick={()=>handleArticleLike("like")}>
        {article.likeDislike.totalLike}
        <span className="self-center">
          {
            generateLikeDislikeSVG("like")
          }
        </span>
      </button>
      <button onClick={()=>handleArticleLike("dislike")}>
        {
          generateLikeDislikeSVG("dislike")
        }
      </button>
    </div>
  )
}

export default LikeDislikeArticle