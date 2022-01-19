import { ClubERC20Contract } from "@/ClubERC20Factory/clubERC20";
import { CLUBS_HAVE_INVESTED, MY_CLUBS_QUERY } from "@/graphql/queries";
import { AppState } from "@/state";
import {
  setLoadingClubERC20s,
  setMyClubERC20s,
  setOtherClubERC20s,
} from "@/state/clubERC20";
import { formatDate, pastDate } from "@/utils";
import { getWeiAmount } from "@/utils/conversions";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useClubERC20s = () => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: { web3 },
  } = useSelector((state: AppState) => state);

  const [accountHasClubs, setAccountHasClubs] = useState(false);

  const router = useRouter();

  const { account, currentEthereumNetwork } = web3;

  // Retrieve syndicates that I manage
  const { loading, refetch, data } = useQuery(MY_CLUBS_QUERY, {
    variables: {
      where: {
        ownerAddress: account.toLocaleLowerCase(),
      },
    },
    // Avoid unnecessary calls when account is not defined
    skip: !account,
  });

  const {
    loading: memberClubLoading,
    data: memberClubData = [],
    refetch: refetchMyClubs,
  } = useQuery(CLUBS_HAVE_INVESTED, {
    variables: {
      where: {
        memberAddress: account.toLocaleLowerCase(),
      },
    },
    // Avoid unnecessary calls when account is not defined
    skip: !account,
  });

  useEffect(() => {
    if (router.isReady) {
      refetch();
      refetchMyClubs();
    }
  }, [router.isReady, account]);

  const processClubERC20Tokens = async (tokens) => {
    dispatch(setLoadingClubERC20s(false));

    if (!tokens || !tokens?.length) return [];
    dispatch(setLoadingClubERC20s(true));

    const processedTokens = await Promise.all([
      ...tokens.map(
        async ({
          contractAddress,
          members,
          ownerAddress,
          totalSupply,
          depositAmount,
        }) => {
          // get clubERC20 configs
          const {
            endTime,
            maxMemberCount,
            maxTotalSupply,
            requiredToken,
            requiredTokenMinBalance,
            startTime,
          } = await syndicateContracts?.mintPolicy?.getSyndicateValues(
            contractAddress,
          );

          const clubERC20Contract = new ClubERC20Contract(
            contractAddress,
            web3.web3,
          );

          const depositToken =
            await syndicateContracts?.SingleTokenMintModule?.depositToken(
              contractAddress,
            );

          const decimals = await clubERC20Contract.decimals();
          const clubName = await clubERC20Contract.name();
          const depositERC20TokenSymbol = await new ClubERC20Contract(
            depositToken,
            web3.web3,
          ).symbol();

          const depositsEnabled = !pastDate(new Date(+endTime * 1000));

          //  calculate ownership share
          const memberDeposits = getWeiAmount(depositAmount, 6, false);
          const totalDeposits = getWeiAmount(totalSupply, +decimals, false);

          const ownershipShare = (+memberDeposits * 100) / +totalDeposits;
          const maxTotalSupplyInWei = getWeiAmount(
            maxTotalSupply,
            +decimals,
            false,
          );

          let status = "Open to deposits";
          if (!depositsEnabled) {
            status = "Active";
          } else if (+totalDeposits === +maxTotalSupplyInWei) {
            status = "Fully deposited";
          }

          return {
            clubName,
            ownershipShare,
            depositsEnabled,
            endTime,
            depositERC20TokenSymbol,
            maxMemberCount,
            maxTotalSupply: maxTotalSupplyInWei,
            requiredToken,
            requiredTokenMinBalance,
            address: contractAddress,
            ownerAddress,
            totalDeposits: getWeiAmount(totalSupply, +decimals, false),
            membersCount: members.length,
            memberDeposits,
            status,
            startTime: formatDate(new Date(+startTime * 1000)),
            isOwner:
              ownerAddress.toLocaleLowerCase() == account.toLocaleLowerCase(),
          };
        },
      ),
    ]);

    const clubsERC20s = processedTokens.filter(
      ({ isOwner }) => isOwner !== true,
    );
    const myClubs = processedTokens.filter(({ isOwner }) => isOwner === true);

    dispatch(setMyClubERC20s(myClubs));
    dispatch(setOtherClubERC20s(clubsERC20s));
    dispatch(setLoadingClubERC20s(false));
  };

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
    // This will reset syndicate details when we are on portfolio page.
    // The currentEthereumNetwork has been added as a dependency to trigger a re-fetch
    // whenever the Ethereum network is changed.
    dispatch(setLoadingClubERC20s(true));
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

      // check whether connected account has clubs
      if (data.syndicateDAOs.length) {
        setAccountHasClubs(true);
      } else {
        setAccountHasClubs(false);
      }

      processClubERC20Tokens([...data.syndicateDAOs, ...clubTokens]);
    } else {
      dispatch(setOtherClubERC20s([]));
      dispatch(setMyClubERC20s([]));
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

  return { loading, memberClubLoading, accountHasClubs };
};

export default useClubERC20s;
