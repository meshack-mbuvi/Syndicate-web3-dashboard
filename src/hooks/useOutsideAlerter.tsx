import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideAlerter: any = (
  ref,
  onOutsideClick,
  elementIdToExclude = ''
) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (event.target.id !== elementIdToExclude) {
          onOutsideClick();
        }
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

// /**
//  * Component that alerts if you click outside of it
//  */
// export default function OutsideAlerter(props) {
//   const wrapperRef = useRef(null);
//   useOutsideAlerter(
//     wrapperRef,
//     props.onOutsideClick,
//     props.elementIdToExclude || 'no element'
//   );

//   return <div ref={wrapperRef}>{props.children}</div>;
// }
