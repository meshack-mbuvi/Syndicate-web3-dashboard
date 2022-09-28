import { useState, useEffect } from 'react';

// track window resize event to enhance responsiveness.
const useWindowSize = (): { width: number; height: number } => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });

  function handleResize() {
    setWindowSize({
      // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'undefined... Remove this comment to see the full error message
      width: window.innerWidth,
      // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'undefined... Remove this comment to see the full error message
      height: window.innerHeight
    });
  }

  // @ts-expect-error TS(7030): Not all code paths return a value.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  // @ts-expect-error TS(2322): Type '{ width: undefined; height: undefined; }' is... Remove this comment to see the full error message
  return windowSize;
};

export default useWindowSize;
