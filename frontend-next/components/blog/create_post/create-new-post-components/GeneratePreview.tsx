import React from 'react'
import { TableOfContents } from '../../TableOfContents'

interface GeneratePreviewProps{
  MainContent: JSX.Element
  TitleContent: JSX.Element
  TOCData: {[key: string]:HTMLHeadingElement}
}
/**
 * @description Generate a rough view for the writing content
 */
const GeneratePreview = ({
  MainContent,
  TitleContent,
  TOCData
}: GeneratePreviewProps) => {
  return (
    <div className="px-16 py-5 relative max-[576px]:px-1">
      {/* other posts/content */}
      {/* <OtherPosts 
        style="p-5 border border-zinc-300 rounded-xl h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800 max-[576px]:hidden" 
        currArticleId={articleData._id}
      /> */}

      {/* main content (write here) and header (thumbnail)*/}
      <div className="border border-zinc-300 dark:border-[midnightblue]] rounded-xl post-glass dark:bg-[rgba(0,0,0,0.6)]">
        {TitleContent}

        <main className="px-16 py-8 transition-all duration-250 ease-[linear] max-[1024px]:px-14 max-[576px]:px-8">
          {MainContent}
        </main>
      </div>

      {/* table of content (>1024px)*/}
      {/* <TableOfContents /> */}
    </div>
  )
}

export default GeneratePreview