import { AppState } from '@/state';
import { useEffect } from '@storybook/addons';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const useFetchCollectiveFromContract = (): {
  getCollectiveFromContract: (string) => Promise<string>;
} => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { erc721Collective }
    }
  } = useSelector((state: AppState) => state);

  const getCollectiveFromContract = async (collectiveAddress) => {
    let collective = await erc721Collective.name(collectiveAddress);
    return collective;
  };
  return { getCollectiveFromContract };
};

export default useFetchCollectiveFromContract;
