import { AppState } from '@/state';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SplitContext } from '@splitsoftware/splitio-react';
import useIsDeployPreview from '@/hooks/utils/useIsDeployPreview';

const useFeatureFlag = (
  splitName: string,
  attributes: SplitIO.Attributes
): {
  isReady: boolean;
  readyClient: SplitIO.TreatmentWithConfig | null;
  isTreatmentOn: boolean;
} => {
  const {
    featureFlagClientSliceReducer: { featureFlagClient }
  } = useSelector((state: AppState) => state);

  // access status properties via the SplitContext
  const { isReady } = useContext(SplitContext);

  const [readyClient, setReadyClient] =
    useState<SplitIO.TreatmentWithConfig | null>(null);

  const [isTreatmentOn, setTreatmentStatus] = useState<boolean>(false);

  const { isDeployPreview: isBeta } = useIsDeployPreview();

  useEffect(() => {
    if (!featureFlagClient || !isReady) return;
    const featureBoolean: SplitIO.TreatmentWithConfig =
      featureFlagClient.getTreatmentWithConfig(splitName, {
        ...attributes,
        isBeta
      });
    setReadyClient(featureBoolean);
  }, [featureFlagClient, isReady, isBeta]);

  useEffect(() => {
    if (readyClient && readyClient.treatment) {
      setTreatmentStatus(readyClient.treatment === 'on');
    }
  }, [readyClient]);

  return { isReady, readyClient, isTreatmentOn };
};

export default useFeatureFlag;
