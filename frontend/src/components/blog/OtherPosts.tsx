import React from 'react'
import { Link } from 'react-router-dom'

interface OtherPostsProps{
  posts: any
}
const OtherPosts = ({posts}: OtherPostsProps) => {
  const figureStyle = "m-auto rounded-xl w-fit bg-zinc-100 shadow-inner transition-all duration-500 ease-linear hover:bg-zinc-200 hover:shadow-[4px_4px_0_black] hover:-translate-y-[0.9px] hover:-translate-x-[0.9px] dark:hover:shadow-[4px_4px_0_white] dark:border-black"
  const otherPostsRef = React.useRef<HTMLDivElement>(null)
  const [multiplyThree,setMultiplyThree] = React.useState(3)

  React.useEffect(() => {
    const {current} = otherPostsRef
    const n = (current as any).children.length

    for(let i=multiplyThree; i<n; i++){
      const ele = current.children[i] as HTMLElement
      ele.style.display = "none"
    }
  }, [])
  
  const handleShowMoreContentClick = () => {
    const {current} = otherPostsRef
    const n = current.children.length
    console.log(multiplyThree,n)
    for(let i=multiplyThree; i<multiplyThree+3; i++){
      const ele = otherPostsRef.current.children[i] as HTMLElement
      if(ele===undefined){
        break 
      }
      ele.style.display = "block"
    }
    setMultiplyThree(prev => prev+=3)
  }

  return (
    <div className='h-fit bg-[#F7F9FA] border border-inherit rounded-3xl pl-16 pt-16 pr-14 pb-14 col-span-3 shadow-md dark:bg-zinc-900 dark:border-[#363636]'>
      <h1 className='font-bold text-2xl'>Other Posts</h1>
      <hr className='mb-5'/>
      <div ref={otherPostsRef} className='dark:text-black grid auto-cols-fr grid-cols-3 gap-x-6'>
        {
          posts.map((post: any,idx: number) => {
            // console.log(post[0], post[1])
            return (
              <figure className={figureStyle} key={idx}>
                <img className="rounded-t-xl" src={post[1]} alt="an" />
                <figcaption className="w-fit p-3 cursor-pointer">
                  <Link to={post[0]} className="after:content-[''] after:block after:w-0 after:h-0.5 after:bg-black after:transition-[width] after:duration-500 after:ease-in after:hover:w-full">
                    {post[0]}
                  </Link>
                </figcaption>
              </figure>
            )
          })
        }
        {/* <figure className={figureStyle}>
          <img className="rounded-t-xl" src="https://picsum.photos/seed/picsum/251/150" alt="an" />
          <figcaption className="p-3 cursor-pointer">
            <Link to="/test" className="after:content-[''] after:block after:w-0 after:h-px after:bg-black after:transition-[width] after:duration-500 after:ease-in after:hover:w-full">
              Lorem, ipsum dolor.
            </Link>
          </figcaption>
        </figure> */}
      </div>

      <div className="mt-3">
        <button onClick={handleShowMoreContentClick} className='rounded-lg px-3 py-1 bg-emerald-200 text-xl hover:bg-emerald-300 focus:ring-4 focus:ring-emerald-100 dark:text-black'>more</button>
      </div>
    </div>
  )
}
export default OtherPosts