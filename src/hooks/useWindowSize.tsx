import { useEffect, useState } from 'react';

// track window resize event to enhance responsiveness.
const useWindowSize = (): {
  width: number;
  height: number;
} => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0
  });

  function handleResize(): void {
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
    return;
  }, []);

  return windowSize;
};

export default useWindowSize;
