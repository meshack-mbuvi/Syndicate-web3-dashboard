// useUpdateEffect hook updates only when the dependencies change.
// unlike useEffect, it does not update on mount

import { useEffect, useRef } from 'react';

const useUpdateEffect = (callback: any, dependencies: any) => {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
  }, dependencies);
};

export default useUpdateEffect;
