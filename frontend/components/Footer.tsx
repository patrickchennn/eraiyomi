import {RxExternalLink} from "react-icons/rx"
import {BsGithub} from "react-icons/bs"
import { AiOutlineMail } from 'react-icons/ai'

const Footer = () => {
  return (
    <footer className='bg-white dark:bg-zinc-900'>
      <hr />
      <div className='flex justify-center items-center'>
        <AiOutlineMail />@patrick.chen31@gmail.com
      </div>
      <div className='flex justify-center items-center'>
        <a target="_blank" rel="noreferrer" href="https://github.com/patrickchennn" className='flex [&:hover>svg]:visible'>
          <BsGithub className='self-center'/>
          Github 
          <RxExternalLink className='w-3 h-3 invisible'/>
        </a> 
      </div>
    </footer>
  )
}

export default Footer