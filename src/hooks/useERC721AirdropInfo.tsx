import { AppState } from '@/state';
import {
  clearERC721AirdropInfo,
  setERC721AirdropInfo,
  setLoadingERC721AirdropInfo
} from '@/state/erc721AirdropInfo/slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useFetchAirdropInfo: any = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, currentEthereumNetwork }
    },
    erc721MerkleProofSliceReducer: { erc721MerkleProof },
    erc721TokenSliceReducer: {
      erc721Token: {
        address: nftAddress,
        publicSingleClaimEnabled,
        publicUtilityClaimEnabled
      }
    },
    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);

  const [loading, setLoading] = useState(false);
  const [airdropData, setAirdropData] = useState([]);

  const getAirdropInfo = async (merkleExists) => {
    setLoading(true);
    const { MerkleDistributorModuleERC721 } = syndicateContracts;
    let events;
    if (merkleExists) {
      events = await MerkleDistributorModuleERC721?.getPastEvents(
        'MerkleAirdropCreated',
        {
          token: nftAddress,
          treeIndex: erc721MerkleProof.treeIndex.toString()
        }
      );
      setAirdropData(events);
    } else {
      // alternative to get info when the user has no claim.
      events = await MerkleDistributorModuleERC721?.getPastEvents(
        'MerkleAirdropCreated',
        {
          token: nftAddress
        }
      );
      if (events.length) {
        setAirdropData([events[events.length - 1]]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (erc721MerkleProof.accountIndex && account && nftAddress) {
      getAirdropInfo(true);
    } else if (account && nftAddress) {
      getAirdropInfo(false);
    }
  }, [
    erc721MerkleProof.accountIndex,
    account,
    nftAddress,
    currentEthereumNetwork
  ]);

  useEffect(() => {
    dispatch(setLoadingERC721AirdropInfo(true));
    if (
      airdropData?.length &&
      !publicSingleClaimEnabled &&
      !publicUtilityClaimEnabled
    ) {
      const airdropObj = airdropData[0].returnValues;
      dispatch(
        setERC721AirdropInfo({
          ...airdropObj,
          endTime: parseInt(airdropObj.endTime),
          startTime: parseInt(airdropObj.startTime)
        })
      );
      dispatch(setLoadingERC721AirdropInfo(false));
    } else {
      dispatch(clearERC721AirdropInfo());
    }
  }, [
    loading,
    airdropData,
    publicSingleClaimEnabled,
    publicUtilityClaimEnabled
  ]);

  return { loading };
};

export default useFetchAirdropInfo;
