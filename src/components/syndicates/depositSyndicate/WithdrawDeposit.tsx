import { RootState } from "@/redux/store";
import Link from "next/link";
import { useSelector } from "react-redux";

interface IProps {
  syndicateAddress: string | string[];
}

const WithdrawDeposit = ({ syndicateAddress }: IProps) => {
  const { syndicate } = useSelector(
    (state: RootState) => state.syndicatesReducer
  );

  return (
    <>
      <p className="py-4 px-2 text-xs text-gray-dim leading-4">MORE</p>
      <Link href={`/syndicates/${syndicateAddress}/withdraw`}>
        <div className="flex justify-start cursor-pointer items-center py-4 px-6 rounded-custom bg-gray-9 transition hover:bg-gray-6">
          <p className="font-medium text-lg">
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
          </p>
        </div>
      </Link>
    </>
  );
};

export default WithdrawDeposit;
