import { AppState } from '@/state';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SplitContext } from '@splitsoftware/splitio-react';
import { clubsMixinGuarded_feature } from '@/pages/_app';
import SplitIO from '@splitsoftware/splitio-react/types/splitio/splitio';
import useIsDeployPreview from '@/hooks/utils/useIsDeployPreview';

const useClubMixinGuardFeatureFlag = (): {
  isReady: boolean;
  readyClubMixinsConfig: SplitIO.TreatmentWithConfig;
  isClubMixinGuardTreatmentOn: boolean;
} => {
  const {
    featureFlagClientSliceReducer: { featureFlagClient }
  } = useSelector((state: AppState) => state);

  const { isReady } = useContext(SplitContext);

  const [readyClubMixinsConfig, setReadyClubMixinsConfig] =
    useState<SplitIO.TreatmentWithConfig>(null);
  const [isClubMixinGuardTreatmentOn, setTreatmentStatus] =
    useState<boolean>(false);

  const { isDeployPreview: isBeta } = useIsDeployPreview();

  useEffect(() => {
    if (!featureFlagClient || !isReady) return;
    const clubMixinGuardFeatureBoolean =
      featureFlagClient.getTreatmentWithConfig(clubsMixinGuarded_feature, {
        clubsMixinGuardedAllowlisted: true,
        isBeta
      });
    setReadyClubMixinsConfig(clubMixinGuardFeatureBoolean);
  }, [featureFlagClient, isReady, isBeta]);

  useEffect(() => {
    if (readyClubMixinsConfig && readyClubMixinsConfig.treatment) {
      setTreatmentStatus(readyClubMixinsConfig.treatment === 'on');
    }
  }, [readyClubMixinsConfig]);

  return { isReady, readyClubMixinsConfig, isClubMixinGuardTreatmentOn };
};

export default useClubMixinGuardFeatureFlag;
