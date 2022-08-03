import { AppState } from '@/state';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SplitContext } from '@splitsoftware/splitio-react';
import { distributions_feature } from '@/pages/_app';

const useDistributionsFeatureFlag = (): {
  isReady: boolean;
  readyDistributionsClient: any;
} => {
  const {
    featureFlagClientSliceReducer: { featureFlagClient }
  } = useSelector((state: AppState) => state);

  // access status properties via the SplitContext
  const { isReady } = useContext(SplitContext);

  useEffect(() => {
    if (!featureFlagClient || !isReady) return;
    const distributionsFeatureBoolean =
      featureFlagClient.getTreatmentWithConfig(distributions_feature, {
        distributionsAllowlisted: true
      });
    setReadyDistributionsClient(distributionsFeatureBoolean);
  }, [featureFlagClient, isReady]);

  const [readyDistributionsClient, setReadyDistributionsClient] =
    useState(null);

  return { isReady, readyDistributionsClient };
};

export default useDistributionsFeatureFlag;
