// react
import React from 'react'
import useGotoHash from '../../hooks/useGotoHash'

// assets
import sun from './sun.jpg'
import TOCstyle from '../../assets/TOCstyle'

// components/blog 
import ParagraphHeading from '../../components/blog/ParagraphHeading'
import HeaderSection from '../../components/blog/HeaderSection'
import TableOfContents from '../../components/blog/TableOfContents'
import OtherPosts from '../../components/blog/OtherPosts'
import Title from '../../components/blog/Title'
import {MyCite,MyCitesDesc,FootnotesLayout} from '../../components/blog/Footnotes'
import ReferenceLayout from '../../components/blog/ReferenceLayout'
import CommentSection from '../../components/blog/CommentSection'
import MyLink from '../../components/blog/MyLink'


import { Article } from '../../../types/Article'

// features/
import { getArticle } from '../../features/articleService'



const Article1 = () => {
  const TOCRef = React.useRef<{[key:string]: HTMLElement}>({})
  const cites = React.useRef({
    footnotesRef: React.useRef(),
    // cite(1) until cite(n)
    // cite(n) contains a tuple of the citation reference(index 0) and the footnote reference(index 1)
    cite1: [null,null]
  })
  const [articleData, setArticleData] = React.useState<Article>()

  React.useEffect(() => {

    (async function(){
      setArticleData(await getArticle("article 1"))
    }())

  },[])
  useGotoHash(TOCRef,cites)


  const TOCData: JSX.Element = 
    <div className={TOCstyle.parent} data-border-color-default="border-indigo-200" data-border-color-on-hover="border-indigo-400">
      ABCD 1
      <div className={TOCstyle.child1} data-border-color-default="border-red-200" data-border-color-on-hover="border-red-400">
        ABCD 2
        <div className={TOCstyle.child2} data-border-color-default="border-green-200" data-border-color-on-hover="border-green-400">ABCD 3</div>
      </div>
    </div>
  ;


  const setTOCRef = (e: HTMLHeadingElement) => {
    // to prevent error
    if(e===null) return
    // console.log(e, e.textContent,TOCRef.current);
    TOCRef.current[e.textContent] = e
  }
  

  if(articleData){
    return (
      <>
        {/* grid */}
        <div className='px-3 my-5 grid grid-cols-5 gap-3 relative' >
          {/* other posts/content */}
          <OtherPosts />
  
          {/* main content (write here) and header (thumbnail)*/}
          <div className='border border-zinc-300 rounded-xl bg-[#F7F9FA] shadow-md col-span-3 dark:bg-zinc-900 dark:border-[#363636]'>
            {/* header (thumbnail) */}
            <HeaderSection pict={sun} />
  
            {/* main content (write here)*/}
            <main className='px-16 py-8'>
              <Title
                titlePage={articleData.titleArticle}
                miscInfo={{
                  date:articleData.publishedDate,
                  wordCount:2,
                  author:articleData.author,
                  readingTime:"13 min"
                }}
              />
              
              <div className='transition-all duration-250 ease-[linear]'>
                <ParagraphHeading headingType='h2' headingName='ABCD 1' setTOCRef={setTOCRef}/>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.<MyCite cites={cites} no={1}/> <MyLink to="3" txt="Mollitiaygj" /> eligendi ratione minus quia recusandae, perferendis dignissimos nesciunt explicabo totam quam dicta! Iusto atque debitis officia odio. Recusandae autem maiores neque obcaecati voluptate officia, similique incidunt eaque possimus. Nostrum ad, animi tempore saepe explicabo quidem! Voluptates numquam qui eaque rem quas sunt, incidunt eius similique officiis tenetur quidem animi consequatur autem harum tempora mollitia facere odio? Est placeat libero ratione corporis quas qudsfo error nostrum. Porro saepe, repellendus ab nulla omnis ipsum autem. Aperiam porro iste dolor nemo consectetur reprehenderit sapiente quis necessitatibus eius ut alias cupiditate voluptatum maxime ab doloribus aut explicabo, accusantium magnam iure blanditiis doloremque dolorum mollitia nulla? Rem tenetur sed repellat sapiente. Animi delectus nemo aut commodi reiciendis praesentium amet atque eveniet architecto, blanditiis nihil. Odit harum in magni eligendi eum neque placeat excepturi deleniti et omnis veniam dolorem sunt atque, rerum hic? Quod, optio temporibus! Facilis unde perferendis necessitatibus sequi quod pariatur temporibus incidunt eius ut, dolor illum consequatur voluptatum quidem sint harum omnis doloribus, officia exercitationem ab nam laborum molestias. Dolorum animi ipsa aperiam ex vitae pariatur magnam nam nisi molestiae autem eum est, deleniti totam, praesentium itaque eveniet aspernatur rerum! Consectetur doloremque odit vitae.</p>
                <br />
              </div>
  
              <div className='transition-all duration-250 ease-[linear]'>
                <ParagraphHeading headingType='h3' headingName='ABCD 2' setTOCRef={setTOCRef}/>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita nostrum, neque sapiente fugit laudantium officia deleniti magnam maxime quae ipsam.</p>
                <br />
              </div>
  
              <div className='transition-all duration-250 ease-[linear]'>
                <ParagraphHeading headingType='h4' headingName='ABCD 3' setTOCRef={setTOCRef}/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam placeat corporis hic.</p>
                <br />
              </div>
  
              {/* footnotes */}
              <FootnotesLayout 
                child={
                  <>
                    <MyCitesDesc desc={
                      <>
                        <span>Lorem, ipsum dolor. </span> 
                        <MyLink to="#" txt="Lorem ipsum dolor sit amet consectetur. " /> 
                        <span>Lorem ipsum dolor sit amet.</span>
                      </>
                    } cites={cites} />
                  </>
                } 
                cites={cites}
              />
  
  
              {/* reference */}
              <ReferenceLayout 
                child={
                  <>
                    <li>Lorem, ipsum dolor. Lorem, ipsum dolor. Lorem ipsum dolor sit.</li>
                    <li>
                      <MyLink to="#" txt="https://tailwindcss.com/docs/list-style-type" /> 
                    </li>
                  </>
                }  
              />
            </main>
          </div>
  
  
          {/* table of content */}
          <TableOfContents
            TOCRef={TOCRef}
            TOCData={TOCData}
          />
  
          {/* commentary */}
          <CommentSection 
            articleId={articleData._id} 
            initComments={articleData.comments}
          />
        </div>
      </>
    )

  }
}


export default Article1