import { SINGLE_CLUB_DETAILS } from '@/graphql/queries';
import { SingleClubData } from '@/graphql/types';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { setActiveModuleDetails, setIsNewClub } from '@/state/erc20token/slice';
import { ModuleReqs, ModuleType } from '@/types/modules';
import { getWeiAmount } from '@/utils/conversions';
import {
  MOCK_END_TIME,
  MOCK_START_TIME,
  MOCK_TOTALDEPOSITS,
  MOCK_TOTALSUPPLY
} from '@/utils/mockdata';
import getModuleByType from '@/utils/modules/getModuleByType';
import getReqsByModuleType from '@/utils/modules/getReqsByModuleType';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useConnectedAccountDetails } from '../useConnectedAccountDetails';
import { useDemoMode } from '../useDemoMode';

// TODO: [REFACTOR] rename to useSingleClubGraphDetails for readability
/**
 * Retrieves club total deposits and total supply from the thegraph.
 * NOTE: More fields like owner address can also be retrieved if needed.
 * @param contractAddress
 * @returns
 */
export function useClubDepositsAndSupply(contractAddress: string): {
  refetch: any;
  totalDeposits: any;
  totalSupply: any;
  startTime: any;
  endTime: any;
  hasActiveModules: boolean;
  mintModule: string;
  activeMintModuleReqs: ModuleReqs;
  ownerModule: string;
  activeOwnerModuleReqs: ModuleReqs;
  loadingClubDeposits: boolean;
} {
  const {
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: { depositTokenDecimals }
    },
    web3Reducer: {
      web3: { activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  const { tokenDecimals } = erc20Token;

  const [totalDeposits, setTotalDeposits] = useState('');
  const [totalSupply, setTotalSupply] = useState('0');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [loadingClubDeposits, setLoadingClubDeposits] = useState(true);
  const [hasActiveModules, setHasActiveModules] = useState<boolean>(false);
  const [ownerModule, setOwnerModule] = useState<string>('');
  const [mintModule, setMintModule] = useState<string>('');
  const [activeOwnerReqs, setActiveOwnerReqs] = useState<ModuleReqs>({});
  const [activeMintReqs, setActiveMintReqs] = useState<ModuleReqs>({});

  const { isReady } = useRouter();
  const isDemoMode = useDemoMode();
  const dispatch = useDispatch();

  // SINGLE_CLUB_DETAILS
  const { loading, data, refetch } = useQuery<SingleClubData>(
    SINGLE_CLUB_DETAILS,
    {
      variables: {
        where: {
          contractAddress: contractAddress?.toLocaleLowerCase()
        }
      },
      context: {
        clientName: SUPPORTED_GRAPHS.THE_GRAPH,
        chainId: activeNetwork.chainId
      },
      // Avoid unnecessary calls when contractAddress is not defined or in demo mode
      skip: !contractAddress || !activeNetwork.chainId || isDemoMode
    }
  );

  const { memberDeposits, accountTokens } = useConnectedAccountDetails();

  /**
   * Retrieve totalDeposits,totalSupply from the thegraph
   *
   * Also,whenever connected wallet tokens/deposits change, refetch club details
   */
  useEffect(() => {
    if (isDemoMode) {
      setTotalSupply(MOCK_TOTALSUPPLY);
      setTotalDeposits(MOCK_TOTALDEPOSITS);
      setStartTime(MOCK_START_TIME);
      setEndTime(MOCK_END_TIME);
      setLoadingClubDeposits(false);
      return;
    }

    if (
      !web3 ||
      loading ||
      !data ||
      erc20Token?.loading ||
      data.syndicateDAOs.length == 0
    )
      return;

    const {
      syndicateDAOs: [syndicateDAO]
    } = data || {};

    let { startTime, endTime } = syndicateDAO || {};

    const activeModules = syndicateDAO.activeModules;

    if (activeModules.length > 0) {
      const mintModule = getModuleByType(
        ModuleType.MINT,
        activeModules,
        activeNetwork
      );
      let activeMintReqs: ModuleReqs;

      if (mintModule) {
        // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ModuleReqs'.
        activeMintReqs = getReqsByModuleType(
          ModuleType.MINT,
          activeModules,
          activeNetwork,
          mintModule
        );
        setMintModule(web3.utils.toChecksumAddress(mintModule.contractAddress));
        setActiveMintReqs(activeMintReqs);
      }

      const ownerModule = getModuleByType(
        ModuleType.OWNER,
        activeModules,
        activeNetwork
      );
      let activeOwnerReqs: ModuleReqs;

      if (ownerModule) {
        // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ModuleReqs'.
        activeOwnerReqs = getReqsByModuleType(
          ModuleType.OWNER,
          activeModules,
          activeNetwork,
          ownerModule
        );
        setOwnerModule(ownerModule.contractAddress);
        setActiveOwnerReqs(activeOwnerReqs);
      }

      // @ts-expect-error TS(2454): Variable 'activeMintReqs' is used before being assig... Remove this comment to see the full error message
      startTime = `${activeMintReqs?.startTime}`;
      // @ts-expect-error TS(2454): Variable 'activeMintReqs' is used before being assig... Remove this comment to see the full error message
      endTime = `${activeMintReqs?.endTime}`;
      dispatch(
        setActiveModuleDetails({
          hasActiveModules: activeModules.length > 0,
          activeModules: activeModules,
          mintModule:
            web3.utils.toChecksumAddress(mintModule?.contractAddress) ?? '',
          // @ts-expect-error TS(2454): Variable 'activeMintReqs' is used before being assig... Remove this comment to see the full error message
          activeMintModuleReqs: activeMintReqs,
          ownerModule:
            web3.utils.toChecksumAddress(ownerModule?.contractAddress) ?? '',
          // @ts-expect-error TS(2454): Variable 'activeOwnerReqs' is used before being assig... Remove this comment to see the full error message
          activeOwnerModuleReqs: activeOwnerReqs
        })
      );
      dispatch(setIsNewClub(activeModules.length > 0));
    }

    setTotalSupply(
      getWeiAmount(syndicateDAO.totalSupply, tokenDecimals || 18, false)
    );
    setTotalDeposits(
      getWeiAmount(syndicateDAO.totalDeposits, depositTokenDecimals, false)
    );
    setStartTime(+startTime * 1000);
    setEndTime(+endTime * 1000);
    setHasActiveModules(activeModules.length > 0);
    setLoadingClubDeposits(false);
  }, [
    data,
    loading,
    tokenDecimals,
    erc20Token.loading,
    isReady,
    memberDeposits,
    accountTokens,
    depositTokenDecimals
  ]);

  return {
    totalDeposits,
    totalSupply,
    startTime,
    endTime,
    hasActiveModules,
    mintModule,
    activeMintModuleReqs: activeMintReqs,
    ownerModule,
    activeOwnerModuleReqs: activeOwnerReqs,
    loadingClubDeposits: loading || loadingClubDeposits,
    refetch
  };
}
