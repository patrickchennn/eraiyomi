import {FaHome} from "react-icons/fa"
import Link from "next/link"
import DarkToggle from "./DarkToggle"
import SearchInput from "./SearchInput"
import Auth from "./auth/Auth"
import chalk from "chalk"

export default function TopNav(){
  console.log(chalk.bgBlack.blueBright("Component: TopNav"))
  // render
  return (
    <>
      <div className='py-2 px-6 bg-white flex justify-between items-center dark:bg-zinc-900'>
  
        {/* go to root/home page */}
        <Link href='/' className='p-2 rounded-full flex items-center gap-x-3 hover:bg-gray-400' data-cy="home-btn"><FaHome/></Link>
  
        {/* search input */}
        <SearchInput/>
  
        <ul className='flex items-center gap-x-4 [&>*]:hover:cursor-pointer'>
          <DarkToggle />

          <Link href="/compose/post" target="_blank">
            New Post
          </Link>

          <Auth />
        </ul>
      </div>

      <hr className='drop-shadow-md'/>
    </>
  )
}
