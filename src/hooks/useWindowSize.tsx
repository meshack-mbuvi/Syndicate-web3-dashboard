import { useState, useEffect } from 'react';

// track window resize event to enhance responsiveness.
const useWindowSize = (): { width: number; height: number } => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });

  function handleResize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  return windowSize;
};

export default useWindowSize;
