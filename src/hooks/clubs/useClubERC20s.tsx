import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { CLUBS_HAVE_INVESTED, MY_CLUBS_QUERY } from '@/graphql/queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import {
  setLoadingClubERC20s,
  setMyClubERC20s,
  setOtherClubERC20s
} from '@/state/clubERC20';
import { Status } from '@/state/wallet/types';
import { formatDate, isZeroAddress, pastDate } from '@/utils';
import { getTokenDetails } from '@/utils/api';
import { getDepositToken } from '@/utils/contracts/depositToken';
import { divideIfNotByZero, getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { invertBy, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from '../utils/useLocalStorage';

const useClubERC20s = () => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: { web3: web3Instance }
  } = useSelector((state: AppState) => state);

  const [accountHasClubs, setAccountHasClubs] = useState(false);

  const router = useRouter();

  const { account, activeNetwork, web3, status } = web3Instance;
  const accountAddress = useMemo(() => account.toLocaleLowerCase(), [account]);
  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingMemberClubs, setIsLoadingMemberClubs] = useState(true);
  const [isLoadingAdminClubs, setIsLoadingAdminClubs] = useState(true);

  // Retrieve syndicates that I manage
  const { loading, refetch, data } = useQuery(MY_CLUBS_QUERY, {
    variables: {
      where: { ownerAddress: accountAddress }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    // Avoid unnecessary calls when account is not defined
    skip:
      !accountAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED
  });

  const {
    loading: memberClubLoading,
    data: memberClubData,
    refetch: refetchMyClubs
  } = useQuery(CLUBS_HAVE_INVESTED, {
    variables: {
      where: {
        memberAddress: accountAddress
      }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    // Avoid unnecessary calls when account is not defined
    skip:
      !accountAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED
  });

  useEffect(() => {
    if (status === Status.DISCONNECTED && router.isReady) {
      // clear clubs
      dispatch(setOtherClubERC20s([]));

      dispatch(setMyClubERC20s([]));
      return;
    }

    if (
      accountAddress &&
      router.isReady &&
      activeNetwork.chainId &&
      status == Status.CONNECTED
    ) {
      refetch({
        where: { ownerAddress: accountAddress }
      });
      refetchMyClubs({
        where: { memberAddress: accountAddress }
      });
    }
  }, [
    router.isReady,
    activeNetwork.chainId,
    accountAddress,
    refetch,
    refetchMyClubs,
    status
  ]);

  // Loading state when account is connected and when not connected
  useEffect(() => {
    if (!accountAddress) {
      setIsLoadingAdminClubs(false);
      setIsLoadingMemberClubs(false);
      dispatch(setMyClubERC20s([]));
      dispatch(setOtherClubERC20s([]));

      return;
    }
    if (data == undefined || memberClubData == undefined) {
      setIsLoadingAdminClubs(true);
      setIsLoadingMemberClubs(true);
    }
  }, [data, memberClubData, accountAddress]);

  const getMemberClubs = useCallback(async () => {
    dispatch(setOtherClubERC20s([]));

    if (
      memberClubLoading ||
      status == Status.DISCONNECTED ||
      !accountAddress ||
      !memberClubData ||
      !accountAddress ||
      isEmpty(web3)
    )
      return;

    const clubTokens = [];

    // get clubs connected account has invested in
    if (memberClubData?.members?.length) {
      for (
        let memberIndex = 0;
        memberIndex < memberClubData?.members?.length;
        memberIndex++
      ) {
        const member = memberClubData.members[memberIndex];
        if (
          member?.memberAddress.toLowerCase() !== accountAddress.toLowerCase()
        )
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
                createdAt,
                ownerAddress,
                totalSupply,
                totalDeposits,
                maxTotalSupply,
                members,
                endTime,
                startTime
              }
            } = syndicateDAO;

            clubTokens.push({
              depositAmount,
              contractAddress,
              createdAt,
              ownerAddress,
              totalSupply,
              totalDeposits,
              maxTotalSupply,
              members,
              endTime,
              startTime
            });
          }
        }
      }
    }

    const tokens = await processClubERC20Tokens(clubTokens);
    dispatch(setOtherClubERC20s(tokens));
    setIsLoadingMemberClubs(false);
  }, [
    activeNetwork,
    memberClubData,
    memberClubLoading,
    status,
    accountAddress
  ]);

  useEffect(() => {
    getMemberClubs();
  }, [memberClubData]);

  const getAdminClubs = useCallback(async () => {
    // Reset clubs
    dispatch(setMyClubERC20s([]));

    if (
      loading ||
      isEmpty(web3) ||
      status == Status.DISCONNECTED ||
      !accountAddress ||
      !data
    )
      return;

    processClubERC20Tokens(data?.syndicateDAOs).then(async (data) => {
      const clubsIAdmin = data;
      if (
        newlyCreatedClub?.account.toLowerCase() === account.toLowerCase() &&
        web3 &&
        activeNetwork.chainId == newlyCreatedClub?.activeNetwork?.chainId
      ) {
        const {
          tokenAddress,
          name,
          symbol,
          depositTokenSymbol,
          endTime,
          depositTokenLogo
        } = newlyCreatedClub;

        const clubsByAddress = invertBy(data, 'address');
        let clubs = data;

        // Check whether newly created club already exists from the graph query data.
        // Ignore it if already exists, otherwise add it to the list of existing clubs
        if (!clubsByAddress[newlyCreatedClub?.clubAddress]) {
          clubs = [
            {
              address: tokenAddress,
              clubName: name,
              clubSymbol: symbol,
              contractAddress: tokenAddress,
              depositERC20TokenSymbol: depositTokenSymbol,
              depositTokenLogo,
              endTime,
              isOwner: true,
              membersCount: 0,
              status: 'Open to deposits',
              totalDeposits: '0'
            },
            ...data
          ];
          remove();
        }

        dispatch(setMyClubERC20s(clubs));
        setIsLoadingAdminClubs(false);
      } else {
        dispatch(setMyClubERC20s(clubsIAdmin));
        setIsLoadingAdminClubs(false);
      }
    });
  }, [
    getMemberClubs,
    data?.syndicateDAOs,
    activeNetwork,
    loading,
    status,
    accountAddress
  ]);

  const [newlyCreatedClub, , remove] = useLocalStorage('newlyCreatedClub');

  useEffect(() => {
    if (isLoadingAdminClubs || isLoadingMemberClubs) return;

    dispatch(setLoadingClubERC20s(false));
    setIsLoading(false);

    return () => {
      setIsLoading(true);
    };
  }, [dispatch, isLoadingAdminClubs, isLoadingMemberClubs]);

  // Process clubs a given wallet manages
  useEffect(() => {
    getAdminClubs();
  }, [data?.syndicateDAOs]);

  const processClubERC20Tokens = async (tokens: any) => {
    if (!tokens || !tokens?.length) {
      return [];
    }

    const processedTokens = await (
      await Promise.all([
        ...tokens.map(
          async ({
            contractAddress,
            members,
            ownerAddress,
            totalDeposits,
            totalSupply,
            startTime,
            endTime,
            maxMemberCount,
            requiredToken,
            requiredTokenMinBalance,
            depositAmount,
            maxTotalSupply
          }: any) => {
            let clubERC20Contract;
            let decimals = '0';
            let clubName = '';
            let clubSymbol = '';

            try {
              // assumes ClubERC20 same for all factories
              clubERC20Contract = new ClubERC20Contract(
                contractAddress,
                web3,
                activeNetwork
              );

              decimals = await clubERC20Contract.decimals();
              clubName = await clubERC20Contract.name();
              clubSymbol = await clubERC20Contract.symbol();
            } catch (error) {
              // error is thrown for clubs that were used in claim flow.
              return;
            }

            const maxTotalSupplyFromWei = getWeiAmount(
              web3,
              maxTotalSupply,
              +decimals,
              false
            );

            const totalSupplyFromWei = getWeiAmount(
              web3,
              totalSupply,
              +decimals,
              false
            );

            let depositToken;
            try {
              depositToken = await getDepositToken(
                contractAddress,
                syndicateContracts
              );
            } catch (error) {
              console.log({ error });
            }

            let depositERC20TokenSymbol = activeNetwork.nativeCurrency.symbol;
            let depositERC20TokenDecimals =
              activeNetwork.nativeCurrency.decimals;
            let depositTokenLogo = activeNetwork.logo;

            const maxTotalDeposits =
              +maxTotalSupplyFromWei /
              activeNetwork.nativeCurrency.exchangeRate;
            // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            if (!isZeroAddress(depositToken) && depositToken) {
              try {
                // assumes that only ClubERC20Contract and ERC20ClubFactory are possible
                // both have same calls for symbol, tokenDetails etc.
                const depositERC20Token = new ClubERC20Contract(
                  depositToken,
                  web3,
                  activeNetwork
                );
                depositERC20TokenSymbol = await depositERC20Token.symbol();
                depositERC20TokenDecimals = await depositERC20Token.decimals();
                // @ts-expect-error TS(2322): Type 'string | null | undefined' is not assignable... Remove this comment to see the full error message
                depositTokenLogo = await getTokenDetails(
                  depositToken,
                  activeNetwork.chainId
                )
                  .then((res) => res.data.logo)
                  .catch(() => null);
              } catch (error) {
                console.log(error);
              }
            }

            const depositsEnabled = !pastDate(new Date(+endTime * 1000));

            const memberDeposits = getWeiAmount(
              web3,
              depositAmount,
              depositERC20TokenDecimals
                ? parseInt(depositERC20TokenDecimals)
                : 18,
              false
            );

            let clubTotalDeposits = 0;
            if (depositERC20TokenDecimals) {
              clubTotalDeposits = getWeiAmount(
                web3,
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
              (currentMember: any) =>
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
              contractAddress,
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
      ])
    ).filter((club) => club !== undefined);

    return processedTokens;
  };

  useEffect(() => {
    if (isEmpty(web3)) return;
    // This will reset syndicate details when we are on portfolio page.
    // The currentEthereumNetwork has been added as a dependency to trigger a re-fetch
    // whenever the Ethereum network is changed.
    if (accountAddress && !loading && data?.syndicateDAOs?.length) {
      setAccountHasClubs(true);
    } else {
      setAccountHasClubs(false);
    }
  }, [accountAddress, activeNetwork, data?.syndicateDAOs, loading, web3]);

  return { isLoading, memberClubLoading, accountHasClubs };
};

export default useClubERC20s;
