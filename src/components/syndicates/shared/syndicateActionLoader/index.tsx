import { EtherscanLink } from "src/components/syndicates/shared/EtherscanLink";
import { constants } from "src/components/syndicates/shared/Constants";

interface LoaderProp {
  // the contract address the etherscan link should point to
  contractAddress: string | string[];
  headerText: string;
}

const { loaderSubtext } = constants;

/** loader component shown to the user when the application is in a
 * submitting state for allowance approvals, deposits, and withdrawals
 * */

export const SyndicateActionLoader = (props: LoaderProp) => {
  const { contractAddress, headerText } = props;
  return (
    <div className="flex flex-col items-center justify-center my-6 mx-6 md:mx-10 md:my-20 lg:mx-12 lg:my-24">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-white h-10 w-10"></div>
      <p className="font-semibold text-2xl text-center">{headerText}</p>
      <p className="text-sm my-5 font-normal text-gray-dim text-center">
        {loaderSubtext}
      </p>
      <EtherscanLink contractAddress={contractAddress} />
    </div>
  );
};
