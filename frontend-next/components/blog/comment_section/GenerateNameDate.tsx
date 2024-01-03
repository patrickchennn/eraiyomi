import convertDate from "@/utils/convertDate";

interface NameDateProps {
  name: string;
  date: string;
}
/**
 * @description Generate the user name and the date of when the comment is commited.
 */
export default function NameDate({ name, date }: NameDateProps){
  return (
    <div>
      <p className="mr-3 inline font-semibold">{name}</p>
      <dfn title={convertDate(date)}>
        <span className="text-gray-400">{date}</span>
      </dfn>
    </div>
  );
};