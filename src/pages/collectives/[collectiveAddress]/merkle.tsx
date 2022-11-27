import Layout from '@/components/layout';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NotFoundPage from '@/pages/404';
import useERC721Collective from '@/hooks/collectives/useERC721Collective';

import CollectivesContainer from '@/containers/collectives/CollectivesContainer';
import Head from '@/components/syndicates/shared/HeaderTitle';
import { Spinner } from '@/components/shared/spinner';
import useCollectivesFeatureFlag from '@/hooks/collectives/useCollectivesFeatureFlag';
import { usePermissionType } from '@/hooks/collectives/usePermissionType';
import { PermissionType } from '@/components/collectives/shared/types';
import { useRouter } from 'next/router';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import MerkleView from '@/containers/collectives/Merkle/MerkleView';

const CollectiveMerkleView: React.FC = () => {
  const {
    web3Reducer: {
      web3: {
        web3,
        activeNetwork: { network }
      }
    }
  } = useSelector((state: AppState) => state);

  const {
    collectiveDetails: { collectiveName, collectiveAddress }
  } = useERC721Collective();

  const router = useRouter();

  // Check to make sure collectives are not viewable on Polygon
  const { isPolygon } = useIsPolygon();

  const { isReady, readyCollectivesClient } = useCollectivesFeatureFlag();

  const [pageIsLoading, setPageIsLoading] = useState(true);

  const permissionType = usePermissionType(collectiveAddress);

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [readyCollectivesClient, web3, isReady]);

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady || !permissionType)
      return;

    if (permissionType !== PermissionType.ADMIN) {
      router.replace(`/collectives/${collectiveAddress}?chain=${network}`);
    }
  }, [
    collectiveAddress,
    isReady,
    permissionType,
    readyCollectivesClient,
    router,
    web3,
    network
  ]);

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isReady && readyCollectivesClient.treatment === 'on' && !isPolygon ? (
    <CollectivesContainer>
      <Layout>
        <Head title={collectiveName || 'Collective'} />
        <MerkleView collectiveAddress={collectiveAddress} chain={network} />
      </Layout>
    </CollectivesContainer>
  ) : (
    <NotFoundPage />
  );
};

export default CollectiveMerkleView;
