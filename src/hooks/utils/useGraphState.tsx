import { graphCurrentBlock } from '@/graphql/subgraph_queries';
import { AppState } from '@/state';
import { getCountDownDays } from '@/utils/dateUtils';
import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Time in seconds over which data from graph is considered stale.
const STALE_DATA_THRESHOLD = 60 * 5; // Defaulting to 5 minutes

interface IBlock {
  number: number;
  timestamp: number;
  parentHash: string;
}

/**
 * @dev The graph might take a while to to sync data from all nodes/ethereum blocks
 * resulting to stale data shown on our UI. This module is responsible for
 * determining where graph is fully synced. If not fully synced, how many blocks
 * is data stale.
 *
 * @return { lastSyncedBlock, timeToSyncPendingBlocks } where lastSyncedBlock is
 * a number representing the number of blocks that have been synced by the
 * graph for a given network and timeToSyncPendingBlocks.
 */
export const useGraphSyncState = (): {
  isDataStale: boolean;
  lastSyncedBlock: number;
  timeToSyncPendingBlocks: string;
} => {
  const {
    web3Reducer: {
      web3: { activeNetwork, web3 }
    }
  } = useSelector((state: AppState) => state);

  const [lastSyncedBlock, setLastSyncedBlock] = useState<number>(0);
  const [isDataStale, setIsDataStale] = useState(false);
  const [timeToSyncPendingBlocks, setTimeToSyncPendingBlocks] =
    useState<string>('');

  const { loading, data } = useQuery(graphCurrentBlock, {
    context: { clientName: 'theGraph', chainId: activeNetwork.chainId }
  });

  const getGraphStats = useCallback(
    async (lastSyncedBlock: number): Promise<void> => {
      const currentBlock: IBlock = (await web3.eth.getBlock(
        'latest'
      )) as IBlock;

      let timeToSyncRemainingBlocks = '';

      if (currentBlock.number !== null) {
        //only when block is mined not pending
        const previousBlock: IBlock = (await web3.eth.getBlock(
          currentBlock.parentHash
        )) as IBlock;

        if (previousBlock.number !== null) {
          const pendingBlockCount = currentBlock.number - lastSyncedBlock;

          // time is in seconds
          const timeTakenToMineBlock =
            currentBlock.timestamp - previousBlock.timestamp;

          const _timeToSyncRemainingBlocks =
            timeTakenToMineBlock * pendingBlockCount;

          setIsDataStale(_timeToSyncRemainingBlocks > STALE_DATA_THRESHOLD);

          const now = new Date();

          // We multiply block time with number of blocks remaining to be synced
          now.setSeconds(now.getSeconds() + _timeToSyncRemainingBlocks);

          timeToSyncRemainingBlocks = getCountDownDays(`${now.getTime()}`);
        }
      }

      setTimeToSyncPendingBlocks(timeToSyncRemainingBlocks);
    },
    [data, loading]
  );

  useEffect(() => {
    if (loading || !data) return;

    const {
      _meta: {
        block: { number }
      }
    } = data;

    setLastSyncedBlock(number);

    void getGraphStats(number);

    return (): void => {
      setLastSyncedBlock(0);
    };
  }, [data, getGraphStats, loading]);

  return {
    isDataStale,
    lastSyncedBlock,
    timeToSyncPendingBlocks
  };
};
