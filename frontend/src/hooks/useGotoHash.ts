import {useEffect,useLayoutEffect} from 'react'
import CitesRef from '../../types/CitesRef'
import { Article } from '../../types/Article'

const useGotoHash = (
  headingRef: React.MutableRefObject<{[key: string]: HTMLHeadingElement}>,
  citesRef: React.MutableRefObject<CitesRef>,
  articleData:Article
) => {
  useEffect(() => {
    // console.log("useGotoHash")
    // if there is a hash within the url
    if(window.location.hash){
      // console.log(headingRef.current)
      // console.log(citesRef.current)

      // window.location.hash.substring(1) = omit the hash char(#)
      const hash: string = decodeURIComponent(window.location.hash.substring(1));
      // console.log("hash: ",hash)
      if(Object.hasOwn(headingRef.current,hash)){
        headingRef.current[hash].scrollIntoView({behavior: "smooth"})
      }
      if(Object.hasOwn(citesRef.current,hash)){
        citesRef.current[hash][1].scrollIntoView({behavior: "smooth"})
      }
    }

  },[articleData])
}

export default useGotoHash