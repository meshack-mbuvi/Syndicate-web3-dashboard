import { useEffect, useState } from 'react';

// Check if the browser is in dark mode
const useIsInDarkMode = (): boolean => {
  const [isInDarkMode, setIsInDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsInDarkMode(
      window.matchMedia('(prefers-color-scheme: dark)').matches || false
    );
  }, []);
  return isInDarkMode;
};

export default useIsInDarkMode;
