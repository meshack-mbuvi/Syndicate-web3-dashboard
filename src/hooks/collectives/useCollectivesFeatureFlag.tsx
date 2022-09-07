import { AppState } from '@/state';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SplitContext } from '@splitsoftware/splitio-react';
import { collectives_feature } from '@/pages/_app';
import useIsDeployPreview from '@/hooks/utils/useIsDeployPreview';

const useCollectivesFeatureFlag = (): {
  isReady: boolean;
  readyCollectivesClient: any;
} => {
  const {
    featureFlagClientSliceReducer: { featureFlagClient }
  } = useSelector((state: AppState) => state);

  // access status properties via the SplitContext
  const { isReady } = useContext(SplitContext);

  const [readyCollectivesClient, setReadyCollectivesClient] = useState(null);

  const { isDeployPreview: isBeta } = useIsDeployPreview();

  useEffect(() => {
    if (!featureFlagClient || !isReady) return;
    const collectivesFeatureBoolean = featureFlagClient.getTreatmentWithConfig(
      collectives_feature,
      {
        collectivesAllowlisted: true,
        isBeta
      }
    );
    setReadyCollectivesClient(collectivesFeatureBoolean);
  }, [featureFlagClient, isReady, isBeta]);

  return { isReady, readyCollectivesClient };
};

export default useCollectivesFeatureFlag;
