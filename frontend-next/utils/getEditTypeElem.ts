
const getEditTypeElem = (givenElem: HTMLElement)=>{
  let currSelectedNode = givenElem
  while(currSelectedNode.id !== 'editor'){
    if(
      currSelectedNode instanceof Element && 
      currSelectedNode.hasAttribute("data-edit-type")
    ){
      return currSelectedNode
    }
    if(!currSelectedNode.parentElement) {
      console.error("currSelectedNode.parentElement is null")
      break
    }
    currSelectedNode = currSelectedNode.parentElement
  }
  return null
}

export default getEditTypeElem