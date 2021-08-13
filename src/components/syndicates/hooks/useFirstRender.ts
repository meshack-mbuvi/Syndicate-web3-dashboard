import { useRef, useEffect } from "react";

// custom hook to make useEffect not to run on initial render
export const useFirstRender = () => {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
};
