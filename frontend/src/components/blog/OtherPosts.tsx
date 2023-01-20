import React from 'react'
import { AppContext } from '../../App'
import { Link } from 'react-router-dom'
import { ArticlesState } from '../../../types/Article'
import { Article } from '../../../types/Article'

const OtherPosts = () => {
  const {articlesState}: {articlesState: ArticlesState} = React.useContext(AppContext)



  if(articlesState.isSuccess){
    return (
      <div className='border border-zinc-300 rounded-xl p-5 h-fit bg-[#F7F9FA] shadow-inner dark:bg-zinc-900 dark:border-[#363636]'>
        <h3 className='font-bold text-2xl'>Other Posts</h3>
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