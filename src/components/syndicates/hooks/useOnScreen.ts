import { RefObject, useEffect, useState } from "react";

const useOnScreen = (ref: RefObject<HTMLElement>) => {

  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    )

    observer.observe(ref.current)
    // Remove the observer as soon as the component is unmounted
    return () => { observer.disconnect() }
  }, [])

  return isIntersecting
}

export default useOnScreen;
