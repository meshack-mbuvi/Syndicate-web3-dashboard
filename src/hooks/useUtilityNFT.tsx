import { ERC721Contract } from '@/ClubERC20Factory/ERC721Membership';
import { AppState } from '@/state';
import { clearUtilityNFT, setUtilityNFT } from '@/state/UtilityNFT/slice';
import { MembershipPass, Utility } from '@/state/UtilityNFT/types';
import {
  getNativeTokenPrice,
  getNftTransactionHistory
} from '@/utils/api/transactions';
import { getWeiAmount } from '@/utils/conversions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useUtilityNFT: any = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account: address, web3, activeNetwork }
    },
    utilityNFTSliceReducer,
    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);

  const { RugUtilityMintModule } = syndicateContracts;

  const router = useRouter();
  const [redemptionToken, setRedemptionToken] = useState<string>('');
  const [balance, setMembershipBalance] = useState<number>(0);
  const [memberships, setMembership] = useState<MembershipPass[]>([]);
  const [claimAvailable, setClaimAvailable] = useState<boolean>(false);
  const [nativePrice, setNativePRice] = useState<string>('0');
  const [tokenPrice, setTokenPRice] = useState<number>(0);
  const [membershipToken, setMembershipToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingBasic, setLoadingBasic] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingMambershipTokens, setMambershipTokens] =
    useState<boolean>(false);

  const getRedemptionToken = async (): Promise<string> => {
    setRedemptionToken('');
    const response = await RugUtilityMintModule.redemptionToken();
    setRedemptionToken(response);
    return response;
  };

  const getMembershipToken = async (): Promise<string> => {
    const response = await RugUtilityMintModule.membership();
    setMembershipToken(response);
    return response;
  };

  const checkTokenOwnership = async (
    owner: string,
    contract: string,
    tokenId: string
  ): Promise<boolean> => {
    const ERC721tokenContract = new ERC721Contract(contract as string, web3);

    return owner == (await ERC721tokenContract.ownerOf(tokenId));
  };

  const getTokenClaimStatus = async (tokenID: any): Promise<boolean> => {
    // get claim status
    const response = await RugUtilityMintModule.tokenRedeemed(tokenID);
    return response;
  };

  const getNativePrice = async (): Promise<string> => {
    const response = await Promise.all([
      RugUtilityMintModule.nativePrice(),
      getNativeTokenPrice(activeNetwork.chainId)
    ])
      .then((result) => result)
      .catch(() => []);

    const [priceResponse, native_response] = response;

    setNativePRice(priceResponse);
    setTokenPRice(native_response);

    return priceResponse;
  };

  const getMembershipTokens = async (): Promise<void> => {
    const result = await getNftTransactionHistory(
      address,
      redemptionToken,
      activeNetwork.chainId
    );

    const tokenIds = new Set<string>();
    result.forEach((el) => {
      tokenIds.add(el.tokenID);
    });

    let _memberships: any = [];

    if (tokenIds.size > 0) {
      await Promise.all(
        [...tokenIds].map(async (tokenId) => {
          // Check ownership on tokenId
          if (!(await checkTokenOwnership(address, redemptionToken, tokenId)))
            return;

          const claimed = await getTokenClaimStatus(tokenId);

          if (!claimed) {
            setClaimAvailable(true);
          }

          //TODO: get utility info
          const utility: Utility = { image: '', role: '' };

          const membership = {
            token_id: tokenId,
            claimed,
            utility
          };

          _memberships = [..._memberships, membership];

          setMembership(_memberships);
        })
      );
    }
    setMambershipTokens(false);
  };

  const checkTokenBalance = async (): Promise<void> => {
    if (redemptionToken) {
      setMembershipBalance(0);
      const ERC721tokenContract = new ERC721Contract(
        redemptionToken as string,
        web3
      );

      const balance = parseInt(await ERC721tokenContract.balanceOf(address));
      setMembershipBalance(balance);
    }
    setLoadingBalance(false);
  };

  const fetchBasicDetails = async (): Promise<void> => {
    await getRedemptionToken();
    await getMembershipToken();
    await getNativePrice();
    setLoadingBasic(false);
  };

  useEffect(() => {
    if (redemptionToken && membershipToken) {
      setLoadingBalance(true);
      void checkTokenBalance();
    }
  }, [redemptionToken, membershipToken]);

  useEffect(() => {
    if (balance > 0 && redemptionToken && address) {
      setMambershipTokens(true);
      void getMembershipTokens();
    } else {
      setMambershipTokens(false);
      setClaimAvailable(false);
      dispatch(clearUtilityNFT);
      setMembership([]);
    }
  }, [balance, redemptionToken, address]);

  useEffect(() => {
    if (router.isReady && address) {
      // fetch data
      setLoadingBasic(true);
      void fetchBasicDetails();
    }
  }, [address, router.isReady]);

  const processClaimData = (): void => {
    dispatch(
      setUtilityNFT({
        account: address,
        claimAvailable,
        redemptionToken,
        membershipToken,
        totalClaims: balance,
        nativePrice,
        price: +getWeiAmount(nativePrice, 18, false),
        priceUSD: parseFloat(
          (
            parseFloat(String(tokenPrice)) *
            parseFloat(String(getWeiAmount(nativePrice, 18, false)))
          ).toFixed(2)
        ),
        membershipPasses: memberships
      })
    );
  };

  useEffect(() => {
    if (!loadingBasic && !loadingBalance && !loadingMambershipTokens) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [loadingBasic, loadingBalance, loadingMambershipTokens]);

  useEffect(() => {
    if (nativePrice && tokenPrice && membershipToken) {
      processClaimData();
    }
  }, [
    address,
    utilityNFTSliceReducer.loading,
    redemptionToken,
    balance,
    memberships,
    nativePrice,
    tokenPrice,
    membershipToken
  ]);

  return { loading };
};

export default useUtilityNFT;
