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
      web3: { account, activeNetwork }
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

  const getAirdropInfo = async (merkleExists: any) => {
    setLoading(true);
    const { MerkleDistributorModuleERC721 } = syndicateContracts;
    let _events;
    if (merkleExists) {
      _events = await MerkleDistributorModuleERC721?.getPastEvents(
        'MerkleAirdropCreated',
        {
          token: nftAddress,
          treeIndex: erc721MerkleProof.treeIndex.toString()
        }
      );
      if (_events) {
        setAirdropData(_events);
      }
    } else {
      // alternative to get info when the user has no claim.
      _events = await MerkleDistributorModuleERC721?.getPastEvents(
        'MerkleAirdropCreated',
        {
          token: nftAddress
        }
      );
      if (_events) {
        setAirdropData([_events[_events.length - 1]]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (erc721MerkleProof.accountIndex && account && nftAddress) {
      void getAirdropInfo(true);
    } else if (account && nftAddress) {
      void getAirdropInfo(false);
    }
  }, [erc721MerkleProof.accountIndex, account, nftAddress, activeNetwork]);

  useEffect(() => {
    dispatch(setLoadingERC721AirdropInfo(true));
    if (
      airdropData?.length &&
      !publicSingleClaimEnabled &&
      !publicUtilityClaimEnabled
    ) {
      // @ts-expect-error TS(2339): Property 'returnValues' does not exist on type 'ne... Remove this comment to see the full error message
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
