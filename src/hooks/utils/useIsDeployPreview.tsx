import { useEffect, useState } from 'react';
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
