import Layout from '@/components/layout';
import ModifyCollectiveSettings from '@/components/collectives/edit/ModifyCollectiveSettings';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NotFoundPage from '@/pages/404';

import CollectivesContainer from '@/containers/collectives/CollectivesContainer';
import Head from '@/components/syndicates/shared/HeaderTitle';
import { Spinner } from '@/components/shared/spinner';
import useCollectivesFeatureFlag from '@/hooks/collectives/useCollectivesFeatureFlag';
import { usePermissionType } from '@/hooks/collectives/usePermissionType';
import { PermissionType } from '@/components/collectives/shared/types';
import { useRouter } from 'next/router';

const ModifyCollectives: React.FC = () => {
  const {
    web3Reducer: {
      web3: { web3, activeNetwork }
    },
    collectiveDetailsReducer: {
      details: { collectiveName }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const { collectiveAddress } = router.query;

  const { isReady, readyCollectivesClient } = useCollectivesFeatureFlag();

  const [pageIsLoading, setPageIsLoading] = useState(true);

  const permissionType = usePermissionType();

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady) return;

    setPageIsLoading(false);
    return () => {
      setPageIsLoading(true);
    };
  }, [readyCollectivesClient, web3, isReady]);

  useEffect(() => {
    if (!readyCollectivesClient || isEmpty(web3) || !isReady) return;

    if (permissionType !== PermissionType.ADMIN) {
      router.replace(
        `/collectives/${collectiveAddress}?chain=${activeNetwork.network}`
      );
    }
  }, [
    collectiveAddress,
    isReady,
    permissionType,
    readyCollectivesClient,
    router,
    web3
  ]);

  return pageIsLoading ? (
    <Layout>
      <div className="container my-32">
        <Spinner />
      </div>
    </Layout>
  ) : isReady && readyCollectivesClient.treatment === 'on' ? (
    <CollectivesContainer>
      <Layout>
        <Head title={collectiveName || 'Collective'} />
        <div className="relative container mx-auto">
          <div className="grid grid-cols-12 gap-5 w-80 sm:w-730">
            <div className="col-span-12 text-white pb-10">
              <ModifyCollectiveSettings />
            </div>
          </div>
        </div>
      </Layout>
    </CollectivesContainer>
  ) : (
    <NotFoundPage />
  );
};

export default ModifyCollectives;
