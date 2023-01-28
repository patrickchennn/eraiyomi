import { rootElement } from ".."

const isDarkMode = () => {
  if(rootElement.classList.contains("dark")){
    return true
  }
  return false
}
export default isDarkMode