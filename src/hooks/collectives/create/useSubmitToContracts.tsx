// submit collective to protocol
// ==============================================================

import { ICollectiveParams } from '@/ClubERC20Factory/ERC721CollectiveFactory';
import { AppState } from '@/state';
import {
  setCollectiveConfirmed,
  setCollectiveCreationReceipt,
  setCollectiveTransactionError,
  setCollectiveTransactionHash,
  setCollectiveTransactionSuccess,
  setCollectiveWaitingForConfirmation
} from '@/state/createCollective/slice';
import { getWeiAmount } from '@/utils/conversions';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useCreateState from './useCreateState';

const useSubmitToContracts = () => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: {
      syndicateContracts: { erc721CollectiveFactory }
    },
    web3Reducer: {
      web3: { account, web3 }
    }
  } = useSelector((state: AppState) => state);

  const {
    name,
    symbol,
    pricePerNFT,
    maxPerWallet,
    openUntil,
    EpochCloseTime,
    maxSupply,
    transferrable,
    creationStatus
  } = useCreateState();

  const collectiveParams = useMemo<ICollectiveParams>(() => {
    return {
      collectiveName: name,
      collectiveSymbol: symbol,
      ethPrice: !isNaN(pricePerNFT)
        ? getWeiAmount(web3, String(pricePerNFT), 18, true)
        : '',
      maxPerMember: +maxPerWallet,
      openUntil: openUntil,
      startTime: (~~(new Date().getTime() / 1000)).toString(),
      endTime: String(EpochCloseTime),
      totalSupply: +maxSupply,
      tokenURI: creationStatus.ipfsHash,
      allowTransfer: transferrable
    };
  }, [
    name,
    symbol,
    pricePerNFT,
    maxPerWallet,
    openUntil,
    EpochCloseTime,
    maxSupply,
    transferrable,
    creationStatus.ipfsHash
  ]);

  const submit = async () => {
    dispatch(setCollectiveWaitingForConfirmation(true));
    await erc721CollectiveFactory.createERC721Collective(
      account,
      collectiveParams,
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  };

  const onTxConfirm = (_txn: string) => {
    dispatch(setCollectiveTransactionHash(_txn));
    dispatch(setCollectiveConfirmed(true));
  };

  const onTxFail = () => {
    dispatch(setCollectiveTransactionError(true));
  };

  const onTxReceipt = (receipt: any) => {
    dispatch(setCollectiveTransactionSuccess(true));

    if (receipt?.events?.ERC721CollectiveCreated?.returnValues?.collective) {
      dispatch(
        setCollectiveCreationReceipt({
          collective:
            receipt.events.ERC721CollectiveCreated.returnValues.collective,
          name: receipt.events.ERC721CollectiveCreated.returnValues.name,
          symbol: receipt.events.ERC721CollectiveCreated.returnValues.symbol
        })
      );
    }
  };

  return {
    submit
  };
};

export default useSubmitToContracts;
