import { RootState } from "@/redux/store";
import Link from "next/link";
import { useSelector } from "react-redux";

interface IProps {
  syndicateAddress: string | string[];
}

const WithdrawDeposit = ({ syndicateAddress }: IProps) => {
  const { syndicate } = useSelector((state: RootState) => state.syndicatesReducer);

  return (
    <>
      <p className="sm:ml-2 p-4 mx-2 sm:px-8 sm:py-4 text-xs text-gray-dim leading-4">
        MORE
      </p>
      <div className="flex justify-start items-center py-4 px-6 sm:ml-6 mx-2 rounded-custom bg-gray-9">
        <p className="font-medium text-lg">
          <Link href={`/syndicates/${syndicateAddress}/withdraw`}>
            <a className="flex items-center">
              <img
                className="inline mr-4 h-5"
                src="/images/withdrawDepositIcon.svg"
                alt="withdrawal icon"
              />
              {syndicate && syndicate.depositsEnabled
                ? "Withdraw My Deposit."
                : "Withdraw My Distributions."}
            </a>
          </Link>
        </p>
      </div>
    </>
  )
}

export default WithdrawDeposit;
