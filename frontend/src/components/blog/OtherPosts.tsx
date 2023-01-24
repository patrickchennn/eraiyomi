import React from 'react'
import { AppContext } from '../../App'
import { Link } from 'react-router-dom'
import { ArticlesState } from '../../../types/Article'
import { Article } from '../../../types/Article'

interface OtherPostsProps{
  style: string,
}
const OtherPosts = ({style}: OtherPostsProps) => {
  const {articlesState}: {articlesState: ArticlesState} = React.useContext(AppContext)



  if(articlesState.isSuccess){
    return (
      <div className={style}>
        <h3 className='font-bold text-center'>Other Posts</h3>
        <hr className='mb-5'/>
        <div className=''>
          {
            articlesState.message.map((article: Article) => {
              return (
                <div className='hover:bg-gray-100 dark:hover:bg-gray-800' key={article._id}>
                  <h3>
                    <Link to={article.path}>
                      {article.titleArticle}
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
}
export default OtherPosts