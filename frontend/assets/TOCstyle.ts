// interface TOCstyleType{
//   [key in "h1" | "h2" | "h3"]: {
//     fullStyle: string,
//     borderDefault:string,
//     borderOnHoverClick: string
//   }
// }

type TOCstyleType = {
  [key in "h2" | "h3" | "h4"]: {
    fullStyle: string;
    borderDefault: string;
    borderOnHoverClick: string;
  };
};
const TOCstyle: TOCstyleType = {
  'h2': {
    fullStyle:"border-l-4 border-indigo-200 hover:border-indigo-400 p-3 font-medium bg-slate-200 cursor-pointer dark:bg-slate-700",
    borderDefault:"border-indigo-200",
    borderOnHoverClick:"border-indigo-400"
  },
  'h3': {
    fullStyle:"border-l-4 border-red-200 hover:border-red-400 p-3 font-medium bg-slate-200 cursor-pointer dark:bg-slate-700",
    borderDefault:"border-red-200",
    borderOnHoverClick:"border-red-400"
  },
  'h4': {
    fullStyle:"border-l-4 border-green-200 hover:border-green-400 p-3 font-medium bg-slate-200 cursor-pointer dark:bg-slate-700",
    borderDefault:"border-green-200",
    borderOnHoverClick:"border-green-400"

  }
}
export default TOCstyle