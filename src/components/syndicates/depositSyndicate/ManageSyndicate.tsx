import { RootState } from "@/redux/store";
import Link from "next/link";
import { useSelector } from "react-redux";

interface IProps {
  syndicateAddress: string | string[];
}

const ManageSyndicate = ({ syndicateAddress }: IProps): JSX.Element => {
  const { syndicate } = useSelector(
    (state: RootState) => state.syndicatesReducer,
  );
  const {
    web3: { account },
  } = useSelector((state: RootState) => state.web3Reducer);

  let url = "manage";
  let urlText = "Go to Management Page";
  let icon = "/images/syndicate-icon.png";

  if (syndicate?.managerCurrent !== account) {
    icon = "";
    if (syndicate?.depositsEnabled) {
      url = "deposit";
      urlText = "Go To Deposit Page";
    } else {
      url = "withdraw";
      urlText = "Go To Withdrawal Page";
    }
  }

  return (
    <>
      <p className="py-4 px-2 text-xs text-gray-dim leading-4">MORE</p>
      <Link href={`/syndicates/${syndicateAddress}/${url}`}>
        <div className="flex justify-start cursor-pointer items-center py-4 px-6 rounded-custom bg-gray-9 transition hover:bg-gray-6">
          <p className="font-medium text-lg">
            <a
              className="flex items-center"
              href={`/syndicates/${syndicateAddress}/${url}`}
            >
              <img
                className="inline mr-4 h-5"
                src={icon}
                alt="syndicate icon"
              />
              {urlText}
            </a>
          </p>
        </div>
      </Link>
    </>
  );
};

export default ManageSyndicate;
