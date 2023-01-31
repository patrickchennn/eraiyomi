interface MyLinkProps {
  to: string,
  txt: string,
  target?: string
}
const MyLink = ({ to, txt,target="_blank" }: MyLinkProps) => {
  return (
    <a
      href={to}
      className="underline underline-offset-4 decoration-[1.5px] decoration-sky-400 hover:decoration-[hotpink]"
      target={target}
    >
      {txt}
    </a>
  );
};

export default MyLink;
