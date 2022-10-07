import { useState, useEffect } from 'react';

// Check if the browser is in dark mode
const useIsInDarkMode = (): { width: number; height: number } => {
  const [isInDarkMode, setIsInDarkMode] = useState(null);

  useEffect(() => {
    setIsInDarkMode(
      window.matchMedia('(prefers-color-scheme: dark)').matches || false
    );
  }, []);
  return isInDarkMode;
};

export default useIsInDarkMode;
