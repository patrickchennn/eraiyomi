import isEqual from "lodash.isequal"

interface IsChangedStarProps{
  src: any
  dst: any
}
export default function IsChangedStar({src,dst}: IsChangedStarProps){
  if(isEqual(src,dst)) return null

  return (
    <span className='text-gray-600'>*</span>
  )
}