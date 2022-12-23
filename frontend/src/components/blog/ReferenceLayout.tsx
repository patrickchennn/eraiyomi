import React from 'react'

interface ReferenceLayoutProps{
  child: JSX.Element
}
const ReferenceLayout = ({child}: ReferenceLayoutProps) => {
  return (
    <div>
      <h2 className='font-cinzel font-bold'>References</h2>
      <hr />
      <ul className='pl-5 list-disc'>
        {child}
      </ul>
    </div>
  )
}

export default ReferenceLayout