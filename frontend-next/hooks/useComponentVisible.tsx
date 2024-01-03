import { useEffect, useRef, useState } from "react";

const useComponentVisible = (initialIsVisible: boolean) => {
  // hooks
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);

    // cleanup
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  // methods
  const handleHideDropdown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsComponentVisible(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    // console.log("event=",event)
    const target = event.target as HTMLElement
    if (ref.current && !ref.current.contains(target)) {
      setIsComponentVisible(false);
    }
  };


  return { ref, isComponentVisible, setIsComponentVisible };
}

export default useComponentVisible