import React from 'react'

interface MyCiteProps{
  cites: any,
  no: number
}
const MyCite = ({cites,no}: MyCiteProps) => {
  console.log(cites.current)
  return (
    <>
      <a 
        href={window.location.pathname+`#cite${no}`} 
        ref={currEle => (cites.current as any).cite1[0] = currEle} 
        className='text-sky-500 hover:underline' 
        onClick={() => {
          cites.current.footnotesRef.current.scrollIntoView({behavior: "smooth"})
          cites.current.cite1[1].style.backgroundColor = "#f0f9ff"
          setTimeout(() => {
            cites.current.cite1[1].style.backgroundColor = "transparent"
          }, 5000);
        }}
      >
        <sup className=''>
          [{no}]
        </sup>
      </a>

    </>
  )
}

export default MyCite