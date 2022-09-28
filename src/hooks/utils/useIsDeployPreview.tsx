import { useEffect, useState } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'glob... Remove this comment to see the full error message
import window from 'global';

// Deploy Preview hook
const useIsDeployPreview = () => {
  const [isDeployPreview, setIsDeployPreview] = useState(false);
  useEffect(() => {
    setIsDeployPreview(
      window?.location?.hostname.indexOf('deploy-preview') > -1 ||
        window?.location?.hostname.indexOf('beta') > -1
    );
  }, [window?.location?.hostname]);
  return { isDeployPreview };
};

export default useIsDeployPreview;
