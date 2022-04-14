import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { MY_CLUBS_QUERY } from '@/graphql/queries';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface IProps {
  myClubs: {
    clubName: string;
    clubSymbol: string;
  }[];
  refetch: () => void;
  totalClubs: number;
  loading: boolean;
  isFetched: boolean;
}

export const useMyClubs = (): IProps => {
  const {
    web3Reducer: { web3 }
  } = useSelector((state: AppState) => state);
  const { account, activeNetwork } = web3;

  const [myClubs, setMyClubs] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const { refetch, data } = useQuery(MY_CLUBS_QUERY, {
    variables: {
      where: {
        ownerAddress: account.toLocaleLowerCase()
      }
    },
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId },
    skip: !account || !activeNetwork.chainId
  });

  useEffect(() => {
    void fetchMyClubs();
  }, [JSON.stringify(data?.syndicateDAOs)]);

  const fetchMyClubs = useCallback(async () => {
    if (data?.syndicateDAOs) {
      const clubs = await processMyClubs(data?.syndicateDAOs);
      setMyClubs(clubs);
    }
  }, [JSON.stringify(data?.syndicateDAOs)]);

  const processMyClubs = async (tokens) => {
    setIsLoading(true);
    return await Promise.all([
      ...tokens.map(async (token) => {
        const { contractAddress } = token;

        let clubERC20Contract;
        let clubName = '';
        let clubSymbol = '';

        try {
          clubERC20Contract = new ClubERC20Contract(contractAddress, web3.web3);

          clubName = await clubERC20Contract.name();
          clubSymbol = await clubERC20Contract.symbol();
        } catch (error) {
          return;
        }

        return {
          clubName,
          clubSymbol
        };
      })
    ])
      .then((res) => {
        setIsLoading(false);
        return res;
      })
      .catch(() => {
        setIsLoading(false);
        return [];
      });
  };

  return {
    myClubs,
    refetch,
    loading,
    totalClubs: myClubs.length,
    isFetched: Boolean(data?.syndicateDAOs.length)
  };
};
