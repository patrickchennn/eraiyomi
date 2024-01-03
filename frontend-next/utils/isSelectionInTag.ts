/**
 * 
 * @param givenTag The tag name that is wanted to search
 * @param dataAttrName The data attribute that is wanted to search
 * @param select return the searched element.
 */
export default function isSelectionInTag(
  {givenTag="", dataAttrName=""}, 
  returnSelectedElem=false
): boolean | HTMLElement{
  givenTag = givenTag.toUpperCase()
  // Get the current selected node
  const sel = document.getSelection()
  if(!sel){
    console.error("sel is null")
    return false
  }
  let currSelectedNode = sel.anchorNode as HTMLElement
  // console.log(sel)
  // console.log("currSelectedNode=",currSelectedNode)

  // console.log(currSelectedNode)
  // console.log(givenTag)

  // While the node is not the editor division
  while (currSelectedNode.id !== 'editor'){
    // console.log("currSelectedNode",currSelectedNode)
    if(currSelectedNode.tagName==="BODY") return false

    //  IF the node is the requested tag OR
    // the element is actually typeof element (not text) AND it has the attribute data-edit-type AND that data attribute value is equal with the given desired data attribute (dataAttr)
    if (
      currSelectedNode.tagName === givenTag || 
      (
        currSelectedNode instanceof Element && 
        currSelectedNode.hasAttribute("data-edit-type") && 
        currSelectedNode.dataset.editType===dataAttrName
      )
    ) {
      // console.log("dom traverse from 'selected child' to 'selected parent'",currSelectedNode," is found!")
      if(returnSelectedElem){
        // set the "selection" position exactly at the same as "currSelectedNode". if currSelectedNode=bold tag, then the selection values will be bold element
        return currSelectedNode
      }
      return true
    }
    // Move up in the tree
    currSelectedNode = currSelectedNode.parentElement!;		
  }
  return false;
}