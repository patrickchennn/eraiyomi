export default function handleErrRes(res: Response, httpMethod: string){
  if(!res.ok){
    throw new Error(`${httpMethod} ${res.url}\n${res.status}:  ${res.statusText}`)
  }
}