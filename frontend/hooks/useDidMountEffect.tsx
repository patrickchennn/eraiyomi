// https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render
import { useEffect, useRef } from "react"


const useDidMountEffect = (
  func: React.EffectCallback,
  depArr: any[]
) => {
  const firstTimeRender = useRef(true)

  useEffect(() => {
    if(firstTimeRender.current){
      if (firstTimeRender.current) func();
      else firstTimeRender.current = true;
    }
  },...depArr)

}

export default useDidMountEffect