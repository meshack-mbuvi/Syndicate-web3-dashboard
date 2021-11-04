import { ClubERC20Contract } from "@/ClubERC20Factory/clubERC20";
import { CLUBS_HAVE_INVESTED, MY_CLUBS_QUERY } from "@/graphql/queries";
import { SYNDICATE_BY_ADDRESS } from "@/redux/actions/types";
import { RootState } from "@/redux/store";
import { setClubERC20s } from "@/state/clubERC20";
import { formatDate, pastDate } from "@/utils";
import { getWeiAmount } from "@/utils/conversions";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useClubERC20s = () => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: { web3 },
  } = useSelector((state: RootState) => state);

  const router = useRouter();

  const { account, currentEthereumNetwork } = web3;

  // Retrieve syndicates that I manage
  const { loading, refetch, data } = useQuery(MY_CLUBS_QUERY, {
    variables: {
      where: {
        ownerAddress: account.toLocaleLowerCase(),
      },
    },
  });

  const {
    loading: memberClubLoading,
    data: memberClubData = [],
    refetch: refetchMyClubs,
  } = useQuery(CLUBS_HAVE_INVESTED, {
    variables: {
      where: {
        member: account.toLocaleLowerCase(),
      },
    },
  });

  useEffect(() => {
    if (router.isReady) {
      refetch();
      refetchMyClubs();
    }
  }, [router.isReady, account]);

  const processClubERC20Tokens = async (tokens) => {
    if (!tokens || !tokens?.length) return [];
    const clubsERC20s = [];

    for (let index = 0; index < tokens.length; index++) {
      const {
        contractAddress,
        members,
        ownerAddress,
        totalSupply,
        depositAmount,
      } = tokens[index];
      // get clubERC20 configs
      const {
        endTime,
        maxMemberCount,
        maxTotalSupply,
        requiredToken,
        requiredTokenMinBalance,
        startTime,
      } = await syndicateContracts?.mintPolicyManager?.getSyndicateValues(
        contractAddress,
      );

      const clubERC20Contract = new ClubERC20Contract(
        contractAddress,
        web3.web3,
      );
      const depositToken = await clubERC20Contract.depositToken();

      const decimals = await clubERC20Contract.decimals();
      const depositERC20TokenSymbol = await new ClubERC20Contract(
        depositToken,
        web3.web3,
      ).symbol();

      const depositsEnabled =
        +getWeiAmount(totalSupply, +decimals, false) <
          +getWeiAmount(maxTotalSupply, +decimals, false) &&
        !pastDate(new Date(+endTime * 1000)) &&
        members.length < maxMemberCount;

      clubsERC20s.push({
        depositsEnabled,
        endTime,
        depositERC20TokenSymbol,
        maxMemberCount,
        maxTotalSupply: getWeiAmount(maxTotalSupply, +decimals, false),
        requiredToken,
        requiredTokenMinBalance,
        syndicateAddress: contractAddress,
        ownerAddress,
        depositAmount: depositAmount
          ? getWeiAmount(depositAmount, +decimals, false)
          : "-",
        totalDeposits: getWeiAmount(totalSupply, +decimals, false),
        membersCount: members.length,
        // TODO: Update this when we have exact status
        status: depositsEnabled
          ? `Open until ${formatDate(new Date(+endTime * 1000))}`
          : "Operating",
        distributions: "-",
        myWithdrawals: "-",
        startTime: formatDate(new Date(+startTime * 1000)),
        isOwner:
          ownerAddress.toLocaleLowerCase() == account.toLocaleLowerCase(),
      });
    }
    dispatch(setClubERC20s(clubsERC20s));
    return clubsERC20s;
  };

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
    // This will reset syndicate details when we are on portfolio page.
    // The currentEthereumNetwork has been added as a dependency to trigger a re-fetch
    // whenever the Ethereum network is changed.
    dispatch({
      data: null,
      type: SYNDICATE_BY_ADDRESS,
    });
    if (account && !loading && !memberClubLoading) {
      const clubTokens = [];

      // get clubs connected account has invested in
      if (memberClubData?.members?.length) {
        for (
          let memberIndex = 0;
          memberIndex < memberClubData?.members?.length;
          memberIndex++
        ) {
          const member = memberClubData.members[memberIndex];
          if (member?.syndicateDAOs?.length) {
            const { syndicateDAOs } = member;
            for (
              let clubIndex = 0;
              clubIndex < syndicateDAOs.length;
              clubIndex++
            ) {
              const syndicateDAO = syndicateDAOs[clubIndex];
              // get club details
              const {
                depositAmount,
                syndicateDAO: {
                  contractAddress,
                  createdAt,
                  ownerAddress,
                  totalSupply,
                  members,
                },
              } = syndicateDAO;

              // add the club to club tokens array
              clubTokens.push({
                depositAmount,
                contractAddress,
                createdAt,
                ownerAddress,
                totalSupply,
                members,
              });
            }
          }
        }
      }
      processClubERC20Tokens([...data.syndicateDAOs, ...clubTokens]);
    } else {
      dispatch(setClubERC20s([]));
    }
  }, [
    account,
    currentEthereumNetwork,
    loading,
    memberClubLoading,
    JSON.stringify(memberClubData?.members),
    JSON.stringify(data),
    currentEthereumNetwork,
  ]);

  return { loading, memberClubLoading };
};

export default useClubERC20s;
