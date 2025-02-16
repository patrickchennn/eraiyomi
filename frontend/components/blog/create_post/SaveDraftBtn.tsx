// import {useContext} from 'react'
// import { useUserInfo } from '@/hooks/appContext'
// import { postArticle } from '@/services/article/postArticle'
// import { CreateNewPostStateCtx } from '../CreateNewPost'
// import isEmpty from 'lodash.isempty'

// interface SaveDraftBtnProps{
//   className: string
// }
// export default function SaveDraftBtn({className}: SaveDraftBtnProps) {
//   const [userInfo] = useUserInfo()
//   const c = useContext(CreateNewPostStateCtx)!
//   const [articleData] = c.articleDataState
//   const [API_key] = c.API_keyState

//   // method
//   const handleSaveDraft = async () => {
//     // in order to able "save to draft", one is required to input the title,shortDescription, and its categories. Also login for information like 'author'
//     // console.log(title,shortDescription,categories)
//     // console.log(!title.length, !shortDescription.length, categories.length===0)
//     if(
//       isEmpty(articleData.title) || 
//       isEmpty(articleData.shortDescription) || 
//       isEmpty(articleData.category) ||
//       isEmpty(API_key)
//     ){
//       return alert("Fill all of the necessary data input that marked with '*' in order to save")
//     }



//     const postReqBodyArticle = {
//       title: articleData.title,
//       shortDescription: articleData.shortDescription,
//       status:"unpublished",
//       author:userInfo.username,
//       email: userInfo.email,
//       category: articleData.category
//     }
//     const res = await postArticle(postReqBodyArticle,API_key)
//     alert(res.message)
//   }




//   // render
//   return (
//     <button 
//       onClick={handleSaveDraft}
//       className={className}
//     >
//       Save Draft
//     </button>
//   )
// }
