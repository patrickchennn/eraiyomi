interface FootnotesLayoutProps{
  child: JSX.Element,
  cites: any
}
export const FootnotesLayout = ({child,cites}: FootnotesLayoutProps) => {
  return (
    <div ref={cites.current.footnotesRef} className="pb-5">
      <h2 className='font-bold'>Footnotes</h2>
      <hr />
        {child}
    </div>
  )
}


interface MyCiteProps{
  cites: any,
  no: number
}
export const MyCite = ({cites,no}: MyCiteProps) => {
  // console.log(cites.current)
  return (
    <a 
      href={window.location.pathname+`#cite${no}`} 
      ref={currEle => (cites.current as any).cite1[0] = currEle} 
      className='text-sky-400 hover:underline' 
      onClick={() => {
        cites.current.footnotesRef.current.scrollIntoView({behavior: "smooth"})
        cites.current.cite1[1].style.backgroundColor = "#f0f9ff"
        setTimeout(() => {
          cites.current.cite1[1].style.backgroundColor = "transparent"
        }, 5000);
      }}
    >
      <sup>
        [{no}]
      </sup>
    </a>
  )
}


interface MyCitesDescProps{
  cites:any,
  desc: any
}
export const MyCitesDesc = ({cites,desc}: MyCitesDescProps) => {
  return (
    <>
      <p 
        ref={currEle => (cites.current as any).cite1[1] = currEle} 
        className='text-sm'
      >
        <a className='text-sky-400 hover:cursor-pointer hover:underline' onClick={() => {
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