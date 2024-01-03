interface ReferenceLayoutProps{
  child: JSX.Element
}
const ReferenceLayout = ({child}: ReferenceLayoutProps) => {
  return (
    <div className="pb-5">
      <h2 className=' font-bold'>References</h2>
      <hr />
      <ul className='pl-5 text-sm list-disc'>
        {child}
      </ul>
    </div>
  )
}

export default ReferenceLayout