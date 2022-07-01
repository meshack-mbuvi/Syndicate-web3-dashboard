import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { CLUBS_HAVE_INVESTED, MY_CLUBS_QUERY } from '@/graphql/queries';
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
import { getClubDataFromContract } from '@/utils/contracts/getClubDataFromContract';
import { divideIfNotByZero, getWeiAmount } from '@/utils/conversions';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from './utils/useLocalStorage';

const useClubERC20s = () => {
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: { web3: web3Instance }
  } = useSelector((state: AppState) => state);

  const [accountHasClubs, setAccountHasClubs] = useState(false);

  const router = useRouter();

  const {
    account,
    activeNetwork,
    ethereumNetwork: { invalidEthereumNetwork },
    web3,
    status
  } = web3Instance;
  const accountAddress = useMemo(() => account.toLocaleLowerCase(), [account]);
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve syndicates that I manage
  const { loading, refetch, data } = useQuery(MY_CLUBS_QUERY, {
    variables: {
      where: { ownerAddress: accountAddress }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    // Avoid unnecessary calls when account is not defined
    skip:
      !accountAddress ||
      !router.isReady ||
      !activeNetwork.chainId ||
      status !== Status.CONNECTED
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
      dispatch(setOtherClubERC20s([]));
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

  const [clubIAmMember, setClubIamMember] = useState([]);
  const [myClubs, setMyClubs] = useState([]);

  // process clubs a given wallet has invested into
  useEffect(() => {
    if (memberClubLoading || status == Status.DISCONNECTED || !accountAddress)
      return;

    processClubERC20Tokens(clubIAmMember).then((data) => {
      dispatch(setOtherClubERC20s(data));
    });
  }, [activeNetwork, clubIAmMember, memberClubLoading, status, accountAddress]);

  const [newlyCreatedClub, , remove] = useLocalStorage('newlyCreatedClub');

  // Process clubs a given wallet manages
  useEffect(() => {
    if (
      loading ||
      isEmpty(web3) ||
      status == Status.DISCONNECTED ||
      !accountAddress
    )
      return;

    processClubERC20Tokens(myClubs).then((data) => {
      const clubsIAdmin = data;

      if (newlyCreatedClub && web3) {
        getClubDataFromContract({
          ...newlyCreatedClub,
          state: { activeNetwork, account, syndicateContracts, web3 }
        }).then((club) => {
          // add new club at the top and filter incase the club has been loaded
          // from the graph
          // Generate a map entry of [[key, item],...]
          // Pass the list of entries into map which eliminates duplicate keys
          const filteredClubs = [
            ...new Map(
              [club, ...data]
                .filter((club) => club != undefined)
                .map((item) => [
                  `${item['contractAddress'].toLowerCase()}`,
                  item
                ])
            ).values()
          ];

          // if club data exist in the graph, delete newly created club from storage
          if (filteredClubs.length == data.length) {
            remove();
          }

          dispatch(setMyClubERC20s(filteredClubs));
          dispatch(setLoadingClubERC20s(false));
        });
      } else {
        dispatch(setMyClubERC20s(clubsIAdmin));
        dispatch(setLoadingClubERC20s(false));
      }
    });
  }, [JSON.stringify(myClubs), activeNetwork, loading, status]);

  const processClubERC20Tokens = async (tokens) => {
    if (!tokens || !tokens?.length) {
      return [];
    }

    setIsLoading(true);

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
          }) => {
            let clubERC20Contract;
            let decimals = 0;
            let clubName = '';
            let clubSymbol = '';

            try {
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
              decimals,
              false
            );

            const depositToken = await getDepositToken(
              contractAddress,
              syndicateContracts
            );

            let depositERC20TokenSymbol = activeNetwork.nativeCurrency.symbol;
            let depositERC20TokenDecimals =
              activeNetwork.nativeCurrency.decimals;
            let depositTokenLogo = activeNetwork.logo;

            // checks if depositToken is ETH or not
            const maxTotalDeposits =
              +maxTotalSupplyFromWei /
              activeNetwork.nativeCurrency.exchangeRate;
            if (!isZeroAddress(depositToken) && depositToken) {
              try {
                const depositERC20Token = new ClubERC20Contract(
                  depositToken,
                  web3,
                  activeNetwork
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

    dispatch(setLoadingClubERC20s(false));
    setIsLoading(false);
    return processedTokens;
  };

  /**
   * We need to be sure syndicateContracts is initialized before retrieving events.
   */
  useEffect(() => {
    if (isEmpty(web3) || memberClubLoading) return;

    if (accountAddress) {
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

      setClubIamMember(clubTokens);
      setIsLoading(false);
    } else {
      dispatch(setLoadingClubERC20s(false));
      setIsLoading(false);
    }
  }, [
    accountAddress,
    memberClubLoading,
    activeNetwork,
    memberClubData?.members,
    invalidEthereumNetwork,
    web3,
    dispatch
  ]);

  useEffect(() => {
    if (isEmpty(web3)) return;
    // This will reset syndicate details when we are on portfolio page.
    // The currentEthereumNetwork has been added as a dependency to trigger a re-fetch
    // whenever the Ethereum network is changed.
    if (account && !loading && data?.syndicateDAOs) {
      // check whether connected account has clubs
      if (data.syndicateDAOs.length) {
        setAccountHasClubs(true);
      } else {
        setAccountHasClubs(false);
      }

      setMyClubs(data.syndicateDAOs);
    } else {
      setIsLoading(false);
    }
  }, [account, activeNetwork, data?.syndicateDAOs, loading]);

  return { loading: isLoading, memberClubLoading, accountHasClubs };
};

export default useClubERC20s;
