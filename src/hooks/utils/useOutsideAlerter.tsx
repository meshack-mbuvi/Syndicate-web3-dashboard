import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideAlerter = (ref, outsideClickHandler) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      // source of the event is from the right component that should handle it correctly.
      if (
        !ref?.current ||
        event.target?.offsetParent?.id == ref?.current.id ||
        event.target.id == ref?.current.id
      )
        return event;

      if (ref.current && !ref.current.contains(event.target)) {
        return outsideClickHandler(event);
      }
      return event;
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
