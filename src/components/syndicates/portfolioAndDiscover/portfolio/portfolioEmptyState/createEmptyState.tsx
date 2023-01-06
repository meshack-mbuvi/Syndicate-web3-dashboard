import { AppState } from '@/state';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  CREATE_INVESTMENT_CLUB_CLICK,
  CREATE_COLLECTIVE_CLICK
} from '@/components/amplitude/eventNames';
import EmptyEntity, { EntityType } from './emptyEntity';

interface Props {
  emptyClubs?: boolean;
  emptyCollectives?: boolean;
  emptyDeals?: boolean;
}

const CreateEmptyState: React.FC<Props> = ({
  emptyClubs = true,
  emptyCollectives = true,
  emptyDeals = true
}) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const router = useRouter();

  const numEmpty =
    (emptyClubs ? 1 : 0) + (emptyCollectives ? 1 : 0) + (emptyDeals ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row md:divide-x md:justify-center space-y-36 md:space-y-0">
      {emptyClubs && (
        <EmptyEntity
          goToCreateFlow={(): void => {
            void amplitudeLogger(CREATE_INVESTMENT_CLUB_CLICK, {
              flow: Flow.CLUB_CREATE
            });
            void router.push({
              pathname: '/clubs/create',
              query: { chain: activeNetwork.network }
            });
          }}
          entityType={EntityType.CLUB}
          numEmpty={numEmpty}
          index={1}
        />
      )}
      {emptyCollectives && (
        <EmptyEntity
          goToCreateFlow={(): void => {
            void amplitudeLogger(CREATE_COLLECTIVE_CLICK, {
              flow: Flow.COLLECTIVE_CREATE
            });
            void router.push({
              pathname: 'collectives/create'
            });
          }}
          entityType={EntityType.COLLECTIVE}
          numEmpty={numEmpty}
          index={1 + (emptyClubs ? 1 : 0)}
        />
      )}
      {emptyDeals && (
        <EmptyEntity
          goToCreateFlow={(): void => {
            // void amplitudeLogger(CREATE_DEAL_CLICK, {
            //   flow: Flow.DEAL_CREATE
            // }); TODO: Add this amplitude log
            void router.push({
              pathname: 'deals/create'
            });
          }}
          entityType={EntityType.DEAL}
          numEmpty={numEmpty}
          index={1 + (emptyClubs ? 1 : 0) + (emptyCollectives ? 1 : 0)}
        />
      )}
    </div>
  );
};

export default CreateEmptyState;
