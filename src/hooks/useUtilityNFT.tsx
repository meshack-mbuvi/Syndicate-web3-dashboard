import { AppState } from "@/state";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  setUtilityNFT,
  setLoading,
  clearUtilityNFT,
} from "@/state/UtilityNFT/slice";
import { ERC721Contract } from "@/ClubERC20Factory/ERC721Membership";
import { MembershipPass, Utility } from "@/state/UtilityNFT/types";
import { getWeiAmount } from "@/utils/conversions";
import { getEthereumTokenPrice } from "@/utils/api/etherscan";
import { getOpenseaTokens } from "@/utils/api/opensea";

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
    const { assets } = await getOpenseaTokens(address, redemptionToken);

    let _memberships = new Array();

    if (assets.length > 0) {
      assets.map(async (item, index) => {
        const claimed = await getTokenClaimStatus(item.token_id);

        if (!claimed) {
          setClaimAvailable(true);
        }

        //TODO: get utility info
        const utility: Utility = { image: "", role: "" };

        const membership = {
          ...item,
          claimed,
          utility,
        };

        _memberships = [..._memberships, membership];

        setMembership(_memberships);
      });
    }
  };

  const checkOwnership = async () => {
    if (redemptionToken) {
      const ERC721tokenContract = new ERC721Contract(
        redemptionToken as string,
        web3,
      );

      const balance = parseInt(await ERC721tokenContract.balanceOf(address));
      setMembershipBalance(balance);
    }
    // get membership tokens owned
  };

  const fetchBasicDetails = async () => {
    await getRedemptionToken();
    await getMembershipToken();
    await getEthPrice();
  };

  useEffect(() => {
    if (redemptionToken && membershipToken) {
      checkOwnership();
    }
  }, [redemptionToken, membershipToken]);

  useEffect(() => {
    if (balance > 0) {
      getMembershipTokens();
    } else {
      setClaimAvailable(false);
      dispatch(clearUtilityNFT);
    }
    dispatch(setLoading(false));
  }, [balance]);

  useEffect(() => {
    if (router.isReady && address) {
      // fetch data
      dispatch(setLoading(true));
      fetchBasicDetails();
    } else {
      dispatch(clearUtilityNFT);
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

    dispatch(setLoading(false));
  };

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

  return { loading: utilityNFTSliceReducer.loading };
};

export default useUtilityNFT;
