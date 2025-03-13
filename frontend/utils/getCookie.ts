/**
 * 
 * @param cname The key cookie
 * @return null if cookie is not found
 */
export default function getCookie(cname: string): null | string {
  // console.log(document.cookie)
  for(const s of decodeURIComponent(document.cookie).split(';')) {    
    for(let j=0; j<s.length; j++){
      // console.log(s.slice(0,j))
      if(s[j]!=='=') {
        continue
      }else{
        // console.log(s.slice(0,j), s.slice(0,j).trimStart()===cname)
      }
      if(s.slice(0,j).trimStart()===cname){
        // console.log(s)
        return s.slice(j+1,s.length)
      }
      else
        break
    }
  }
  // console.log(chalk.blue(`[info]: getCookie("${cname}") is not available`))
  return null;
}