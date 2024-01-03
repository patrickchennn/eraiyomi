"use client"

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Profile from '../display-user/Profile'
import { User } from '@eraiyomi/types/User'
import ArticleOverview from './ArticleOverview'
import { Article, ArticlesAnalytic } from '@eraiyomi/types/Article'
import { ArticleAsset } from '@eraiyomi/types/ArticleAsset'


interface UserBtnsProps{
  user: User
  articles: Article[]
  articlesAnalytic: ArticlesAnalytic|undefined
  articlesAsset:ArticleAsset[]|undefined
}
export default function UserBtns({
  user,articles,articlesAnalytic,articlesAsset
}: UserBtnsProps) {
  // hooks
  const [selectedComponent,setSelectedComponent] = useState(<Profile userInfo={user}/>)
  const [showSelectedComponent,setShowSelectedComponent] = useState<HTMLElement|null>(null)
  
  useEffect(() => {
    setShowSelectedComponent(document.getElementById("show-selected-component"))
  },[])

  // methods
  const handleShowProfile = () => {
    setSelectedComponent(<Profile userInfo={user}/>)
  }

  const handleArticleOverview = () => {

    setSelectedComponent(
      <ArticleOverview 
        initArticles={articles} 
        initArticlesAnalytic={articlesAnalytic}
        initArticlesAsset={articlesAsset}
      />
    )
    
  }


  //render
  return (
    <>
      <button 
        onClick={handleShowProfile}
        className="px-3 py-1 border rounded w-24 bg-slate-50 shadow-inner hover:white hover:shadow-[0_0_14px_0_#ffffff_inset] hover:font-semibold"
      >
        profiles
      </button>

      <button 
        onClick={handleArticleOverview}
        className="px-3 py-1 border rounded w-24 bg-slate-50 shadow-inner hover:white hover:shadow-[0_0_14px_0_#ffffff_inset] hover:font-semibold"
      >
        my post
      </button>
      
      {selectedComponent && showSelectedComponent ? 
        createPortal(selectedComponent,showSelectedComponent)
        :
        <></>
      }
    </>
  )
}
