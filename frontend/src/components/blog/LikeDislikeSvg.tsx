import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike
} from "react-icons/ai"

interface LikeDislikeSvgProps{
  accountId: string,
  type: string,
  likeDislikes: {
    [accountId: string]:string
  }
}

/**
 * 
 * @returns Generate a clicked or uncliked svg like( or dislike)
 */
const LikeDislikeSvg = ({accountId, type, likeDislikes}: LikeDislikeSvgProps) => {
  // console.log(accountId,type,likeDislikes)
  const doesExist = likeDislikes.hasOwnProperty(accountId)
  if(type==="like"){
    if(doesExist && likeDislikes[accountId]==="like"){
      return <AiFillLike/>
    }

    return <AiOutlineLike/>
  }else{
    if(doesExist && likeDislikes[accountId]==="dislike"){
      return <AiFillDislike/>
    }

    return <AiOutlineDislike/>
  }

}

export default LikeDislikeSvg