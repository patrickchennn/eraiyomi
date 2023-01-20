interface MyLinkProps{
  to:string,
  txt:string,
}
const MyLink = ({to,txt}: MyLinkProps) => {
  return (
    <a href={to} className="underline underline-offset-4 decoration-[1.5px] decoration-sky-400 hover:decoration-[hotpink]">
      {txt}
    </a>
  )
}

export default MyLink