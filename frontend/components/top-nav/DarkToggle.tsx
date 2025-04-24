"use client"

import { useThemeState } from "@/hooks/appContext";
import chalk from "chalk";
import { BsFillMoonStarsFill, BsSunFill } from "react-icons/bs";



interface DarkToggleProps{
}
export default function DarkToggle({}: DarkToggleProps){
  // console.log(chalk.blueBright.bgBlack("Component: @DarkToggle"))

  // hook
  const [theme,setTheme] = useThemeState()

  // method
  const handleDarkModeClick = () => {
    // by default the theme is light so I can turn it into black immidiately
    document.documentElement.classList.contains("dark")?
      setTheme("dark") : setTheme("light")
    ;
    document.documentElement.classList.toggle("dark")
  }

  // render
  return(
    <button className='p-2 rounded-full flex items-center gap-x-3 hover:bg-gray-400' onClick={handleDarkModeClick}>
      {
        theme==="dark" ? <BsSunFill/> : <BsFillMoonStarsFill/>
      }
    </button>
  )
}
