interface MyCitesDescProps{
  cites:any,
  desc: any
}
const MyCitesDesc = ({cites,desc}: MyCitesDescProps) => {
  return (
    <>
      <p ref={currEle => (cites.current as any).cite1[1] = currEle} className='text-sm'>
        <a className='text-sky-500 hover:cursor-pointer hover:underline' onClick={() => {
            cites.current.cite1[0].scrollIntoView({behavior: "smooth"})
          }}
        > 
          1<sup>^ </sup>
        </a>
        {desc}
      </p>
    </>
  )
}

export default MyCitesDesc