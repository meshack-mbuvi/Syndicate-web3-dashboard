import { RefObject, useEffect, useRef } from 'react';
export const useTimeout = (
  callback: () => void,
  delay: number
): RefObject<number> => {
  const timeoutRef = useRef<number>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    timeoutRef.current = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timeoutRef.current!);
  }, [delay]);

  return timeoutRef;
};
