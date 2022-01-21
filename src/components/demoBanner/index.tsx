import { useDemoMode } from "@/hooks/useDemoMode";
import { AppState } from "@/state";
import { setERC20TokenDetails } from "@/state/erc20token/slice";
import { mockDepositERC20Token, mockActiveERC20Token } from "@/utils/mockdata";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

const DemoBanner: React.FC = () => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: { depositsEnabled: isOpenForDeposits },
    },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname } = router;
  const isManager = pathname === "/clubs/[clubAddress]/manage";

  const isDemoMode = useDemoMode();

  const handleSwitchClubStatus = () => {
    const mockData = isOpenForDeposits
      ? mockActiveERC20Token
      : mockDepositERC20Token;
    dispatch(setERC20TokenDetails(mockData));
  };

  const handleSwitchClubViewing = () => {
    router.push(`/clubs/demo/${isManager ? "" : "manage"}`);
  };

  if (isDemoMode) {
    return (
      <div className="container mx-auto">
        <div className="bg-green-electric-lime md:h-13 space-y-0 md:space-x-2 max-h-full rounded-4xl mt-24 flex md:flex-row flex-col justify-between text-black text-sm">
          <div className="flex items-center self-center">
            <button
              className="border border-black rounded-4xl ml-2 my-2 flex items-center px-4 py-2"
              onClick={() => router.push("/clubs")}
            >
              <div className="flex flex-row space-x-1">
                <img
                  className="h-5 w-5"
                  src="/images/demoMode/arrowLeft.svg"
                  alt=""
                />
                <span>Exit</span>
              </div>
            </button>
            <p className="text-base ml-4">Viewing demo mode</p>
          </div>
          <div className="self-center space-x-4 flex items-center">
            <button
              className="border border-black rounded-4xl px-4 py-2"
              onClick={handleSwitchClubStatus}
            >
              <div className="flex items-center space-x-1">
                <span className="text-center">
                  Status: {isOpenForDeposits ? "Open to deposits" : "Active"}
                </span>
                <img
                  className="h-5 w-5"
                  src="/images/demoMode/repeat.svg"
                  alt=""
                />
              </div>
            </button>
            <button
              className="border border-black rounded-4xl px-4 py-2"
              onClick={handleSwitchClubViewing}
            >
              <div className="flex items-center space-x-1">
                <span className="text-center">
                  Viewing as: Club {isManager ? "admin" : "member"}
                </span>
                <img
                  className="h-5 w-5"
                  src={
                    isManager
                      ? "/images/demoMode/crown.svg"
                      : "/images/demoMode/person.svg"
                  }
                  alt=""
                />
              </div>
            </button>
          </div>
          <div className="flex self-center">
            <button
              className="flex items-center text-white space-x-2 bg-black rounded-3xl mr-2 my-2 px-4 py-2"
              onClick={() => {
                router.push("/clubs/create");
              }}
            >
              <span>Create an investment club</span>
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
