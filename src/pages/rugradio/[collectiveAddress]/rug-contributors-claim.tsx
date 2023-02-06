import { Spinner } from '@/components/shared/spinner';
import NftClaimAndInfoCard from '@/containers/collectives/ClaimPass/NftClaimAndInfoCard/merkle';
import NftImageCard from '@/containers/collectives/ClaimPass/NftImageCard';
import CollectivesContainer from '@/containers/collectives/CollectivesContainer';

import NotFoundPage from '@/pages/404';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'src/components/layout';
import Head from 'src/components/syndicates/shared/HeaderTitle';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import { FEATURE_FLAGS } from '@/pages/_app';

// TODO: REMOVE AFTER RR PFP LAUNCH
const RugRadioContributorClaimPage: React.FC = () => {
  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const [pageIsLoading, setPageIsLoading] = useState(true);

  const { isReady, readyClient: readyCollectivesClient } = useFeatureFlag(
    FEATURE_FLAGS.COLLECTIVES,
    {
      collectivesAllowlisted: true
    }
  );

  // Check to make sure collectives are not viewable on Polygon
  const { isPolygon } = useIsPolygon();

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [readyCollectivesClient, isReady, web3]);

  const isCollectivesReady =
    isReady && readyCollectivesClient?.treatment === 'on' && !isPolygon;

  return pageIsLoading ? (
    <div className="container my-32">
      <Spinner />
    </div>
  ) : isReady && isCollectivesReady ? (
    <Layout>
      <Head title="Claim collective pass" />

      <CollectivesContainer>
        <div className="flex container mx-auto sm:mt-24 justify-center space-y-6 sm:space-x-32 flex-col sm:flex-row w-full">
          {/* nft image  */}
          <NftImageCard />
          {/* claim and info card  */}
          <NftClaimAndInfoCard
            merkleMintModule={
              syndicateContracts.nativeTokenPriceMerkleMintModule_copy1
            }
          />
        </div>
      </CollectivesContainer>
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default RugRadioContributorClaimPage;
