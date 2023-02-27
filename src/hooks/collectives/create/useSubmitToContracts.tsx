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
  setCollectiveTransactionTakingTooLong,
  setCollectiveWaitingForConfirmation
} from '@/state/createCollective/slice';
import { getWeiAmount } from '@/utils/conversions';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useCreateState from './useCreateState';

const useSubmitToContracts = (): { submit: () => Promise<void> } => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: {
      syndicateContracts: { erc721CollectiveFactory }
    },
    web3Reducer: {
      web3: { account }
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
    creationStatus,
    artworkType,
    artworkUrl
  } = useCreateState();

  const collectiveParams = useMemo<ICollectiveParams>(() => {
    return {
      collectiveName: name,
      collectiveSymbol: symbol,
      ethPrice: !isNaN(pricePerNFT)
        ? getWeiAmount(String(pricePerNFT), 18, true)
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

  const submit = async (): Promise<void> => {
    dispatch(setCollectiveTransactionTakingTooLong(false));

    dispatch(setCollectiveWaitingForConfirmation(true));
    try {
      await erc721CollectiveFactory.createERC721Collective(
        account,
        collectiveParams,
        onTxConfirm,
        onTxReceipt,
        onTxFail
      );
    } catch (error) {
      onTxFail(error);
    }
  };

  const onTxConfirm = (_txn: string): void => {
    dispatch(setCollectiveTransactionHash(_txn));
    dispatch(setCollectiveConfirmed(true));
  };

  const onTxFail = (error: any): void => {
    try {
      if (error?.message.includes('Be aware that it might still be mined')) {
        dispatch(setCollectiveTransactionTakingTooLong(true));
      }

      dispatch(setCollectiveTransactionTakingTooLong(false));
      dispatch(setCollectiveTransactionError(true));
      return;
    } catch (error) {
      console.log({ error });
    }
  };

  const onTxReceipt = (receipt: {
    events: {
      ERC721CollectiveCreated: {
        returnValues: { collective: string; name: string; symbol: string };
      };
    };
  }): void => {
    if (receipt?.events?.ERC721CollectiveCreated?.returnValues?.collective) {
      dispatch(
        setCollectiveCreationReceipt({
          collective:
            receipt.events.ERC721CollectiveCreated.returnValues.collective,
          name: receipt.events.ERC721CollectiveCreated.returnValues.name,
          symbol: receipt.events.ERC721CollectiveCreated.returnValues.symbol,
          artworkType,
          artworkUrl
        })
      );
    }
    dispatch(setCollectiveTransactionSuccess(true));
  };

  return {
    submit
  };
};

export default useSubmitToContracts;
