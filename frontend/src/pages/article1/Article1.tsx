// react
import React from 'react'
import useGotoHash from '../../hooks/useGotoHash'

// assets
import sun from './sun.jpg'
import TOCstyle from '../../assets/TOCstyle'

// components/blog 
import ParagraphHeading from '../../components/blog/ParagraphHeading'
import HeaderSection from '../../components/blog/HeaderSection'
import {TableOfContents, TableOfContents2} from '../../components/blog/TableOfContents'
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
        <div className='px-3 py-5 min-[335px]:grid gap-3 relative max-[576px]:px-8 min-[576px]:grid-cols-5'>
          {/* other posts/content */}
          <OtherPosts style='border border-zinc-300 rounded-xl p-5 h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-stone-800 max-[576px]:hidden'/>
  
          {/* main content (write here) and header (thumbnail)*/}
          <div className='border border-zinc-300 rounded-xl bg-[#F7F9FA] shadow-md col-span-3 dark:bg-[#050505] dark:border-stone-800 max-[1024px]:col-span-4 max-[576px]:col-span-full'>
            {/* header (thumbnail) */}
            <HeaderSection pict={sun} />
  
            {/* main content (write here)*/}
            <main className='px-16 py-8 max-[1024px]:px-14 max-[576px]:px-8'>
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
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quae at nobis, molestiae culpa repellat et vitae ipsam officia quam deleniti nam facilis amet soluta laborum adipisci vel quas unde corporis voluptas maiores quaerat nulla magni perspiciatis. Exercitationem consequatur repudiandae cumque aperiam accusamus quis dolorum nulla dolor ratione ab sunt animi quaerat minima tenetur consectetur aut dignissimos expedita veritatis, fugit reprehenderit maiores impedit, eveniet similique. Nisi eligendi, perspiciatis recusandae voluptas quibusdam dolor aut tenetur nostrum rerum et accusamus, cumque sint velit necessitatibus explicabo iure blanditiis tempore pariatur quidem veritatis nobis itaque accusantium excepturi. Ipsum quisquam repellat, qui perspiciatis quos corporis, molestias fuga velit nisi suscipit veniam officiis ad voluptatibus. Quas ipsam impedit et fugit repellendus corporis sapiente dolore hic, rem totam exercitationem nesciunt voluptatibus tempora? Quidem, amet, consectetur, suscipit debitis cumque vitae earum temporibus enim sequi ad ullam. Officia ipsa quos similique esse numquam aperiam quae adipisci debitis dolorum repellendus.</p>
                <br />
              </div>

              {/* table of content (<768px)*/}
              <TableOfContents2
                TOCRef={TOCRef}
                TOCData={TOCData}
              />
  
              <div className='transition-all duration-250 ease-[linear]'>
                <ParagraphHeading headingType='h3' headingName='ABCD 2' setTOCRef={setTOCRef}/>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita nostrum, neque sapiente fugit laudantium officia deleniti magnam maxime quae ipsam.</p>
                <br />
              </div>
  
              <div className='transition-all duration-250 ease-[linear]'>
                <ParagraphHeading headingType='h4' headingName='ABCD 3' setTOCRef={setTOCRef}/>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores voluptatum adipisci ad sint, nulla, hic, dolore ea deleniti facere eaque temporibus. Sit excepturi at maxime ad hic exercitationem, voluptatum nihil. Sed ipsum odio, neque alias repudiandae, beatae veniam, sapiente fugit molestias error non laborum modi laboriosam vitae ad dolorem qui dolore eos earum aspernatur eveniet? Iusto, aliquid consectetur quas, id consequuntur dicta porro ratione neque facere temporibus asperiores animi voluptates deleniti numquam mollitia laudantium esse iste suscipit facilis ducimus dolorum est, ullam atque. Accusantium, maxime numquam at consequuntur ea eius voluptatibus quasi corrupti neque commodi distinctio veritatis, illum ut odio magni inventore tempora. Porro doloribus culpa distinctio perspiciatis. Quisquam pariatur voluptatum consequuntur praesentium vitae possimus aliquid provident ipsa rerum architecto, labore beatae commodi. Necessitatibus ab labore debitis dicta reprehenderit, sapiente temporibus optio consequatur natus facilis commodi excepturi voluptate! Aut doloribus fugiat necessitatibus rem facilis quo, qui quaerat dignissimos porro voluptates dolores corporis sit deserunt cupiditate est, quia et nobis. Molestias provident nesciunt at id perspiciatis soluta ab repudiandae, dolores blanditiis praesentium rerum tenetur dignissimos impedit necessitatibus consectetur corporis, officia optio vero quod modi quaerat earum ratione accusamus. Praesentium ea rem sit iure cum impedit corrupti quia mollitia earum, aliquam fugiat quasi optio dolores iste numquam quos enim sequi exercitationem hic dolorem labore reiciendis. Earum eius alias quam. Repellendus sunt iste perspiciatis non facilis, sed quae, mollitia nobis vitae quod harum tenetur reprehenderit. Architecto tempora nemo dolor, fugiat illum tenetur quasi dolore aliquid porro. Voluptatibus blanditiis, ad temporibus excepturi totam enim cumque inventore alias, voluptatum dicta incidunt voluptate magnam possimus esse quos iusto vel asperiores ea omnis quisquam fuga, exercitationem minus! Cum ab accusamus, porro distinctio libero, inventore esse quia numquam sit quibusdam voluptatibus, ipsam totam velit est autem non vero. Cumque omnis corrupti neque facilis dolorum nisi dolor quae nam fugiat doloremque accusamus non hic quos iure pariatur minima voluptate, maxime dolorem exercitationem! Laborum eos nisi, distinctio amet laudantium aliquid eius incidunt molestias, eum fuga totam veritatis aut. Eveniet optio pariatur libero repellendus, perspiciatis nesciunt in repudiandae natus animi placeat eaque at quibusdam perferendis aspernatur sint nihil illo rerum facere excepturi fugit adipisci labore. Iste doloribus maiores culpa! Laborum nobis fugiat ea tenetur autem quo, aliquid laudantium voluptatum deserunt iste omnis illum sequi culpa, mollitia corporis fuga provident, exercitationem qui! Esse perferendis aliquam libero, eum voluptatem nisi dicta eaque? Fugit voluptatum perspiciatis, blanditiis ipsam animi commodi dolores libero nisi, reprehenderit autem quasi velit exercitationem consequatur mollitia dolore doloribus nam vel debitis et explicabo. Ut voluptatum necessitatibus minus rerum quas, aut sit, laboriosam dolore accusamus minima, esse laudantium libero aspernatur blanditiis suscipit temporibus. Nesciunt mollitia ullam quam officia culpa a nisi architecto, soluta animi voluptas dolorem facilis doloremque dolorum. Libero, cumque consequatur qui assumenda reiciendis, atque asperiores quo eveniet nemo repudiandae earum veniam! Molestiae iure sunt vero veritatis natus, facilis neque optio. Et mollitia ut libero, eius exercitationem tempore incidunt quod esse amet! Deserunt ipsum blanditiis atque vitae harum molestiae soluta laudantium architecto hic esse animi, dolore aliquam consequuntur mollitia voluptates.</p>
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
  
  
          {/* table of content (>1024px)*/}
          <TableOfContents
            TOCRef={TOCRef}
            TOCData={TOCData}
          />
  
          {/* commentary */}
          <CommentSection
            style="mb-5 px-16 py-8 border border-zinc-300 rounded-3xl h-fit bg-white col-start-2 col-span-full dark:bg-zinc-900 max-[1024px]:px-14 max-[576px]:px-8 min-[1024px]:col-start-2 min-[1024px]:col-span-3"
            articleId={articleData._id} 
            initComments={articleData.comments}
          />
        </div>
      </>
    )

  }
}


export default Article1