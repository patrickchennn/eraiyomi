const removeAddClass = (ele: HTMLElement, toRemove: string, toAdd: string) => {
  ele.classList.remove(toRemove)
  ele.classList.add(toAdd)
}

export default removeAddClass