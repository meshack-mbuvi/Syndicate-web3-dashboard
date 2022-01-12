import { AppState } from "@/state";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { setUtilityNFT, clearUtilityNFT } from "@/state/UtilityNFT/slice";
import { ERC721Contract } from "@/ClubERC20Factory/ERC721Membership";
import { MembershipPass, Utility } from "@/state/UtilityNFT/types";
import { getWeiAmount } from "@/utils/conversions";
import {
  getEthereumTokenPrice,
  getEtherscanTransactionHistory,
} from "@/utils/api/etherscan";

const useUtilityNFT: any = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account: address, web3 },
    },
    utilityNFTSliceReducer,
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: AppState) => state);

  const { RugUtilityMintModule } = syndicateContracts;

  const router = useRouter();
  const [redemptionToken, setRedemptionToken] = useState<string>("");
  const [balance, setMembershipBalance] = useState<number>(0);
  const [memberships, setMembership] = useState<MembershipPass[]>([]);
  const [claimAvailable, setClaimAvailable] = useState<boolean>(false);
  const [ethPrice, setEthPRice] = useState<string>("0");
  const [tokenPrice, setTokenPRice] = useState<number>(0);
  const [membershipToken, setMembershipToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingBasic, setLoadingBasic] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingMambershipTokens, setMambershipTokens] =
    useState<boolean>(false);

  const getRedemptionToken = async () => {
    setRedemptionToken("");
    const response = await RugUtilityMintModule.redemptionToken();
    setRedemptionToken(response);
    return response;
  };

  const getMembershipToken = async () => {
    const response = await RugUtilityMintModule.membership();
    setMembershipToken(response);
    return response;
  };

  const checkTokenOwnership = async (
    owner: string,
    contract: string,
    tokenId: string,
  ) => {
    const ERC721tokenContract = new ERC721Contract(contract as string, web3);

    return owner == (await ERC721tokenContract.ownerOf(tokenId));
  };

  const getTokenClaimStatus = async (tokenID) => {
    // get claim status
    const response = await RugUtilityMintModule.tokenRedeemed(tokenID);
    return response;
  };

  const getEthPrice = async () => {
    const response = await Promise.all([
      RugUtilityMintModule.ethPrice(),
      getEthereumTokenPrice(),
    ])
      .then((result) => result)
      .catch(() => []);

    const [priceResponse, eth_response] = response;

    setEthPRice(priceResponse);
    setTokenPRice(eth_response);

    return priceResponse;
  };

  const getMembershipTokens = async () => {
    const result = await getEtherscanTransactionHistory(
      address,
      redemptionToken,
    );

    const tokenIds = new Set<string>();
    result.forEach((el) => {
      tokenIds.add(el.tokenID);
    });

    let _memberships = new Array();

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
          const utility: Utility = { image: "", role: "" };

          const membership = {
            token_id: tokenId,
            claimed,
            utility,
          };

          _memberships = [..._memberships, membership];

          setMembership(_memberships);
        }),
      );
    }
    setMambershipTokens(false);
  };

  const checkTokenBalance = async () => {
    if (redemptionToken) {
      setMembershipBalance(0);
      const ERC721tokenContract = new ERC721Contract(
        redemptionToken as string,
        web3,
      );

      const balance = parseInt(await ERC721tokenContract.balanceOf(address));
      setMembershipBalance(balance);
    }
    setLoadingBalance(false);
  };

  const fetchBasicDetails = async () => {
    await getRedemptionToken();
    await getMembershipToken();
    await getEthPrice();
    setLoadingBasic(false);
  };

  useEffect(() => {
    if (redemptionToken && membershipToken) {
      setLoadingBalance(true);
      checkTokenBalance();
    }
  }, [redemptionToken, membershipToken]);

  useEffect(() => {
    if (balance > 0 && redemptionToken && address) {
      setMambershipTokens(true);
      getMembershipTokens();
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
      fetchBasicDetails();
    }
  }, [address, router.isReady]);

  const processClaimData = () => {
    dispatch(
      setUtilityNFT({
        account: address,
        claimAvailable,
        redemptionToken,
        membershipToken,
        totalClaims: balance,
        ethPrice,
        price: getWeiAmount(ethPrice, 18, false),
        priceUSD: parseFloat(
          (
            parseFloat(String(tokenPrice)) *
            parseFloat(String(getWeiAmount(ethPrice, 18, false)))
          ).toFixed(2),
        ),
        membershipPasses: memberships,
      }),
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
    if (ethPrice && tokenPrice && membershipToken) {
      processClaimData();
    }
  }, [
    address,
    utilityNFTSliceReducer.loading,
    redemptionToken,
    balance,
    memberships,
    ethPrice,
    tokenPrice,
    membershipToken,
  ]);

  return { loading };
};

export default useUtilityNFT;
