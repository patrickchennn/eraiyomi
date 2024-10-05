import getArticles from '@/services/article/getArticles'
import { Article } from '@patorikkuuu/eraiyomi-types'
import Link from 'next/link'


interface OtherPostsProps{
  style: string,
  currArticleId: string
}
/**
 * 
 * @currArticleId Current article id is the currently viewed article. If that is the case, then no need to display it to otherposts logic
 * @returns 
 */
export default async function OtherPosts({style,currArticleId}: OtherPostsProps){
  console.log("@OtherPosts")
  const articlesRes = await getArticles({sort:"newest"})
  if(!articlesRes.data){
    return(
      <pre>
        {JSON.stringify(articlesRes, null, 2)}
      </pre>
    )
  }
  const articles = articlesRes.data



  return (
    <div className={style}>
      <h3 className='font-bold text-center'>Baca juga</h3>
      <hr className='mb-5'/>
      <div>
        {
          articles.map((article: Article) => {
            if(article._id===currArticleId) return
            // console.log(article.titleArticle.URLpath)
            return (
              <div className='hover:bg-gray-100 dark:hover:bg-gray-800' key={article._id}>
                <h3>
                  <Link href={article.titleArticle.URLpath}>
                    {article.titleArticle.title}
                  </Link>
                </h3>
                <span className='text-sm text-gray-500'>
                  {article.shortDescription}
                </span>
              </div>
            )
          })
        }

      </div>
    </div>
  )
}