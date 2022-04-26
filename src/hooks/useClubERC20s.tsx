import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { CLUBS_HAVE_INVESTED, MY_CLUBS_QUERY } from '@/graphql/queries';
import { AppState } from '@/state';
import {
  setLoadingClubERC20s,
  setMyClubERC20s,
  setOtherClubERC20s
} from '@/state/clubERC20';
import { formatDate, isZeroAddress, pastDate } from '@/utils';
import { getTokenDetails } from '@/utils/api';
import { divideIfNotByZero, getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useClubERC20s = () => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: { web3 }
  } = useSelector((state: AppState) => state);

  const [accountHasClubs, setAccountHasClubs] = useState(false);

  const router = useRouter();

  const {
    account,
    activeNetwork,
    ethereumNetwork: { invalidEthereumNetwork }
  } = web3;
  const accountAddress = useMemo(() => account.toLocaleLowerCase(), [account]);

  // Retrieve syndicates that I manage
  const { loading, refetch, data } = useQuery(MY_CLUBS_QUERY, {
    variables: {
      where: { ownerAddress: accountAddress }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    // Avoid unnecessary calls when account is not defined
    skip: !account || !router.isReady || !activeNetwork.chainId
  });

  const {
    loading: memberClubLoading,
    data: memberClubData = [],
    refetch: refetchMyClubs
  } = useQuery(CLUBS_HAVE_INVESTED, {
    variables: {
      where: {
        memberAddress: accountAddress
      }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    // Avoid unnecessary calls when account is not defined
    skip: !account || !router.isReady || !activeNetwork.chainId
  });

  useEffect(() => {
    if (accountAddress && router.isReady && activeNetwork.chainId) {
      refetch({
        where: { ownerAddress: accountAddress }
      });
      refetchMyClubs({
        where: { memberAddress: accountAddress }
      });
    }
  }, [router.isReady, account, activeNetwork.chainId]);

  const [clubIAmMember, setClubIamMember] = useState([]);
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    processClubERC20Tokens(clubIAmMember).then((data) => {
      dispatch(setOtherClubERC20s(data));
    });
  }, [JSON.stringify(clubIAmMember), activeNetwork]);

  useEffect(() => {
    processClubERC20Tokens(myClubs).then((data) => {
      dispatch(setMyClubERC20s(data));
    });
  }, [JSON.stringify(myClubs), activeNetwork]);

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
          totalDeposits,
          startTime,
          endTime,
          maxMemberCount,
          requiredToken,
          requiredTokenMinBalance,
          depositAmount,
          maxTotalSupply
        }) => {
          let clubERC20Contract;
          let decimals = 0;
          let clubName = '';
          let clubSymbol = '';

          try {
            clubERC20Contract = new ClubERC20Contract(
              contractAddress,
              web3.web3
            );

            decimals = await clubERC20Contract.decimals();
            clubName = await clubERC20Contract.name();
            clubSymbol = await clubERC20Contract.symbol();
          } catch (error) {
            // error is thrown for clubs that were used in claim flow.
            return;
          }

          const maxTotalSupplyFromWei = getWeiAmount(
            maxTotalSupply,
            +decimals,
            false
          );

          const totalSupplyFromWei = getWeiAmount(totalSupply, decimals, false);

          let depositToken =
            await syndicateContracts?.DepositTokenMintModule?.depositToken(
              contractAddress
            );

          if (isZeroAddress(depositToken)) {
            depositToken =
              await syndicateContracts?.SingleTokenMintModule?.depositToken(
                contractAddress
              );
          }

          let depositERC20TokenSymbol = activeNetwork.nativeCurrency.symbol;
          let depositERC20TokenDecimals = activeNetwork.nativeCurrency.decimals;
          let depositTokenLogo = activeNetwork.logo;

          // checks if depositToken is ETH or not
          let maxTotalDeposits =
            +maxTotalSupplyFromWei / activeNetwork.nativeCurrency.exchangeRate;
          if (!isZeroAddress(depositToken) && depositToken) {
            try {
              const depositERC20Token = new ClubERC20Contract(
                depositToken,
                web3.web3
              );
              depositERC20TokenSymbol = await depositERC20Token.symbol();
              depositERC20TokenDecimals = await depositERC20Token.decimals();
              depositTokenLogo = await getTokenDetails(
                depositToken,
                activeNetwork.chainId
              )
                .then((res) => res.data.logo)
                .catch(() => null);
            } catch (error) {
              return;
            }
          }

          const depositsEnabled = !pastDate(new Date(+endTime * 1000));

          //  calculate ownership share
          const memberDeposits = getWeiAmount(
            depositAmount,
            depositERC20TokenDecimals
              ? parseInt(depositERC20TokenDecimals)
              : 18,
            false
          );

          let clubTotalDeposits = 0;
          if (depositERC20TokenDecimals) {
            clubTotalDeposits = getWeiAmount(
              totalDeposits,
              +depositERC20TokenDecimals,
              false
            );
          }

          // calculate ownership share
          // we need to filter to get club tokens amount for this specific member
          // this is not ideal.
          // we should be able to get this value straight from the graph, similar to depositAmount.
          const [member] = members?.filter(
            (currentMember) =>
              currentMember?.member?.memberAddress.toLowerCase() ===
              account.toLowerCase()
          );
          const memberTokens = member?.tokens || 0;

          const ownershipShare = divideIfNotByZero(
            +memberTokens * 100,
            totalSupply
          );

          let status = 'Open to deposits';

          if (!depositsEnabled) {
            status = 'Active';
          } else if (
            +totalSupplyFromWei === +maxTotalSupplyFromWei ||
            +clubTotalDeposits === +maxTotalDeposits
          ) {
            status = 'Fully deposited';
          }

          return {
            clubName,
            clubSymbol,
            ownershipShare,
            depositsEnabled,
            endTime,
            depositERC20TokenSymbol,
            depositTokenLogo,
            maxMemberCount,
            maxTotalSupply: maxTotalSupplyFromWei,
            requiredToken,
            requiredTokenMinBalance,
            address: contractAddress,
            ownerAddress,
            totalDeposits: clubTotalDeposits,
            membersCount: members.length,
            memberDeposits,
            status,
            startTime: formatDate(new Date(+startTime * 1000)),
            isOwner:
              ownerAddress.toLocaleLowerCase() == account.toLocaleLowerCase()
          };
        }
      )
    ]);

    dispatch(setLoadingClubERC20s(false));
    return processedTokens.filter((club) => club !== undefined);
  };

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
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
              const {
                depositAmount,
                syndicateDAO: {
                  contractAddress,
                  endTime,
                  startTime,
                  ownerAddress,
                  totalSupply,
                  totalDeposits,
                  maxTotalSupply,
                  members
                }
              } = syndicateDAO;

              clubTokens.push({
                depositAmount,
                contractAddress,
                endTime,
                startTime,
                ownerAddress,
                totalSupply,
                totalDeposits,
                maxTotalSupply,
                members
              });
            }
          }
        }
      }

      dispatch(setLoadingClubERC20s(false));

      setClubIamMember(clubTokens);
    }
  }, [
    account,
    memberClubLoading,
    activeNetwork,
    memberClubData?.members?.length,
    invalidEthereumNetwork
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
  }, [account, activeNetwork, loading, JSON.stringify(data?.syndicateDAOs)]);

  return { loading, memberClubLoading, accountHasClubs };
};

export default useClubERC20s;
