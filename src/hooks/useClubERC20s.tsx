import { ClubERC20Contract } from "@/ClubERC20Factory/clubERC20";
import { CLUBS_HAVE_INVESTED, MY_CLUBS_QUERY } from "@/graphql/queries";
import { AppState } from "@/state";
import {
  setLoadingClubERC20s,
  setMyClubERC20s,
  setOtherClubERC20s,
} from "@/state/clubERC20";
import { formatDate, isZeroAddress, pastDate } from "@/utils";
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
    if (account && router.isReady) {
      refetch({
        where: {
          ownerAddress: account.toLocaleLowerCase(),
        },
      });
      refetchMyClubs({
        where: {
          memberAddress: account.toLocaleLowerCase(),
        },
      });
    }
  }, [router.isReady, account]);

  const [clubIAmMember, setClubIamMember] = useState([]);
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    processClubERC20Tokens(clubIAmMember).then((data) => {
      dispatch(setOtherClubERC20s(data));
    });
  }, [JSON.stringify(clubIAmMember)]);

  useEffect(() => {
    processClubERC20Tokens(myClubs).then((data) => {
      dispatch(setMyClubERC20s(data));
    });
  }, [JSON.stringify(myClubs)]);

  const processClubERC20Tokens = async (tokens) => {
    dispatch(setLoadingClubERC20s(false));
    if (!tokens || !tokens?.length) {
      return [];
    }

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
          let {
            endTime,
            maxMemberCount,
            maxTotalSupply,
            requiredToken,
            requiredTokenMinBalance,
            startTime,
          } = await syndicateContracts?.policyMintERC20?.getSyndicateValues(
            contractAddress,
          );

          if (
            !+endTime &&
            !+maxMemberCount &&
            !+maxTotalSupply &&
            !+startTime
          ) {
            ({
              endTime,
              maxMemberCount,
              maxTotalSupply,
              requiredToken,
              requiredTokenMinBalance,
              startTime,
            } = await syndicateContracts?.mintPolicy?.getSyndicateValues(
              contractAddress,
            ));
          }

          let clubERC20Contract;
          let decimals = 0;
          let clubName = "";

          try {
            clubERC20Contract = new ClubERC20Contract(
              contractAddress,
              web3.web3,
            );

            decimals = await clubERC20Contract.decimals();
            clubName = await clubERC20Contract.name();
          } catch (error) {
            // error is thrown for clubs that were used in claim flow.
            return;
          }

          let depositToken =
            await syndicateContracts?.DepositTokenMintModule?.depositToken(
              contractAddress,
            );

          if (isZeroAddress(depositToken)) {
            depositToken =
              await syndicateContracts?.SingleTokenMintModule?.depositToken(
                contractAddress,
              );
          }

          let depositERC20TokenSymbol = "USDC";
          if (!isZeroAddress(depositToken)) {
            depositERC20TokenSymbol = await new ClubERC20Contract(
              depositToken,
              web3.web3,
            ).symbol();
          }

          const depositsEnabled = !pastDate(new Date(+endTime * 1000));

          let totalDeposits = totalSupply;
          if (decimals) {
            totalDeposits = getWeiAmount(totalSupply, +decimals, false);
          }

          //  calculate ownership share
          const memberDeposits = getWeiAmount(depositAmount, 6, false);

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
            totalDeposits,
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

    dispatch(setLoadingClubERC20s(false));
    return processedTokens.filter((club) => club !== undefined);
  };

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
    // This will reset syndicate details when we are on portfolio page.
    // The currentEthereumNetwork has been added as a dependency to trigger a re-fetch
    // whenever the Ethereum network is changed.
    dispatch(setLoadingClubERC20s(true));
    if (account && !memberClubLoading) {
      const clubTokens = [];
      // get clubs connected account has invested in
      if (memberClubData?.members?.length) {
        for (
          let memberIndex = 0;
          memberIndex < memberClubData?.members?.length;
          memberIndex++
        ) {
          const member = memberClubData.members[memberIndex];
          if (member?.memberAddress.toLowerCase() !== account.toLowerCase())
            return;
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

      setClubIamMember(clubTokens);
    }
    dispatch(setLoadingClubERC20s(false));
  }, [
    account,
    memberClubLoading,
    currentEthereumNetwork,
    memberClubData?.members?.length,
  ]);

  useEffect(() => {
    // This will reset syndicate details when we are on portfolio page.
    // The currentEthereumNetwork has been added as a dependency to trigger a re-fetch
    // whenever the Ethereum network is changed.
    // dispatch(setLoadingClubERC20s(true));
    if (account && !loading && data?.syndicateDAOs) {
      // check whether connected account has clubs
      if (data.syndicateDAOs.length) {
        setAccountHasClubs(true);
      } else {
        setAccountHasClubs(false);
      }
      setMyClubs(data.syndicateDAOs);
    }
  }, [
    account,
    currentEthereumNetwork,
    loading,
    JSON.stringify(data?.syndicateDAOs),
  ]);

  return { loading, memberClubLoading, accountHasClubs };
};

export default useClubERC20s;
