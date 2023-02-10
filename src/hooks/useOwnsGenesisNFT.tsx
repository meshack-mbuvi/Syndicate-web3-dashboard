import { ERC721Contract } from '@/ClubERC20Factory/ERC721Membership';
import { AppState } from '@/state';
import ERC20ABI from '@/utils/abi/erc20.json';
import { getWeiAmount } from '@/utils/conversions';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Contract } from 'web3-eth-contract';

const useOwnsGenesisNFT: any = () => {
  const GENESIS_NFT = process.env.NEXT_PUBLIC_GenesisNFT;

  const {
    web3Reducer: {
      web3: { account, web3, activeNetwork }
    },
    initializeContractsReducer: {
      syndicateContracts: { RugClaimModule }
    }
  } = useSelector((state: AppState) => state);

  const [genesisNFTBalance, setGenesisNFTBalance] = useState(0);
  const [checkingGenesis, setCheckingGenesis] = useState(true);
  const [claimEnabled, setClaimEnabled] = useState(false);
  const [claimStartTime, setClaimStartTime] = useState(0);

  const checkTokenBalance = async (): Promise<void> => {
    if (!account || !GENESIS_NFT) return;
    try {
      const ERC721tokenContract = new ERC721Contract(
        GENESIS_NFT as string,
        web3
      );

      const balance = parseInt(await ERC721tokenContract.balanceOf(account));

      setGenesisNFTBalance(balance);
      setCheckingGenesis(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const rugTokenAddress = process.env.NEXT_PUBLIC_RUG_TOKEN;

  // account has tokens
  const [accountRugTokens, setAccountRugTokens] = useState(0);
  const [rugRadioContract, setRugRadioContract] = useState<Contract>();

  useEffect(() => {
    if (web3?.eth) {
      setRugRadioContract(
        new web3.eth.Contract(ERC20ABI as AbiItem[], rugTokenAddress)
      );
    }
  }, [activeNetwork.chainId]);

  // check whether user has RUG tokens
  const availableRugTokens = async (): Promise<void> => {
    try {
      const [tokens, decimals] = await Promise.all([
        rugRadioContract?.methods.balanceOf(account).call(),
        rugRadioContract?.methods.decimals().call()
      ]).catch(() => [0, '0']);

      setAccountRugTokens(+getWeiAmount(tokens, decimals, false));
    } catch (error) {
      setAccountRugTokens(0);
    }
  };

  /**
   * Compare claimStartTime with current timestamp.
   *
   * Claim is enabled if startTime is greater than 0 or startTime is less
   * than current timestamp.
   */
  const getClaimEnabled = async (): Promise<void> => {
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
    if (!account || !GENESIS_NFT) return setAccountRugTokens(0);

    checkTokenBalance();
    getClaimEnabled();
    availableRugTokens();
  }, [account, GENESIS_NFT]);

  return {
    claimStartTime,
    claimEnabled,
    genesisNFTBalance,
    loading: checkingGenesis,
    hasGenesisNFT: genesisNFTBalance > 0,
    hasRugTokens: accountRugTokens > 0
  };
};

export default useOwnsGenesisNFT;
