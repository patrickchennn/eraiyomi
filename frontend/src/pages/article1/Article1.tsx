// react
import React from 'react'
import useGotoHash from '../../hooks/useGotoHash'

// assets
import sun from './sun.jpg'
import TOCstyle from '../../assets/TOCstyle'

// from /blog folder
import ParagraphHeading from '../../components/blog/ParagraphHeading'
import HeaderSection from '../../components/blog/HeaderSection'
import TableOfContents from '../../components/blog/TableOfContents'
import OtherPosts from '../../components/blog/OtherPosts'
import Title from '../../components/blog/Title'
import MyCite from '../../components/blog/MyCite'
import MyCitesDesc from '../../components/blog/MyCitesDesc'


// other content stuffs
import laptopBg from "../article2/laptop.jpg"
import rainbowBg from "../article3/rainbow.jpg"
import FootnotesLayout from '../../components/blog/FootnotesLayout'
import ReferenceLayout from '../../components/blog/ReferenceLayout'

const Article1 = () => {
  const TOCRef = React.useRef({})
  const cites = React.useRef({
    footnotesRef: React.useRef(),
    cite1: [null,null]
  })

  React.useEffect(() => {

  },[])
  useGotoHash(TOCRef,cites)


  const TOCData: JSX.Element = <>
    <div className={TOCstyle.parent} data-border-color-default="border-indigo-200" data-border-color-on-hover="border-indigo-400">
      ABCD 1
      <div className={TOCstyle.child1} data-border-color-default="border-red-200" data-border-color-on-hover="border-red-400">
        ABCD 2
        <div className={TOCstyle.child2} data-border-color-default="border-green-200" data-border-color-on-hover="border-green-400">ABCD 3</div>
      </div>
    </div>
  </>


  const setTOCRef = (e: HTMLElement) => {
    // to prevent error
    if(e===null) return
    (TOCRef as React.MutableRefObject<any>).current[e.textContent] = e
  }
  
  return (
    <>
      
      <div className='px-3 my-5 grid grid-rows-1 grid-cols-4 gap-3 relative' >
        {/* main and header */}
        <div className='bg-[#F7F9FA] border border-inherit rounded-3xl shadow-md col-start-1 col-end-4 col-span-3 dark:bg-zinc-900 dark:border-[#363636]'>
          {/* header / picture */}
          <HeaderSection pict={sun} />

          {/* main content / write here*/}
          <div className='pl-16 pt-8 pr-14 pb-14'>
            <Title titlePage="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio tempore aliquid consectetur suscipit ea laudantium?" miscInfo={{date:"sf",wordCount:2,author:"patrick chen",readingTime:"13 min"}}/>
            
            <div className='transition-all duration-250 ease-[linear]'>
              <ParagraphHeading headingType='h2' headingName='ABCD 1' setTOCRef={setTOCRef}/>
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.<MyCite cites={cites} no={1}/> Mollitia eligendi ratione minus quia recusandae, perferendis dignissimos nesciunt explicabo totam quam dicta! Iusto atque debitis officia odio. Recusandae autem maiores neque obcaecati voluptate officia, similique incidunt eaque possimus. Nostrum ad, animi tempore saepe explicabo quidem! Voluptates numquam qui eaque rem quas sunt, incidunt eius similique officiis tenetur quidem animi consequatur autem harum tempora mollitia facere odio? Est placeat libero ratione corporis quas quo error nostrum. Porro saepe, repellendus ab nulla omnis ipsum autem. Aperiam porro iste dolor nemo consectetur reprehenderit sapiente quis necessitatibus eius ut alias cupiditate voluptatum maxime ab doloribus aut explicabo, accusantium magnam iure blanditiis doloremque dolorum mollitia nulla? Rem tenetur sed repellat sapiente. Animi delectus nemo aut commodi reiciendis praesentium amet atque eveniet architecto, blanditiis nihil. Odit harum in magni eligendi eum neque placeat excepturi deleniti et omnis veniam dolorem sunt atque, rerum hic? Quod, optio temporibus! Facilis unde perferendis necessitatibus sequi quod pariatur temporibus incidunt eius ut, dolor illum consequatur voluptatum quidem sint harum omnis doloribus, officia exercitationem ab nam laborum molestias. Dolorum animi ipsa aperiam ex vitae pariatur magnam nam nisi molestiae autem eum est, deleniti totam, praesentium itaque eveniet aspernatur rerum! Consectetur doloremque odit vitae.</p>
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
                      <a href="#" className='decoration-[1.5px] underline hover:decoration-[hotpink]'>Lorem ipsum dolor sit amet consectetur</a>
                      <span> .Lorem ipsum dolor sit amet.</span>
                    </>
                  } cites={cites} />
                  <br />
                </>
              } 
              cites={cites}
            />


            {/* reference */}
            <ReferenceLayout 
              child={
                <>
                  <li>Lorem, ipsum dolor. Lorem, ipsum dolor. Lorem ipsum dolor sit.</li>
                  <li><a href="#" className='decoration-[1.5px] underline hover:decoration-[hotpink]'>https://tailwindcss.com/docs/list-style-type</a></li>
                </>
              }  
            />
            
          </div>
        </div>


        {/* table of content */}
        <TableOfContents
          TOCRef={TOCRef}
          TOCData={TOCData}
        />

        {/* other posts/content */}
        {/* <OtherPosts 
          posts={
            [
              ["/article2", laptopBg],
              ["/article3", rainbowBg],
            ]
          }
        /> */}

      </div>
      

    </>
  )
}


export default Article1