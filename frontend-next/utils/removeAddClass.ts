const removeAddClass = (toRemove: string, toAdd: string, ele: HTMLElement) => {
  ele.classList.remove(toRemove)
  ele.classList.add(toAdd)
}

export default removeAddClass