"use client"

import chalk from "chalk"
import ArticleOverview from "./verified-user/ArticleOverview"
import { useState } from "react"
import Profile from "./verified-user/Profile"

export default function AuthenticatedUser(){
  console.log(chalk.blueBright.bgBlack("@AuthenticatedUser()"))

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [selectedComponent,setSelectedComponent] = useState<"profile"|"article">("profile")
  

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Methdos~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const handleShowProfile = () => {
    setSelectedComponent("profile")
  }

  const handleArticleOverview = async () => {
    setSelectedComponent("article")
  }


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Render~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <div className="my-0 mx-auto rounded w-1/2 bg-white flex gap-x-1 dark:dark-single-component">
      <ul className='dark:[&>button]:dark-single-component'>
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
      </ul>

      <div className="w-full">
        <ShowSelectedComponent selectedComponent={selectedComponent}/>
      </div>
    </div>
  )
}

const ShowSelectedComponent = ({selectedComponent}: {selectedComponent: "profile"|"article"}) => {
  if(selectedComponent==="profile"){
    return (
      <Profile />
    )
  }

  if(selectedComponent==="article"){
    return (
      <ArticleOverview />
    )
  }
}