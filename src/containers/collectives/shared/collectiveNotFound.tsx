import React from 'react';
import { useRouter } from 'next/router';
import TokenEmptyState from '@/containers/layoutWithSyndicateDetails/TokenEmptyState';

const CollectiveNotFound: React.FC = () => {
  const router = useRouter();

  const { collectiveAddress } = router.query;

  return (
    <TokenEmptyState
      tokenTitle="collective"
      tokenAddress={collectiveAddress as string}
    />
  );
};

export default CollectiveNotFound;
