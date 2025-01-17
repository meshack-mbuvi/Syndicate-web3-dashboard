import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { setERC20TokenDetails } from '@/state/erc20token/slice';
import { mockActiveERC20Token, mockDepositERC20Token } from '@/utils/mockdata';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

const DemoBanner: React.FC = () => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: { depositsEnabled: isOpenForDeposits }
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname } = router;
  const isManager = pathname === '/clubs/[clubAddress]/manage';

  const isDemoMode = useDemoMode();

  const handleSwitchClubStatus = (): void => {
    const mockData = isOpenForDeposits
      ? mockActiveERC20Token
      : mockDepositERC20Token;
    dispatch(setERC20TokenDetails(mockData));
  };

  const handleSwitchClubViewing = (): void => {
    void router.push({
      pathname: `/clubs/demo/${isManager ? '' : 'manage'}`,
      query: {
        status: isOpenForDeposits ? 'open' : 'active',
        chain: activeNetwork.network
      }
    });
  };

  if (isDemoMode) {
    return (
      <div className="container mx-auto sticky top-24 pt-1 z-30">
        <div className="bg-green-volt md:h-13 space-y-0 md:space-x-2 max-h-full rounded-4xl flex justify-between text-black text-sm">
          <div className="flex items-center self-center">
            <button
              className="border border-black rounded-4xl ml-2 my-2 flex items-center px-4 py-2"
              onClick={(): Promise<boolean> => router.push('/clubs')}
            >
              <div className="flex flex-row space-x-1">
                <img
                  className="h-5 w-5"
                  src="/images/demoMode/arrowLeft.svg"
                  alt=""
                />
                <span className="hidden lg:inline">Exit</span>
              </div>
            </button>
            <p
              className={`flex-shrink-0 text-base ml-4 hidden ${
                isOpenForDeposits ? '1.2lg:block' : 'lg:block'
              }`}
            >
              Viewing demo mode
            </p>
          </div>
          <div
            className={`self-center space-x-0 flex items-center justify-center flex-col py-2 ${
              isOpenForDeposits
                ? 'md:flex-row md:py-0 md:space-x-4'
                : 'sm:flex-row sm:py-0 sm:space-x-4'
            } `}
          >
            <button
              className={`border border-black rounded-4xl px-4 py-2 flex-shrink-0 mb-2 ${
                isOpenForDeposits ? 'md:mb-0' : 'sm:mb-0'
              }`}
              onClick={handleSwitchClubStatus}
            >
              <div className="flex items-center space-x-1">
                <span className="text-center">
                  Status: {isOpenForDeposits ? 'Open to deposits' : 'Active'}
                </span>
                <img
                  className="h-5 w-5"
                  src="/images/demoMode/repeat.svg"
                  alt=""
                />
              </div>
            </button>
            <button
              className="border border-black rounded-4xl px-4 py-2 flex-shrink-0"
              onClick={handleSwitchClubViewing}
            >
              <div className="flex items-center space-x-1">
                <span className="text-center">
                  Viewing as: Club {isManager ? 'admin' : 'member'}
                </span>
                <img
                  className="h-5 w-5"
                  src={
                    isManager
                      ? '/images/demoMode/crown.svg'
                      : '/images/demoMode/person.svg'
                  }
                  alt=""
                />
              </div>
            </button>
          </div>
          <div className="flex self-center">
            <button
              className="flex items-center text-white bg-black rounded-3xl mr-2 my-2 px-4 py-2 w-fit-content"
              onClick={() => {
                router.push('/clubs/create');
              }}
            >
              <span
                className={`hidden ${
                  isOpenForDeposits ? '1.2lg:inline' : 'lg:inline'
                } mr-2 flex-shrink-0`}
              >
                Create an investment club
              </span>
              <img
                className="h-4 w-4"
                src="/images/demoMode/straightArrowRight.svg"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default DemoBanner;
