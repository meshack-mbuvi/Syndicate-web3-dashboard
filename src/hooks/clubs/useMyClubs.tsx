import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { MY_CLUBS_QUERY } from '@/graphql/queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
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
    web3Reducer: { web3: web3Instance }
  } = useSelector((state: AppState) => state);
  const { account, activeNetwork, web3 } = web3Instance;

  const [myClubs, setMyClubs] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const { refetch, data } = useQuery(MY_CLUBS_QUERY, {
    variables: {
      where: {
        ownerAddress: account.toLocaleLowerCase()
      }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    skip: !account || !activeNetwork.chainId
  });

  useEffect(() => {
    void fetchMyClubs();
  }, [JSON.stringify(data?.syndicateDAOs)]);

  const fetchMyClubs = useCallback(async () => {
    if (data?.syndicateDAOs) {
      const clubs = await processMyClubs(data?.syndicateDAOs);
      // @ts-expect-error TS(2345): Argument of type 'any[] | never[]' is not assignab... Remove this comment to see the full error message
      setMyClubs(clubs);
    }
  }, [JSON.stringify(data?.syndicateDAOs)]);

  const processMyClubs = async (tokens: any) => {
    setIsLoading(true);
    return await Promise.all([
      ...tokens.map(async (token: any) => {
        const { contractAddress } = token;

        let clubERC20Contract;
        let clubName = '';
        let clubSymbol = '';

        try {
          clubERC20Contract = new ClubERC20Contract(
            contractAddress,
            web3,
            activeNetwork
          );

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
