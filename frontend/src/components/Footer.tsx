import React from 'react'
import {RxExternalLink} from "react-icons/rx"
import {BsGithub} from "react-icons/bs"

const Footer = () => {
  return (
    <footer className='bg-white dark:bg-zinc-900'>
      <div className='text-center'>
        Email: @patrick.chen31@gmail.com
      </div>
      <div className='flex justify-center'>
        <a target="_blank" href="https://github.com/patrickchennn" className='flex [&:hover>svg]:visible'>
          <BsGithub className='self-center'/>
          Github 
          <RxExternalLink className='w-3 h-3 invisible'/>
        </a> 
      </div>
    </footer>
  )
}

export default Footer