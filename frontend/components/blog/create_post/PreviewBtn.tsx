// "use client"

// import { Dispatch, SetStateAction, useContext } from 'react'
// import CreateTitle from '../CreateTitle';
// import GeneratePreview from './GeneratePreview';
// import { useUserInfo } from '@/hooks/appContext';
// import convertDate from '@/utils/convertDate';
// import chalk from 'chalk';
// import getReadEstimation from '@/utils/getReadEstimation';
// import { CreateNewPostStateCtx } from '../CreateNewPost';
// import {MarkdownRenderer} from '@/utils/MarkdownRenderer';


// interface PreviewBtnProps{
//   setPreviewElem: Dispatch<SetStateAction<JSX.Element | undefined>>
//   className:string
// }
// export default function PreviewBtn({
//   setPreviewElem,className
// }: PreviewBtnProps) {

//   // hooks
//   const [userInfo] = useUserInfo()
//   const c = useContext(CreateNewPostStateCtx)!
//   const [articleData] = c.articleDataState
//   const [rawText] = c.rawTextState


//   // method
//   const handlePreview = () => {
//     console.log("\t\t@handlePreview")
//     console.log("rawText=",rawText)
//     console.log("articleData=",articleData)

//     // @TODO: give for each headings a some sort of "table of contents" like
//     const TOCData: {[key: string]:HTMLHeadingElement} = {};


//     const readingTime = getReadEstimation(articleData.totalWordCounts)
//     // console.log("readingTime=",readingTime)

//     const TitleContent = <CreateTitle
//       titlePage={articleData.title}
//       miscInfo={{
//         date: convertDate(new Date().toISOString().slice(0, 10)),
//         wordCount:articleData.totalWordCounts,
//         author: userInfo.username,
//         readingTime,
//         category: articleData.category,
//       }}
//     />

//     const PrevElem = <GeneratePreview 
//       MainContent={<MarkdownRenderer markdownText={rawText}/>} 
//       TitleContent={TitleContent}
//       TOCData={TOCData}
//     />
//     setPreviewElem(PrevElem)
//     // localStorage.setItem('article-content-md', JSON.stringify(PrevElem));
//   }





//   // render
//   return (
//     <button 
//       onClick={handlePreview} 
//       className={className}
//     >
//       {/* <Link
//         href={{
//           pathname:"post/compose/preview"
//         }} 
//         target="_blank" 
//       >
//         Preview
//       </Link> */}
//       Preview
//     </button>
//   )
// }
