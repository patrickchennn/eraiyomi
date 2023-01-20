
import {useLayoutEffect} from 'react'

const useGotoHash = (
  TOCRef: React.MutableRefObject<{[key: string]: HTMLElement}>,
  cites: React.MutableRefObject<any>
) => {
  useLayoutEffect(() => {
    if(window.location.hash){
      console.log("table of content ref: ",TOCRef.current)
      console.log("cites ref: ",cites.current)

      const hash: string = decodeURIComponent(window.location.hash.substring(1));
      if(TOCRef.current[hash]!=undefined){
        TOCRef.current[hash].scrollIntoView({behavior: "smooth"})
        console.log("shit does not exist")
      }
      if(cites.current[hash]!=undefined){
        cites.current[hash][1].scrollIntoView({behavior: "smooth"})
      }

      // console.log(TOCRef.current[hash])
      // console.log(cites.current[hash])
    }
    else{
      // console.log("both shit literally do not exist")
    }
  },[])
}

export default useGotoHash