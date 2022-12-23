

interface FootnotesLayoutProps{
  child: JSX.Element,
  cites: any
}
const FootnotesLayout = ({child,cites}: FootnotesLayoutProps) => {
  return (
    <div ref={cites.current.footnotesRef}>
      <h2 className='font-cinzel font-bold'>Footnotes</h2>
      <hr />
        {child}
      <br />
    </div>
  )
}

export default FootnotesLayout