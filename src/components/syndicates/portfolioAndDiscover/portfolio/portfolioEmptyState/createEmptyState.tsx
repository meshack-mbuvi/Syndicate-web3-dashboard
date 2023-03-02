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

  const dividerStyles = 'border-gray-syn7';
  const paddingSizelg = 10;
  const paddingSizexl = 12;
  const paddingSize2xl = 13;
  const paddingSize3xl = 16;

  return (
    <div className="flex flex-col lg:flex-row lg:divide-x lg:justify-center space-y-24 lg:space-y-0 lg:w-9/12">
      {emptyClubs && (
        <div
          className={`lg:pr-${paddingSizelg} xl:pr-${paddingSizexl} 2xl:pr-${paddingSize2xl} 3xl:pr-${paddingSize3xl} ${dividerStyles}`}
        >
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
          />
        </div>
      )}
      {emptyCollectives && (
        <div
          className={`lg:px-${paddingSizelg} xl:px-${paddingSizexl} 2xl:px-${paddingSize2xl} 3xl:px-${paddingSize3xl} ${dividerStyles}`}
        >
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
          />
        </div>
      )}
      {emptyDeals && (
        <div
          className={`lg:pl-${paddingSizelg} xl:px-${paddingSizexl} 2xl:pl-${paddingSize2xl} 3xl:px-${paddingSize3xl} ${dividerStyles}`}
        >
          <EmptyEntity
            goToCreateFlow={(): void => {
              // TODO [ENG-4866]: Add create deal click event
              // void amplitudeLogger(CREATE_DEAL_CLICK, {
              //   flow: Flow.DEAL_CREATE
              // });
              void router.push({
                pathname: 'deals/create'
              });
            }}
            entityType={EntityType.DEAL}
            numEmpty={numEmpty}
          />
        </div>
      )}
    </div>
  );
};

export default CreateEmptyState;
