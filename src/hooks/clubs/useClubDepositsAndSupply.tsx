import { useSyndicateDaOsQuery } from '@/hooks/data-fetching/thegraph/generated-types';
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
  activeMintModuleReqs: ModuleReqs | null;
  ownerModule: string;
  activeOwnerModuleReqs: ModuleReqs | null;
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
  const [activeOwnerReqs, setActiveOwnerReqs] = useState<ModuleReqs | null>({});
  const [activeMintReqs, setActiveMintReqs] = useState<ModuleReqs | null>({});

  const { isReady } = useRouter();
  const isDemoMode = useDemoMode();
  const dispatch = useDispatch();

  // SINGLE_CLUB_DETAILS
  const { loading, data, refetch } = useSyndicateDaOsQuery({
    variables: {
      where: {
        contractAddress: contractAddress?.toLocaleLowerCase()
      }
    },
    context: {
      clientName: SUPPORTED_GRAPHS.THE_GRAPH,
      chainId: activeNetwork.chainId
    },
    skip: !contractAddress || !activeNetwork.chainId || isDemoMode
  });

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

    let { startTime, endTime } = syndicateDAO;

    const activeModules = syndicateDAO.activeModules;

    if (activeModules.length > 0) {
      const mintModule = getModuleByType(
        ModuleType.MINT,
        activeModules,
        activeNetwork
      );
      let _activeMintReqs: ModuleReqs | null = null;

      if (mintModule) {
        _activeMintReqs = getReqsByModuleType(
          ModuleType.MINT,
          activeModules,
          activeNetwork,
          mintModule
        );
        setMintModule(web3.utils.toChecksumAddress(mintModule.contractAddress));
        setActiveMintReqs(_activeMintReqs);
      }

      const ownerModule = getModuleByType(
        ModuleType.OWNER,
        activeModules,
        activeNetwork
      );
      let _activeOwnerReqs: ModuleReqs | null = null;

      if (ownerModule) {
        _activeOwnerReqs = getReqsByModuleType(
          ModuleType.OWNER,
          activeModules,
          activeNetwork,
          ownerModule
        );
        setOwnerModule(ownerModule.contractAddress);
        setActiveOwnerReqs(_activeOwnerReqs);
      }

      startTime = `${_activeMintReqs?.startTime ?? ''}`;
      endTime = `${_activeMintReqs?.endTime ?? ''}`;

      if (_activeMintReqs && _activeOwnerReqs) {
        dispatch(
          setActiveModuleDetails({
            hasActiveModules: activeModules.length > 0,
            activeModules: activeModules,
            mintModule:
              web3.utils.toChecksumAddress(mintModule?.contractAddress ?? '') ??
              '',
            activeMintModuleReqs: _activeMintReqs,
            ownerModule:
              web3.utils.toChecksumAddress(
                ownerModule?.contractAddress ?? ''
              ) ?? '',
            activeOwnerModuleReqs: _activeOwnerReqs
          })
        );
        dispatch(setIsNewClub(activeModules.length > 0));
      }
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
