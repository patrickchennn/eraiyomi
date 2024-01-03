import {FaHome} from "react-icons/fa"
import Link from "next/link"
import DarkToggle from "./DarkToggle"
import SearchInput from "./SearchInput"
import SignInModal from "./SignInModal"

interface TopNavProps{
}
export default function TopNav({}: TopNavProps){



  // render
  return (
    <>
      <div className='py-2 px-6 bg-white flex justify-between items-center dark:bg-zinc-900'>
  
        {/* go to root/home page */}
        <Link href='/' className='p-2 rounded-full flex items-center gap-x-3 hover:bg-gray-400' data-cy="home-btn"><FaHome/></Link>
  
        {/* search input */}
        <SearchInput/>
  
        {/* toogle dark mode btn / sign in btn(for future feature I guess) */}
        <ul className='flex items-center gap-x-4 [&>*]:hover:cursor-pointer'>
          <DarkToggle />

          <Link href="/compose/post" target="_blank">
            New Post
          </Link>

          <SignInModal />
        </ul>
      </div>

      <hr className='drop-shadow-md'/>
    </>
  )
}
