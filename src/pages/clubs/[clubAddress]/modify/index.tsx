import { ModifyClubSettings } from '@/components/modifyClub';
import ModifyTokenGatedClub from '@/components/modifyClub/modifyTokenGatedClub';
import LayoutWithSyndicateDetails from '@/containers/layoutWithSyndicateDetails';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';

const Modify: React.FC = () => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: { loading },
      isNewClub,
      loadingClubDeposits
    }
  } = useSelector((state: AppState) => state);

  return (
    <div className="relative container mx-auto pl-10">
      <LayoutWithSyndicateDetails managerSettingsOpen={true} />
      <div className="container mx-auto left-0 grid grid-cols-12 gap-5">
        <div className="md:col-start-1 md:col-end-8 col-span-12 text-white pb-10">
          {loading || loadingClubDeposits ? (
            <div /> /* TODO use skeleton loader */
          ) : isNewClub ? (
            <ModifyTokenGatedClub />
          ) : (
            <ModifyClubSettings isVisible={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Modify;
