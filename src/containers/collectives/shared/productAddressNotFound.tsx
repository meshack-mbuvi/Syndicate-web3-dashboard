import React from 'react';
import { useRouter } from 'next/router';
import TokenEmptyState from '@/containers/layoutWithSyndicateDetails/TokenEmptyState';

export enum TokenType {
  COLLECTIVE = 'collective',
  DEAL = 'deal'
}

interface TokenNotFoundProps {
  tokenTitle: TokenType;
}

const ProductTokenNotFound: React.FC<TokenNotFoundProps> = ({
  tokenTitle
}: TokenNotFoundProps) => {
  const router = useRouter();

  // This might be a collective or a deal
  const { productTokenAddress } = router.query;

  return (
    <TokenEmptyState
      tokenTitle={tokenTitle}
      tokenAddress={productTokenAddress as string}
    />
  );
};

export default ProductTokenNotFound;
