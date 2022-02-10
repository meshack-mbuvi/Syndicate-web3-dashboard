import { ERC721Contract } from "@/ClubERC20Factory/ERC721Membership";
import { AppState } from "@/state";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useOwnsGenesisNFT: any = () => {
  const GENESIS_NFT = process.env.NEXT_PUBLIC_GenesisNFT;

  const {
    web3Reducer: {
      web3: { account, web3 },
    },
    initializeContractsReducer: {
      syndicateContracts: { RugClaimModule },
    },
  } = useSelector((state: AppState) => state);

  const [genesisNFTBalance, setGenesisNFTBalance] = useState(0);
  const [checkingGenesis, setCheckingGenesis] = useState(true);
  const [claimEnabled, setClaimEnabled] = useState(false);
  const [claimStartTime, setClaimStartTime] = useState(0);

  const checkTokenBalance = async () => {
    if (!account || !GENESIS_NFT) return;
    try {
      const ERC721tokenContract = new ERC721Contract(
        GENESIS_NFT as string,
        web3,
      );

      const balance = parseInt(await ERC721tokenContract.balanceOf(account));

      setGenesisNFTBalance(balance);
      setCheckingGenesis(false);
    } catch (error) {
      console.log({ error });
    }
  };

  /**
   * Compare claimStartTime with current timestamp.
   *
   * Claim is enabled if startTime is greater than 0 or startTime is less
   * than current timestamp.
   */
  const getClaimEnabled = async () => {
    const startTime = parseInt(await RugClaimModule.getStartTime());
    const currentTimestamp = new Date().getTime();

    if (startTime !== 0 || startTime < currentTimestamp) {
      setClaimEnabled(true);
    } else {
      setClaimEnabled(false);
    }

    setClaimStartTime(startTime);
  };

  useEffect(() => {
    if (!account || !GENESIS_NFT) return;

    checkTokenBalance();
    getClaimEnabled();
  }, [account, GENESIS_NFT]);

  return {
    claimStartTime,
    claimEnabled,
    genesisNFTBalance,
    loading: checkingGenesis,
    hasGenesisNFT: genesisNFTBalance > 0,
  };
};

export default useOwnsGenesisNFT;
