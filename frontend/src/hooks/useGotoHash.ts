      // @ts-nocheck 

import {useLayoutEffect} from 'react'

const useGotoHash = (TOCRef: React.MutableRefObject<{}>,cites: React.MutableRefObject<{}>) => {
  useLayoutEffect(() => {
    if(window.location.hash){
      console.log("table of content ref: ",TOCRef.current)
      console.log("cites ref: ",cites.current)

      const hash = decodeURIComponent(window.location.hash.substring(1));
      if(TOCRef.current[hash]!=undefined){
        (TOCRef.current as any)[hash].scrollIntoView({behavior: "smooth"})
        console.log("shit does not exist")
      }
      if(cites.current[hash]!=undefined){
        (cites.current as any)[hash][1].scrollIntoView({behavior: "smooth"})
      }

      // console.log(TOCRef.current[hash])
      // console.log(cites.current[hash])
    }
    else
      console.log("both shit literally do not exist")
  },[])
}

export default useGotoHash