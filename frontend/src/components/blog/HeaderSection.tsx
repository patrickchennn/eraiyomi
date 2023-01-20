interface HeaderSectionProps{
  pict?: string,
  caption?: string,
}
const HeaderSection = ({pict,caption}: HeaderSectionProps) => {
  return (
    <div 
      className={` rounded-t-xl w-full h-70vh bg-center bg-cover grayscale relative dark:grayscale-0`} 
      style={{
        backgroundImage: `url(${pict})`
      }}
    >

      <h1 className="font-serif text-3xl absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <mark>
          {caption}
        </mark>
      </h1>
    </div>
  )
}

export default HeaderSection